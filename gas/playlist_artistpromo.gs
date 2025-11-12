/**
 * Creates or updates an artist's promotional playlist by combining tracks from an artist-specific
 * playlist and a general promotional playlist according to a detailed set of rules.
 * This function is designed to be fault-tolerant; it will not modify the combined
 * playlist if any error occurs during the track preparation phase.
 *
 * @param {{
 *   artistPlaylist: {id: string, name: string},
 *   promoPlaylist: {id: string, name: string},
 *   combinedPlaylist: {id: string, name: string}
 * }} params An object containing the configuration for the three playlists.
 * @property {object} params.artistPlaylist - The playlist containing only the artist's own tracks.
 *           The first 3 tracks are treated as top priorities.
 * @property {object} params.promoPlaylist - The playlist containing tracks from other artists for promotion.
 * @property {object} params.combinedPlaylist - The target playlist to be updated. Its existing content will be replaced.
 *           Its name, description, and cover art will be preserved.
 * @param {number} [extraInterval=0] - An optional integer to increase the number of promo tracks.
 */
function createArtistPromoPlaylist(params, extraInterval = 0) {
  const { artistPlaylist, promoPlaylist, combinedPlaylist } = params;

  Logger.log(`Starting to build playlist: "${combinedPlaylist.name}" with extra interval: ${extraInterval}...`);

  try {
    // =================================================================
    // STEP 1: FETCH ALL TRACKS FROM SOURCE PLAYLISTS
    // =================================================================
    const artistTracks = Source.getTracks([{ id: artistPlaylist.id, name: artistPlaylist.name }]);
    let promoTracksSource = Source.getTracks([{ id: promoPlaylist.id, name: promoPlaylist.name }]);

    if (!artistTracks || artistTracks.length === 0) {
      Logger.log(`Warning: The artist playlist "${artistPlaylist.name}" is empty or could not be found. Aborting.`);
      return;
    }
    if (!promoTracksSource || promoTracksSource.length === 0) {
      Logger.log(`Warning: The promo playlist "${promoPlaylist.name}" is empty or could not be found. Aborting.`);
      return;
    }

    // =================================================================
    // NEW: STEP 1.5: CLEAN PROMO PLAYLIST OF ARTIST'S OWN TRACKS
    // This is a critical step to ensure data integrity and prevent logical errors.
    // =================================================================
    const artistId = artistTracks[0].artists[0].id;
    const promoCountBefore = promoTracksSource.length;

    promoTracksSource = promoTracksSource.filter(track => {
      // A track is kept if NONE of its artists match the main artist's ID.
      return !track.artists.some(artist => artist.id === artistId);
    });
    
    const promoCountAfter = promoTracksSource.length;
    if (promoCountBefore > promoCountAfter) {
      Logger.log(`Cleanup: Removed ${promoCountBefore - promoCountAfter} of your own tracks that were found in the promo playlist.`);
    }

    const initialTotalTracks = artistTracks.length + promoTracksSource.length;
    Logger.log(`Fetched ${artistTracks.length} tracks from artist playlist and ${promoTracksSource.length} (after cleanup) from promo playlist. Total: ${initialTotalTracks}`);

    // =================================================================
    // STEP 2: CREATE "CRATES" (COLLECTIONS OF TRACKS)
    // =================================================================

    // --- Artist Crates ---
    const top3ArtistTracks = Selector.sliceFirst(artistTracks, 3);
    const otherArtistTracks = Selector.sliceAllExceptFirst(artistTracks, 3);

    // --- Promo Crates (based on popularity) ---
    // First, sort all promo tracks by popularity in descending order.
    // The Order.sort function handles fetching full track objects with popularity data.
    Order.sort(promoTracksSource, 'meta.popularity', 'desc');

    const totalPromoTracks = promoTracksSource.length;
    const topCount = Math.ceil(totalPromoTracks * 0.20);
    const midCount = Math.ceil(totalPromoTracks * 0.30);

    const topTracks = Selector.sliceFirst(promoTracksSource, topCount);
    const midTracks = promoTracksSource.slice(topCount, topCount + midCount);
    const lowTracks = Selector.sliceAllExceptFirst(promoTracksSource, topCount + midCount);

    Logger.log(`Created promo crates: Top(${topTracks.length}), Mid(${midTracks.length}), Low(${lowTracks.length})`);


    // =================================================================
    // STEP 3: BUILD THE FINAL PLAYLIST - TOP SECTION
    // =================================================================
    const finalTracks = [];

    // Helper to safely remove a track from its original crate by its ID
    const removeFromCrates = (trackId) => {
        let topIndex = topTracks.findIndex(t => t.id === trackId);
        if (topIndex > -1) {
            topTracks.splice(topIndex, 1);
            return;
        }
        let midIndex = midTracks.findIndex(t => t.id === trackId);
        if (midIndex > -1) {
            midTracks.splice(midIndex, 1);
        }
    };
    
    // Helper to pick random tracks from a combination of crates
    const pickRandomFrom = (crates, count) => {
      const combined = [].concat(...crates);
      if (combined.length === 0) return [];
      
      const picks = Selector.sliceRandom(combined, count);
      picks.forEach(pick => removeFromCrates(pick.id));
      return picks;
    };


    // Rule 1: One random track from "top tracks"
    finalTracks.push(...pickRandomFrom([topTracks], 1 + extraInterval));

    // Rule 2: First artist track
    if (top3ArtistTracks.length > 0) finalTracks.push(top3ArtistTracks.shift());

    // Rule 3: Two random from "top" & "mid"
    finalTracks.push(...pickRandomFrom([topTracks, midTracks], 2 + extraInterval));

    // Rule 4: Second artist track
    if (top3ArtistTracks.length > 0) finalTracks.push(top3ArtistTracks.shift());
    
    // Rule 5: Two random from "top" & "mid"
    finalTracks.push(...pickRandomFrom([topTracks, midTracks], 2 + extraInterval));

    // Rule 6: Third artist track
    if (top3ArtistTracks.length > 0) finalTracks.push(top3ArtistTracks.shift());

    // Rule 7: Two random from "top" & "mid"
    finalTracks.push(...pickRandomFrom([topTracks, midTracks], 2 + extraInterval));


    // =================================================================
    // STEP 4: BUILD THE FINAL PLAYLIST - BOTTOM SECTION
    // =================================================================

    // Combine all remaining promo tracks into a single shuffled crate
    const promoTracksBottom = Combiner.push([], topTracks, midTracks, lowTracks);
    Order.shuffle(promoTracksBottom);

    // Shuffle the remaining artist tracks
    Order.shuffle(otherArtistTracks);

    // Insert the remaining artist tracks one by one into the promo tracks crate
    // with a random interval of 2-4 promo tracks between each.
    let insertionIndex = 0;
    while (otherArtistTracks.length > 0) {
      const artistTrack = otherArtistTracks.shift();
      const interval = Math.floor(Math.random() * 3) + 2 + extraInterval; // Random integer between 2 and 4, plus the extra interval
      
      insertionIndex += interval;
      
      // Ensure the insertion index does not go beyond the end of the array
      if (insertionIndex > promoTracksBottom.length) {
        insertionIndex = promoTracksBottom.length;
      }
      
      promoTracksBottom.splice(insertionIndex, 0, artistTrack);
      insertionIndex++; // Move index past the newly inserted track
    }

    // Append the fully mixed bottom section to the final playlist
    Combiner.push(finalTracks, promoTracksBottom);

    // =================================================================
    // STEP 5: VALIDATE AND SAVE THE PLAYLIST
    // =================================================================

    // Critical Validation: Ensure no tracks were lost during processing.
    if (finalTracks.length !== initialTotalTracks) {
      const message = `CRITICAL ERROR: Track count mismatch. Started with ${initialTotalTracks}, ended with ${finalTracks.length}. Aborting to prevent data loss.`;
      Logger.log(message);
      // Optional: throw new Error(message) to get an email notification if script fails.
      return; 
    }

    Logger.log(`Successfully prepared ${finalTracks.length} tracks. All tracks accounted for. Saving to Spotify...`);

    // This is the only function that modifies the live playlist.
    // It replaces all existing tracks with the new, carefully constructed list.
    Playlist.saveWithReplace({
      id: combinedPlaylist.id,
      name: combinedPlaylist.name, // Preserves the playlist name
      tracks: finalTracks,
    });

    Logger.log(`Playlist "${combinedPlaylist.name}" has been successfully updated.`);

  } catch (e) {
    // If any error occurs above, this block is executed.
    Logger.log(`An error occurred: ${e.message}\nStack: ${e.stack}`);
    Logger.log(`IMPORTANT: The playlist "${combinedPlaylist.name}" was NOT modified due to the error.`);
  }
}

/**
 * EXAMPLE USAGE:
 * This function demonstrates how to call createArtistPromoPlaylist.
 * It should be triggered by a time-based scheduler in Google Apps Script.
 */
function runArtistPromoUpdate() {

  /**
   * Neurological Waves Science : 🌿🧘 Relax and Focus: Serene Melodies for Work, Study and Chill
   */
  const playlistConfig1 = {
    artistPlaylist: {
      id: '6ZIvOEeO2aLaeZp0bcYBTV',
      name: 'nws - official',
    },
    promoPlaylist: {
      id: '1NBSk4KnLzpqXlOjl6bcJP',
      name: 'nws - influence',
    },
    combinedPlaylist: {
      id: '3fDrMMM2stMDiatj729xQM',
      name: '🌿🧘 Relax and Focus: Serene Melodies for Work, Study and Chill',
    },
  };
  createArtistPromoPlaylist(playlistConfig1, 0);

  /**
   * Neurological Waves Science : 🏯⚖️🧘‍♂️ Shaolin Harmony in Motion: Qigong and Tai Chi Meditation Music (少林气功与太极)
   */
  const playlistConfig2 = {
    artistPlaylist: {
      id: '2Kwytl8APVhZVFaX6ClyRW',
      name: 'nsw - qigong official',
    },
    promoPlaylist: {
      id: '4XbzUL39p243cRjXqw26yG',
      name: 'nsw - qigong influence',
    },
    combinedPlaylist: {
      id: '4imxKpvlV2XfbCYaBeqRYO',
      name: '🏯⚖️🧘‍♂️ Shaolin Harmony in Motion: Qigong and Tai Chi Meditation Music (少林气功与太极)',
    },
  };
  createArtistPromoPlaylist(playlistConfig2, 1);

  /**
   * La Sonora Volcánica : Café Con Leche: A Latin Music Blend
   */
  const playlistConfig3 = {
    artistPlaylist: {
      id: '2PTD4rUiyhuU4cuCGoH51S',
      name: 'lsw - café official',
    },
    promoPlaylist: {
      id: '23J8ffv05PcRjnjuTz87WO',
      name: 'lsv - café influence',
    },
    combinedPlaylist: {
      id: '1Vx895NFNT4O1S5QeSDpRU',
      name: 'Café Con Leche: A Latin Music Blend',
    },
  };
  createArtistPromoPlaylist(playlistConfig3, 3);

}
