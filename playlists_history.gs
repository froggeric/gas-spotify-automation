// Fetch the latest weekly releases from everynoise
// Schedule to run once a week, on early saturday morning
// everynoise update their release list on fridays

function everynoiseWeeklyReleases() {

  let banned  = 'demo|remix|live|en vivo|rkt|instrumental|playlist|beats|remaster|exitos|antologia|clasicos|reggaeton|cover';
      banned += '|dj | dj|dee jay|deejay';
      banned += '|picky 3p|grupo ju-juy|maria becerra|tito rojas';
      banned += 'tito puente|celia cruz|juan jimenez|mongo santamaria|ruben blades';
  
  let keepDays = 90;  // cutoff date for releases that stay in the playlist

  let today = (new Date()).toISOString().split('T')[0];
  let description = "[" + today + "] everynoise new releases, sorted by artist popularity. New tracks are added once a week on saturday mornings, shortly after everynoise weekly update. Existing tracks released more than " + keepDays + " days ago are removed.";

  let existingTracks = Source.getPlaylistTracks( '[all latin]', '1WFP39vejsXR3BTPfOGXDS');

  main();

  function main() {

    // salsa
    // https://everynoise.com/new_releases_by_genre.cgi?genre=salsa&region=US
    getLastWeekReleases( 'everynoise salsa', '2vFImomKbig2xPmEngiFAH', 'salsa' );
    getLastWeekReleases( 'everynoise salsa', '2vFImomKbig2xPmEngiFAH', 'modern salsa' );
    getLastWeekReleases( 'everynoise salsa', '2vFImomKbig2xPmEngiFAH', 'salsa cubana' );
    getLastWeekReleases( 'everynoise salsa', '2vFImomKbig2xPmEngiFAH', 'salsa colombiana' );
    getLastWeekReleases( 'everynoise salsa', '2vFImomKbig2xPmEngiFAH', 'salsa international' );
    getLastWeekReleases( 'everynoise salsa', '2vFImomKbig2xPmEngiFAH', 'salsa peruana' );
    getLastWeekReleases( 'everynoise salsa', '2vFImomKbig2xPmEngiFAH', 'salsa puertorriquena' );
    getLastWeekReleases( 'everynoise salsa', '2vFImomKbig2xPmEngiFAH', 'salsa urbana' );
    getLastWeekReleases( 'everynoise salsa', '2vFImomKbig2xPmEngiFAH', 'salsa venezolana' );
    getLastWeekReleases( 'everynoise salsa', '2vFImomKbig2xPmEngiFAH', 'timba' );
    sortNewReleases( 'everynoise salsa', '2vFImomKbig2xPmEngiFAH' );

    // bachata
    // https://everynoise.com/new_releases_by_genre.cgi?genre=bachata&region=US
    getLastWeekReleases( 'everynoise bachata', '6f4LjtkW7i95IB0Pvo0tmC', 'bachata' );
    getLastWeekReleases( 'everynoise bachata', '6f4LjtkW7i95IB0Pvo0tmC', 'bachata dominicana' );
    sortNewReleases( 'everynoise bachata', '6f4LjtkW7i95IB0Pvo0tmC' );

    // merengue
    // https://everynoise.com/new_releases_by_genre.cgi?genre=merengue&region=US
    getLastWeekReleases( 'everynoise merengue', '1l11F6ffJJYWJUfD3yVm5V', 'merengue' );
    getLastWeekReleases( 'everynoise merengue', '1l11F6ffJJYWJUfD3yVm5V', 'merengue tipico' );
    sortNewReleases( 'everynoise merengue', '1l11F6ffJJYWJUfD3yVm5V' );

    // cumbia
    // https://everynoise.com/new_releases_by_genre.cgi?genre=cumbia&region=US
    getLastWeekReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb', 'cumbia' );
    getLastWeekReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb', 'cumbia andina mexicana' );
    getLastWeekReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb', 'cumbia boliviana' );
    getLastWeekReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb', 'cumbia chilena' );
    getLastWeekReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb', 'cumbia ecuatoriana' );
    getLastWeekReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb', 'cumbia lagunera' );
    getLastWeekReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb', 'cumbia paraguaya' );
    getLastWeekReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb', 'cumbia peruana' );
    getLastWeekReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb', 'cumbia santafesina' );
    getLastWeekReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb', 'cumbia sonidera' );
    getLastWeekReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb', 'cumbia uruguaya' );
    getLastWeekReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb', 'cumbia villera' );
    sortNewReleases( 'everynoise cumbia', '5OvN1nZ7z8Z8iwiUSGburb' );

  }


  // Get the latest weekly releases and add them to an existing playlist
  function getLastWeekReleases( name, id, genre, date ) {
    
    let tracks = {};
    if (date === undefined ) {
      // Parse everynoise weekly page for new releases and extract the tracks
      tracks = Release.getTracks({
        genre: genre,             // mandatory
        region: 'US',
        // date: '2023-07-21',    // can be omitted for the last available week
        // type: 'album,single',  // optional if both types are needed
    });
    } else {
    // Parse everynoise weekly page for new releases and extract the tracks
    tracks = Release.getTracks({
      genre: genre,             // mandatory
      region: 'US',
      date: date,               // can be omitted for the last available week
      // type: 'album,single',  // optional if both types are needed
    });
    }
    
    // Removed unwanted tracks
    Filter.matchExcept( tracks, banned );

    Logger.log( tracks.length + ' new ' + genre + ' releases on everynoise this week.')

    // Add tracks to playlist (this is necessary to get access to the metadata)
    Playlist.saveWithAppend({
      name: name,
      id: id,
      tracks: tracks,
      description: description,
    });

  }

  function sortNewReleases( name, id ) {

    Logger.log('>>>>>>>>>>>>>>>> SORTING TRACKS <<<<<<<<<<<<<<<<<');

    // Retrieve all tracks from the playlist
    tracks = Source.getPlaylistTracks( '', id);
     Logger.log(tracks.length + ' tracks loaded from playlist');

    // Remove duplicates
    Filter.dedupTracks( tracks );
    Logger.log(tracks.length + ' tracks left after removing duplicates');

    // Remove tracks which are already part of the library (ie: in existing playlists)
    Filter.removeTracks(tracks, existingTracks);
    Logger.log(tracks.length + ' tracks left after removing existing ones');

    // Load additional artist metadata
    Filter.rangeTracks( tracks, {
      artist: { popularity: { min: 0, max: 100 }, },
    });
    // Retrieve cached array of the main artists. Records are unique.
    let cache  = getCachedTracks(tracks, { artist: {}} ).artists;
    let cachedArtists  = Object.values(cache);
    Logger.log(cachedArtists.length + ' unique artists in cache');

    // Add custom score to tracks
    // We first iterate through all the track items
    for (let x = 0; x < tracks.length; x++) {
      let item = tracks[x];
      let id = item.artists[0].id;
      // Now we iterate through the cached artists to find a matching artist
      for (let y = 0; y < cachedArtists.length; y++) {
        // Check if the current cached item is a match for the current track
        if ( id == cachedArtists[y].id ) {
          // Calculate the score
          let trackPopularity = item.popularity;
          let artistPopularity = cachedArtists[y].popularity;
          // let score = ( (4 * trackPopularity) + artistPopularity );
          let score = ( (2 * trackPopularity) + artistPopularity );
          // Save the score to the original track array
          tracks[x].score = score;
          // Logger.log( x + '  :  ' + id + ' = '+ cachedArtists[y].id + ' : ' + score);
        }
      }
    }

    // Remove tracks older than the cutoff time period
    Filter.rangeTracks( tracks, {
      album: { release_date: { sinceDays: keepDays, beforeDays: 0 }, },
    });
    Logger.log(tracks.length + ' tracks left after removing old tracks');

    // Sort by decreasing score
    tracks.sort((x, y) => {
        return y.score - x.score;
    });
    // for (let i = 0; i < tracks.length; i++) { Logger.log(tracks[i].score + '  :  ' + tracks[i].name + ' (' + tracks[i].artists[0].name + ')');}

    // Save tracks to the playlist
    Playlist.saveWithReplace({
      name: name,
      id: id,
      tracks: tracks,
      description: description,
      public: false,
    });

  }

  // Organise the existing playlist, removing duplicates, old releases, and sorting my most popular artist first
  function sortNewReleasesOld( name, id ) {
    
    // Retrieve all tracks from the playlist
    tracks = Source.getPlaylistTracks( '', id);

    // Remove duplicates
    Filter.dedupTracks( tracks );

    // Remove tracks which are already part of the library (ie: in existing playlists)
    Filter.removeTracks(tracks, existingTracks);

    // Remove tracks older than the cutoff time period
    Filter.rangeTracks( tracks, { album: { release_date: { sinceDays: keepDays, beforeDays: 0 }, }, });

    // Extract popular tracks, to help spot great releases from lesser known artists
    let popularTracks = Selector.sliceCopy(tracks);
    Filter.rangeTracks(popularTracks, {
      meta: {
        popularity: { min: 40, max: 100 },
      },
    });

    // Save popular tracks only to the playlist
    Playlist.saveWithReplace({
      name: name,
      id: id,
      tracks: popularTracks,
      description: description,
    });

    // Remove popular tracks from the full track list
    Filter.removeTracks( tracks, popularTracks );

    // Sort remaining tracks by artist popularity, with most popular first
    // Since tracks are too new to have a reliable popularity score, we use the artist popularity instead
    Order.sort( tracks, 'artist.popularity', 'desc' );

    // Add remaining tracks to playlist
    Playlist.saveWithAppend ({
      name: name,
      id: id,
      tracks: tracks,
      description: description,
    });

  }

}
