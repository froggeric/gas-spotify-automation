/**
 * @OnlyCurrentDoc
 * This script syncs an artist's entire Spotify catalog to a Google Sheet.
 * It uses a hybrid model: it discovers all API-visible tracks automatically and cross-checks
 * against all URIs present in the sheet to ensure a complete and up-to-date catalog.
 * It performs a conditional write and sends highly granular email reports.
 */

// Define the exact headers the script will manage.
const HEADERS = [
  'ISRC', 'Song Title', 'Album Title', 'Artist Name', 'Featured Artists',
  'Duration (mm:ss)', 'Track Number', 'Release Date', 'Popularity', 'UPC',
  'Label', 'Genre', 'Availability', 'Copyrights', 'Producers', 'Spotify URI'
];

/**
 * Main function to synchronize an artist's Spotify catalog with a Google Sheet.
 * @param {string} artistUri The full Spotify URI for the artist.
 * @param {string} sheetUrl The URL of the destination Google Sheet file.
 * @param {string} reportEmail The email address for notifications.
 * @param {boolean} forceUpdate If true, overwrites data mismatches.
 * @param {string} [sheetName=null] The specific name of the tab (sheet) to use within the spreadsheet.
 */
function syncArtistCatalog(artistUri, sheetUrl, reportEmail, forceUpdate = false, sheetName = null) {
  Logger.log(`Starting catalog sync for artist URI: ${artistUri}`);

  try {
    const artistId = artistUri.split(':')[2];
    if (!artistId) throw new Error('Invalid Artist URI provided. It must be in the format "spotify:artist:..."');
    
    const ss = SpreadsheetApp.openByUrl(sheetUrl);
    let sheet;
    if (sheetName) {
      sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        Logger.log(`Created new sheet named "${sheetName}" because it did not exist.`);
      }
    } else {
      sheet = ss.getSheets()[0];
    }
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      Logger.log('Sheet was empty. Created the header row.');
    }
    validateSheetHeaders(sheet);

    const sheetDataWithHeaders = sheet.getDataRange().getValues();
    const actualSheetHeaders = sheetDataWithHeaders.shift() || [];
    const headerMap = createHeaderMap(actualSheetHeaders);

    const normalizedSheetData = normalizeSheetData(sheetDataWithHeaders, headerMap);

    const sheetDataByIsrc = {};
    const sheetTrackIds = new Set();
    normalizedSheetData.forEach(row => {
      const isrc = row[headerMap.ISRC];
      if (isrc) sheetDataByIsrc[isrc] = row;
      const uri = row[headerMap['Spotify URI']];
      if (uri && uri.startsWith('spotify:track:')) sheetTrackIds.add(uri.split(':')[2]);
    });
    Logger.log(`Found ${Object.keys(sheetDataByIsrc).length} existing tracks and a total of ${sheetTrackIds.size} unique URIs in the Sheet.`);

    const artist = Source.getArtists({ include: [{ id: artistId }] })[0];
    if (!artist) throw new Error(`Could not find artist with ID: ${artistId}`);
    const artistName = artist.name;
    const artistGenre = artist.genres.join(', ');

    const discoveredTracksSimplified = Source.getArtistsTracks({
      artist: { include: [{ id: artistId }] },
      album: { groups: 'album,single,compilation,appears_on' }
    });
    
    const restrictionsMap = {};
    discoveredTracksSimplified.forEach(track => {
      if (track.restrictions) restrictionsMap[track.id] = track.restrictions;
    });
    Filter.dedupTracks(discoveredTracksSimplified);
    const discoveredTrackIds = new Set(discoveredTracksSimplified.map(t => t.id).filter(Boolean));
    Logger.log(`Discovered ${discoveredTrackIds.size} unique simplified tracks and captured restriction data.`);

    const allTrackIdsToHydrate = [...new Set([...discoveredTrackIds, ...sheetTrackIds])];
    Logger.log(`Preparing to hydrate a combined total of ${allTrackIdsToHydrate.length} unique tracks from API and Sheet.`);
    
    const fullTracks = SpotifyRequest.getFullObjByIds('tracks', allTrackIdsToHydrate, 50);
    const allAlbumIdsToHydrate = [...new Set(fullTracks.map(t => t && t.album ? t.album.id : null).filter(Boolean))];
    const fullAlbums = SpotifyRequest.getFullObjByIds('albums', allAlbumIdsToHydrate, 20);
    const fullAlbumsMap = fullAlbums.reduce((map, a) => { if(a) map[a.id] = a; return map; }, {});

    let allTracksHydrated = fullTracks.map(track => {
      if (track && track.album && fullAlbumsMap[track.album.id]) {
        track.album = fullAlbumsMap[track.album.id];
        if (restrictionsMap[track.id]) track.restrictions = restrictionsMap[track.id];
        return track;
      }
      return null;
    }).filter(Boolean);
    Logger.log(`Successfully hydrated and merged ${allTracksHydrated.length} tracks.`);

    let reconciledSheetData = [];
    const report = {
      newTracks: [], availabilityChanges: [], popularityChanges: [],
      filledBlanks: [], genreChange: null, mismatches: [], notFoundInSpotify: []
    };
    const processedIsrcs = new Set();
    const userCountry = User.country;
    
    const oldArtistGenre = normalizedSheetData.length > 0 ? normalizedSheetData[0][headerMap['Genre']] : '';
    if (oldArtistGenre && oldArtistGenre !== artistGenre) {
      report.genreChange = `Artist genre has changed from "${oldArtistGenre}" to "${artistGenre}". All tracks have been updated.`;
    }

    allTracksHydrated.forEach(hydratedTrack => {
      if (!hydratedTrack.external_ids || !hydratedTrack.external_ids.isrc) {
        Logger.log(`Skipping track "${hydratedTrack.name}" because it has no ISRC.`);
        return;
      }
      const isrc = hydratedTrack.external_ids.isrc;
      processedIsrcs.add(isrc);
      const spotifyRowData = mapSpotifyTrackToSheetRow(hydratedTrack, artistName, artistGenre, headerMap, actualSheetHeaders.length, userCountry);
      const existingSheetRow = sheetDataByIsrc[isrc];
      if (existingSheetRow) {
        const reconciledRow = reconcileRow(existingSheetRow, spotifyRowData, headerMap, isrc, forceUpdate, report);
        reconciledSheetData.push(reconciledRow);
      } else {
        reconciledSheetData.push(spotifyRowData);
        report.newTracks.push(`- Title: ${hydratedTrack.name}, ISRC: ${isrc}`);
      }
    });

    const initialIsrcs = new Set(Object.keys(sheetDataByIsrc));
    initialIsrcs.forEach(isrc => {
      if (!processedIsrcs.has(isrc)) {
        const missingRow = sheetDataByIsrc[isrc];
        reconciledSheetData.push(missingRow);
        const songTitle = missingRow[headerMap['Song Title']] || 'Unknown Title';
        report.notFoundInSpotify.push(`- Title: ${songTitle}, ISRC: ${isrc}`);
      }
    });

    // =================================================================
    // NEW STEP: DEDUPLICATION AND SURVIVORSHIP
    // Final cleanup to handle ISRC collisions caused by re-linking.
    // =================================================================
    const finalSheetData = deduplicateByIsrc(reconciledSheetData, headerMap);
    Logger.log(`Deduplication complete. Final track count is ${finalSheetData.length}.`);

    const originalDataString = JSON.stringify(normalizedSheetData);
    const finalDataString = JSON.stringify(finalSheetData);
    
    if (originalDataString === finalDataString) {
      Logger.log('No data changes detected. Sheet will not be updated.');
      report.noChanges = true;
    } else {
      const finalSheetValues = [actualSheetHeaders, ...finalSheetData];
      sheet.clearContents();
      sheet.getRange(1, 1, finalSheetValues.length, actualSheetHeaders.length).setValues(finalSheetValues);
      Logger.log('Data changes detected. Successfully synced data to Google Sheet.');
    }

    sendEmailReport(artistName, report, reportEmail, forceUpdate);

  } catch (e) {
    Logger.log(`FATAL ERROR for ${artistUri}: ${e.message}\nStack: ${e.stack}`);
    MailApp.sendEmail(reportEmail, `Error during Spotify Catalog Sync for Artist`, `The script failed while processing artist URI ${artistUri} with the following error: ${e.message}`);
  }
}

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

/**
 * NEW: Final deduplication step to handle ISRC collisions from re-linked tracks.
 * It prioritizes keeping the 'Available' track.
 * @param {Array<Array<string>>} sheetData The fully reconciled but potentially duplicated data.
 * @param {Object} headerMap A map of header names to their column indices.
 * @return {Array<Array<string>>} A clean 2D array with no duplicate ISRCs.
 */
function deduplicateByIsrc(sheetData, headerMap) {
  const finalDataByIsrc = {};
  const availabilityIndex = headerMap['Availability'];
  const isrcIndex = headerMap['ISRC'];

  sheetData.forEach(row => {
    const isrc = row[isrcIndex];
    if (!isrc) return; // Ignore rows without an ISRC

    const existingRow = finalDataByIsrc[isrc];
    if (!existingRow) {
      // First time seeing this ISRC, just store it.
      finalDataByIsrc[isrc] = row;
    } else {
      // An ISRC collision has occurred. Apply survivorship rule.
      const isExistingAvailable = existingRow[availabilityIndex] === 'Available';
      const isCurrentAvailable = row[availabilityIndex] === 'Available';

      // The new 'Available' track wins over an old 'Unavailable' one.
      if (isCurrentAvailable && !isExistingAvailable) {
        finalDataByIsrc[isrc] = row;
      }
      // Otherwise, we keep the existing one (or let the last-seen overwrite if statuses are the same).
      // If the current row is the most up-to-date from Spotify, it will naturally overwrite.
      else if (isCurrentAvailable === isExistingAvailable) {
        finalDataByIsrc[isrc] = row;
      }
    }
  });

  return Object.values(finalDataByIsrc);
}


function normalizeSheetData(rawData, headerMap) {
  const releaseDateIndex = headerMap['Release Date'];
  const durationIndex = headerMap['Duration (mm:ss)'];

  return rawData.map(row => {
    return row.map((cell, index) => {
      if (cell instanceof Date) {
        if (index === releaseDateIndex) return Utilities.formatDate(cell, 'UTC', 'yyyy-MM-dd');
        if (index === durationIndex) {
          const minutes = cell.getMinutes();
          const seconds = cell.getSeconds();
          return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }
      }
      return cell !== undefined ? String(cell) : '';
    });
  });
}

function validateSheetHeaders(sheet) {
  const actualHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const missingHeaders = HEADERS.filter(h => !actualHeaders.includes(h));
  if (missingHeaders.length > 0) throw new Error(`Sheet is missing required headers: ${missingHeaders.join(', ')}.`);
}

function createHeaderMap(headers) {
  return headers.reduce((map, header, i) => { map[header] = i; return map; }, {});
}

function mapSpotifyTrackToSheetRow(hydratedTrack, artistName, artistGenre, headerMap, totalColumns, userCountry) {
  const row = new Array(totalColumns).fill('');
  const album = hydratedTrack.album;
  const isAvailable = hydratedTrack.available_markets && hydratedTrack.available_markets.includes(userCountry);
  
  row[headerMap['ISRC']] = hydratedTrack.external_ids.isrc || '';
  row[headerMap['Song Title']] = hydratedTrack.name || '';
  row[headerMap['Album Title']] = album.name || '';
  row[headerMap['Artist Name']] = artistName;
  row[headerMap['Featured Artists']] = hydratedTrack.artists.filter(a => a.name !== artistName).map(a => a.name).join(', ') || '';
  row[headerMap['Duration (mm:ss)']] = msToMinutesSeconds(hydratedTrack.duration_ms);
  row[headerMap['Track Number']] = String(hydratedTrack.track_number || '');
  row[headerMap['Release Date']] = album.release_date || '';
  row[headerMap['Popularity']] = hydratedTrack.popularity !== undefined ? String(hydratedTrack.popularity) : '';
  row[headerMap['UPC']] = album.external_ids.upc || '';
  row[headerMap['Label']] = album.label || '';
  row[headerMap['Genre']] = artistGenre;
  row[headerMap['Availability']] = isAvailable ? 'Available' : 'Unavailable';
  row[headerMap['Copyrights']] = (album.copyrights || []).filter(c => c.type === 'C').map(c => c.text).join(', ') || '';
  row[headerMap['Producers']] = (album.copyrights || []).filter(c => c.type === 'P').map(c => c.text).join(', ') || '';
  row[headerMap['Spotify URI']] = hydratedTrack.uri || '';
  return row;
}

function reconcileRow(existingRow, spotifyRow, headerMap, isrc, forceUpdate, report) {
  const finalRow = [...existingRow]; 
  const songTitle = spotifyRow[headerMap['Song Title']] || 'Unknown Title';
  const fieldsToSilentlyOverwrite = ['Release Date', 'Duration (mm:ss)', 'Genre', 'Track Number', 'Spotify URI'];

  HEADERS.forEach(header => {
    const colIndex = headerMap[header];
    if (colIndex === undefined) return;
    
    const sheetValue = existingRow[colIndex];
    const spotifyValue = spotifyRow[colIndex];

    if (fieldsToSilentlyOverwrite.includes(header)) {
      finalRow[colIndex] = spotifyValue;
      return;
    }
    
    if (header === 'Popularity' || header === 'Availability') {
       if (sheetValue !== spotifyValue) {
        if (header === 'Popularity') report.popularityChanges.push(`- "${songTitle}": ${sheetValue} -> ${spotifyValue}`);
        else if (header === 'Availability') report.availabilityChanges.push(`- "${songTitle}": ${sheetValue} -> ${spotifyValue}`);
      }
      finalRow[colIndex] = spotifyValue;
      return;
    }

    if (sheetValue === '' && spotifyValue !== '') {
      finalRow[colIndex] = spotifyValue;
      report.filledBlanks.push(`- Filled missing '${header}' for "${songTitle}"`);
    } else if (sheetValue !== spotifyValue) {
      const mismatchDetail = `- Mismatch on '${header}' for "${songTitle}". Sheet: "${sheetValue}", Spotify: "${spotifyValue}"`;
      report.mismatches.push(mismatchDetail);
      if (forceUpdate) finalRow[colIndex] = spotifyValue;
    }
  });
  return finalRow;
}

function sendEmailReport(artistName, report, reportEmail, forceUpdate) {
  let subject = `Spotify Catalog Sync Report for ${artistName}`;
  let body = `<h2>Spotify Catalog Sync Report for ${artistName}</h2>`;
  const hasChanges = Object.values(report).some(value => Array.isArray(value) ? value.length > 0 : value) || report.genreChange;

  if (report.noChanges || !hasChanges) {
    body += `<p>Sync ran successfully. No changes were found between Spotify and your Google Sheet.</p>`;
  } else {
    if (report.newTracks.length > 0) body += `<h3>New Tracks Found on Spotify</h3><ul><li>${report.newTracks.join('</li><li>')}</li></ul>`;
    if (report.genreChange) body += `<h3>Artist Genre Change</h3><p>${report.genreChange}</p>`;
    if (report.availabilityChanges.length > 0) body += `<h3>Availability Status Changes</h3><ul><li>${report.availabilityChanges.join('</li><li>')}</li></ul>`;
    if (report.popularityChanges.length > 0) body += `<h3>Popularity Score Updates</h3><ul><li>${report.popularityChanges.join('</li><li>')}</li></ul>`;
    if (report.filledBlanks.length > 0) body += `<h3>Missing Information Filled</h3><ul><li>${report.filledBlanks.join('</li><li>')}</li></ul>`;
    if (report.mismatches.length > 0) {
      const mismatchTitle = forceUpdate ? `<h3>Data Mismatches Found and Overwritten</h3>` : `<h3>WARNING: Data Mismatches Found</h3><p>The following data in your sheet differs from Spotify. The sheet data was NOT changed. To overwrite this data with Spotify's, set the 'forceUpdate' parameter to 'true' in the Control Sheet.</p>`;
      body += `${mismatchTitle}<ul><li>${report.mismatches.join('</li><li>')}</li></ul>`;
    }
    if (report.notFoundInSpotify.length > 0) body += `<h3>Tracks in Sheet Not Found on Spotify</h3><p>The following tracks were in your sheet but could not be found via the Spotify API. They have been preserved in your sheet.</p><ul><li>${report.notFoundInSpotify.join('</li><li>')}</li></ul>`;
  }
  
  MailApp.sendEmail({ to: reportEmail, subject: subject, htmlBody: body });
  Logger.log(`Email report sent to ${reportEmail}.`);
}

function msToMinutesSeconds(ms) {
  if (typeof ms !== 'number') return '';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


// =============================================================================
// USAGE
// =============================================================================

/**
 * Main function to run the catalog sync for all artists listed in the Control Sheet.
 * Set up a time-based trigger in Apps Script to run this single function automatically.
 */
function syncAllArtistCatalogs() {
  
  // URL of the spreadsheet that contains the "ControlSheet" tab.
  const controlSheetUrl = 'https://docs.google.com/spreadsheets/d/1RRKmjZHAPwTeJd35F3XlWhs7u3dFujm2n8o_DM4yWjU/edit?usp=sharing';
  const controlSheetName = 'ControlSheet';

  const ss = SpreadsheetApp.openByUrl(controlSheetUrl);
  const controlSheet = ss.getSheetByName(controlSheetName);

  if (!controlSheet) {
    throw new Error(`Could not find the control sheet named "${controlSheetName}" in the spreadsheet.`);
  }

  const configs = controlSheet.getDataRange().getValues();
  const headers = configs.shift();
  const headerMap = createHeaderMap(headers);

  configs.forEach((row, index) => {
    const isEnabled = row[headerMap['Enabled']];
    if (isEnabled === true) {
      const artistName = row[headerMap['Artist Name']];
      Logger.log(`--- Starting sync for artist: ${artistName} (Row ${index + 2}) ---`);

      const artistUri = row[headerMap['Artist URI']];
      const sheetUrl = row[headerMap['Sheet URL']];
      const catalogSheetName = row[headerMap['Catalog Sheet Name']];
      const reportEmail = row[headerMap['Report Email']];
      const forceUpdate = row[headerMap['Force Update']] === true;

      if (!artistUri || !sheetUrl || !reportEmail) {
        Logger.log(`Skipping row ${index + 2} due to missing Artist URI, Sheet URL, or Report Email.`);
        return;
      }
      
      syncArtistCatalog(artistUri, sheetUrl, reportEmail, forceUpdate, catalogSheetName);
      Logger.log(`--- Finished sync for artist: ${artistName} ---`);
    }
  });
}
