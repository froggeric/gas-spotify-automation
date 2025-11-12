/*
  everynoise is dead, but at least the automatically generated playlists
  from Particle Detector are still updating.
  The Edge of: Some less-known music that fans are listening to now
  The Pulse of: music that fans are listening to now
*/

function ParticleDetector() {

  let today = (new Date()).toISOString().split('T')[0];

  main();

  function main() {
  
    // BACHATA
      updatePlaylistWithNewReleases({
      sourcePlaylists: [ // Array of playlist IDs containing new releases
        "4Oh7VjZaw4etsvKXVqRAft", // The Edge of Bachata
        "1crLsY1eKUWl3DBGO53IEj",  // The Edge of Bachata Dominicana
        "7gNCVZ5IkLkANU7PEFI7ld", // The Pulse of Bachata
        "2MnzrrsHfD5t2EpC5QikN1" // The Pulse of Bachata Dominicana
      ],
      name: "everynoise bachata",
      targetPlaylist: "6f4LjtkW7i95IB0Pvo0tmC", // Playlist ID to update
      maxDaysOfReleases: 120, // Number of days to consider for new releases
      maxDaysToKeep: 120, // Number of days to keep in history
    });

    // SALSA
      updatePlaylistWithNewReleases({
      sourcePlaylists: [ // Array of playlist IDs containing new releases
        "6yrKLhh8PE0XVCq2LEnlky", // The Edge of Salsa
        "6ucvo7afTd2HIdT73wOm7L", // The Edge of Salsa Puertorriqueña
        "4eyRxsp4EPMbAxLOnP6fE1", // The Edge of Boogaloo
        "63VCwSFNcCjJmjIZXL63Wl", // The Edge of Salsa Colombiana
        "3UTqFkRhqDNAiVEy3WYxkZ", // The Edge of Modern Salsa
        "3fyWWRGtlCeW8eZDeezvHG", // The Edge of Salsa International
        "3g0n2TLlCNBs6bZAPCnRvO", // The Edge of Salsa Peruana
        "5yyN0reWiZnWKAeMXVZKZs", // The Edge of Salsa Cubana
        "2R6AsazqC8PPFL6nKtbycb", // The Edge of Salsa Venezolana
        "17JoxCu7oUSKGXOGdkLvM5", // The Edge of Timba
        "6VzySrA2aSOPu7nuCeGwv3", // The Pulse of Salsa
        "1EBDmemM0OM9avyqzzZxG5", // The Pulse of Salsa Puertorriqueña
        "3B1vQUgt4r6rPTCgENIby4", // The Pulse of Boogaloo
        "3tzPXbuyoNX63SQgkvMiqM", // The Pulse of Salsa Coombiana
        "1x0cUQGdUWX7jj7IcDVyRW", // The Pulse of Modern Salsa
        "6VxY8lszjwwomDrrBCbPra", // The Pulse of Salsa International
        "3nd4kSNtXpP7SDyrAXZgsB", // The Pulse of Salsa Peruana
        "5T9fe6SjLmx4qCUGz1oor0", // The Pulse of Salsa Cubana
        "1PiXFDWq9kTYN86BB1pPOw", // The Pulse of Salsa Venezolana
        "4eTqJztpnsT2bhWbCIOWXA" // The Pulse of Timba
      ],
      name: "everynoise salsa",
      targetPlaylist: "", // Playlist ID to update
      maxDaysOfReleases: 120, // Number of days to consider for new releases
      maxDaysToKeep: 120, // Number of days to keep in history
    });

    // // MERENGUE
    //   updatePlaylistWithNewReleases({
    //   sourcePlaylists: [ // Array of playlist IDs containing new releases
    //     "", // The Pulse of 
    //     "", // The Pulse of 
    //     "", // The Pulse of 
    //     "", // The Pulse of 
    //     "", // The Pulse of 
    //     "", // The Edge of 
    //     "", // The Edge of 
    //     "", // The Edge of 
    //     "", // The Edge of 
    //     "", // The Edge of 
    //   ],
    //   name: "everynoise merengue",
    //   targetPlaylist: "", // Playlist ID to update
    //   maxDaysOfReleases: 120, // Number of days to consider for new releases
    //   maxDaysToKeep: 120, // Number of days to keep in history
    // });

    // CUMBIA
      updatePlaylistWithNewReleases({
      sourcePlaylists: [ // Array of playlist IDs containing new releases
        "2XaltzM3QECoYbFS34yvd5", // The Pulse of Cumbia Villera
        "2sEfLvmM4bqlG0vcJSKJd4", // The Pulse of Cumbia Sonidera
        "5qCTS87Sf9izCK0ZC0C20G", // The Pulse of Cumbia Pop
        "3HiqFiw74LIUSNxU77AHZx", // The Pulse of Cumbia Sureña
        "2Gg4Fgl7ZblTmmCLsA0tT3", // The Pulse of Cumbia Funk
        "6KHtUiAdkgNioB5bCWHBZX"  // The Pulse of Cumbia
      ],
      name: "everynoise cumbia",
      targetPlaylist: "5OvN1nZ7z8Z8iwiUSGburb", // Playlist ID to update
      maxDaysOfReleases: 120, // Number of days to consider for new releases
      maxDaysToKeep: 120, // Number of days to keep in history
    });

  }

  /**
   * Updates a Spotify playlist with new releases, removes duplicates and old tracks.
   *
   * @param {string[]} sourcePlaylists - Array of Spotify playlist IDs containing new releases.
   * @param {string} targetPlaylist - Spotify playlist ID to update.
   * @param {number} maxDaysOfReleases - Number of days to consider for new releases.
   * @param {number} maxDaysToKeep - Number of days to keep tracks in the playlist.
   */
  function updatePlaylistWithNewReleases(params = {name, sourcePlaylists, targetPlaylist, maxDaysOfReleases, maxDaysToKeep} ) {
    let name = params.name;
    let newReleasePlaylistIDs = params.sourcePlaylists;
    let existingPlaylistID = params.targetPlaylist;
    let releaseLimit = params.maxDaysOfReleases;
    let historyLimit  = params.maxDaysToKeep;

    // Gather new tracks from multiple playlists
    let newTracks = [];
    newReleasePlaylistIDs.map( id => {
      Combiner.push( newTracks, Source.getPlaylistTracks('', id))
    });
    Logger.log(`Found ${newTracks.length} tracks in particle detector playlists.`);
    // Remove duplicates
    Filter.dedupTracks(newTracks);
    Logger.log(`Found ${newTracks.length} unique tracks in particle detector playlists.`);

    // Load existing tracks from target playlist
    let existingTracks = Source.getPlaylistTracks('', existingPlaylistID);
    Logger.log(`Loaded ${existingTracks.length} tracks from existing release tracker playlist.`);

    // Remove existing tracks from new tracks
    Filter.removeTracks(newTracks, existingTracks);
    Logger.log(`${newTracks.length} new tracks remaining after removing existing ones.`);

    // Removed cached tracks
    // (ie: previously added, but could have been already been deleted from existing playlist)
    const cachedTracks = Cache.read("releaseTracker.json");
    Filter.removeTracks(newTracks, cachedTracks);
    Logger.log(`${newTracks.length} new tracks remaining after filtering against cache.`);
    
    // Only keep new releases that satisfy the max release age
    // (we do it now, after all the other filtering, as this is a query intensive task)
    const releaseFilter = {
      album: {
        release_date: { sinceDays: releaseLimit, beforeDays: 0 },
      },
    };
    Filter.rangeTracks(newTracks, releaseFilter);
    Logger.log(`${newTracks.length} tracks released within the past ${releaseLimit} days.`);

    // Update cache with new tracks
    if (newTracks.length > 0) {
      const compressedTracks = Cache.compressTracks(newTracks);
      Cache.append("releaseTracker.json", compressedTracks);
      Logger.log(`Added ${newTracks.length} tracks to cache file.`);
    }

    // Combine new and existing tracks
    Combiner.push(existingTracks, newTracks);
    Logger.log(`Combined playlist now has ${existingTracks.length} tracks.`);

    // Sort by release date
    Order.sort(existingTracks, "album.release_date", false);

    // Trim playlist based on history limit
    const historyFilter = {
      album: {
        release_date: { sinceDays: historyLimit, beforeDays: 0 },
      },
    };
    Filter.rangeTracks(existingTracks, historyFilter);
    Logger.log(`Trimmed playlist to ${existingTracks.length} tracks within history limit.`);

    // Update playlist with new track list and description
    const description = `[${today}] Added ${newTracks.length} new tracks.`;
    Playlist.saveWithReplace({
      name: name,
      id: existingPlaylistID,
      tracks: existingTracks,
      description: description
    });
  Logger.log(`Playlist updated with new tracks and description.`);
  }

}
