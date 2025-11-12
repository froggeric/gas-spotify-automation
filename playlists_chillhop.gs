// Fetch the latest weekly releases from everynoise
// Schedule to run once a week, on early saturday morning
// everynoise update their release list on fridays

function everynoiseNewChillVibes() {

  let banned  = 'demo|remix|live|en vivo|rkt|instrumental|playlist|beats|remaster|exitos|antologia|clasicos|reggaeton|cover';
      banned += '|dj | dj|dee jay|deejay';
      banned += '|picky 3p|grupo ju-juy|maria becerra|tito rojas';
      banned += 'tito puente|celia cruz|juan jimenez|mongo santamaria|ruben blades';
  
  let keepDays = 120;  // cutoff date for releases that stay in the playlist

  let today = (new Date()).toISOString().split('T')[0];
  let description = "[" + today + "] everynoise new releases. Sorted by track popularity + artist popularity * valence. Tracks released more than " + keepDays + " days ago are removed.";

  main();

  function main() {

    // // New chill vibes genres
    // // https://everynoise.com/new_releases_by_genre.cgi?genre=neo%20soul%2Cgolden%20age%20hip%20hop&region=US&hidedupes=on
    getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'bedroom soul' );
    getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'chill beats' );
    getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'chill pop' );
    getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'chill r&b' );
    getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'conscious hip hop' );
    getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'golden age hip hop' );
    getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'gospel rap' );
    getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'hip hop' );
    getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'jazz rap' );
    getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'neo soul' );
    getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'nu-cumbia' );
    getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'quiet storm' );
    filterNonChillTracks( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f' );
    sortNewReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f' );
  
    // let date = '2023-10-06';
    // getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'bedroom soul', date );
    // getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'chill beats', date );
    // getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'chill pop', date );
    // getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'chill r&b', date );
    // getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'conscious hip hop', date );
    // getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'golden age hip hop', date );
    // getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'gospel rap', date );
    // getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'hip hop', date );
    // getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'jazz rap', date );
    // getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'neo soul', date );
    // getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'nu-cumbia', date );
    // getEverynoiseReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f', 'quiet storm', date );
    // filterNonChillTracks( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f' );
    // sortNewReleases( '* LATEST NEW CHILL VIBES *', '09FTQOXMEXdKuZHBsNYW8f' );

  }

  // Get the latest weekly releases and add them to an existing playlist
  function getEverynoiseReleases( name, id, genre, date ) {
    
    let tracks = {};
    if (date === undefined ) {
      // Parse everynoise weekly page for new releases and extract the tracks
      tracks = Release.getTracks({
        genre: genre,             // mandatory
        region: 'US',
        // date: '2022-10-28',    // can be omitted for the last available week
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
      tracks: tracks
    });

  }

  function filterNonChillTracks( name, id ) {

    Logger.log('>>>>>>>>>>> REMOVING NON-CHILL TRACKS <<<<<<<<<<<');

    // Retrieve all tracks from the playlist
    tracks = Source.getPlaylistTracks( '', id);
    Logger.log(tracks.length + ' tracks loaded from playlist');

    // Remove duplicates
    Filter.dedupTracks( tracks );
    Logger.log(tracks.length + ' tracks left after removing duplicates');

    // Apply our custom chill filter
    // (we also include valence which will be needed for the sort, as the cache gets built at this stage)
    Filter.rangeTracks( tracks, {
      features: {
        energy: { min: 0.3, max: 0.8},
        instrumentalness: { min: 0.0, max: 0.5},
        speechiness: { min: 0.0, max: 0.13},
        valence: { min: 0.0, max: 1.0},
      }
    });
    Logger.log(tracks.length + ' tracks left after applying audio features filter');

    // Save tracks to the playlist
    Playlist.saveWithReplace({
      name: name,
      id: id,
      tracks: tracks,
      description: description,
      public: false,
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

    // // Remove tracks which are already part of the library (ie: in existing playlists)
    // Filter.removeTracks(tracks, existingTracks);
    // Logger.log('>>>>>>>>>>> EXISTING >>>>>>>>> ' + tracks.length);

    // Remove tracks older than the cutoff time period
    Filter.rangeTracks( tracks, {
      album: { release_date: { sinceDays: keepDays, beforeDays: 0 }, },
    });
    Logger.log(tracks.length + ' tracks left after removing old ones');

    // Load additional artist metadata
    Filter.rangeTracks( tracks, {
      artist: { popularity: { min: 0, max: 100 }, },
    });
    // Retrieve cached array of the main artists. Records are unique.
    let cache  = getCachedTracks(tracks, { artist: {}} ).artists;
    let cachedArtists  = Object.values(cache);
    Logger.log(cachedArtists.length + ' unique artists in cache');

    // Load additional audio features metdata in case the cache needs to be build
    // (for example if the sort is run by itself instead of after our custom filter)
    Filter.rangeTracks( tracks, {
      features: {
        speechiness: { min: 0.0, max: 1.0},
        valence: { min: 0.0, max: 1.0},
      }
    });
    // Retrieve cached array of the audio features. Records are unique.
    cache  = getCachedTracks(tracks, { features: {}} ).features;
    let cachedFeatures  = Object.values(cache);
    Logger.log(cachedFeatures.length + ' items in audio features cache');

    // Add custom score to tracks
    //   (2*track popularity + artist popularity) * valence^2 * (1-speechiness)
    //   give more priority to track popularity than artist
    //   with recent tracks which can take a while to be known, using artist popularity is useful
    //   valence is a measure of happiness/positivity (computed by neural network)
    //     we use it to bias the popularity towards positive tracks
    //     with a higher value than
    //   speechiness is a measure of how much spoken content there is (eg: rap)
    //     used to prioritise more melodic/singing tracks
    
    // We first iterate through all the track items
    for (let x = 0; x < tracks.length; x++) {
      let item = tracks[x];
      let trackId = item.id;
      let artistId = item.artists[0].id;
      // Now we iterate through the cached artists to find a matching artist
      for (let y = 0; y < cachedArtists.length; y++) {
        // Check if the current cached item is a match for the current track
        if ( artistId == cachedArtists[y].id ) {
          // Calculate the score
          let trackPopularity = item.popularity;
          let artistPopularity = cachedArtists[y].popularity;
          // We also need to iterate through the cached audio features to find the right track
          for (let z = 0; z < cachedFeatures.length; z++) {
            // Check if the current cached item is a match for the current track
            if ( trackId == cachedFeatures[z].id ) {
              let valence = cachedFeatures[z].valence;
              let speechiness = cachedFeatures[z].speechiness;
              let score = ( (2 * trackPopularity) + artistPopularity ) * ( (1+valence) * (1+valence)) * (1 - speechiness);
              // Save the score to the original track array
              tracks[x].score = score;
              Logger.log( x + '  :  ' + artistId + ' = '+ cachedArtists[y].id + ' : ' + score + ' (track: ' + trackId + ' = ' +  cachedFeatures[z].id + ' )');
            }
          }
        }
      }
    }

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

}
