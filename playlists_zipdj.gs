// Tracks manipulation used on multiple playlists:
//  Simple playlist shuffle with dedup and artist separation
//  Artist playlist shuffle with dedup
//  Alternated shuffled playlists with dedup and artist separation, and optional track limit
//  Aggregated plaulists, with shuffle, dedup and artist separation

function organisePlaylists() {

  let today = (new Date()).toISOString().split('T')[0];

  main();

  function main() {

    //// SIMPLE PLAYLIST SHUFFLE ////

      // Bachata Moderna
      shufflePlaylist({
        name: '☆ Bachata Sensual ☆',
        description: "[DAILY SHUFFLE " + today + "]  Manually curated, with modern bachata songs, usually slower and more orchestrated with electric instruments, than traditional bachata.",
        sourceid: '5EDacPfFnTVVw6jJiXGRGC', 
        targetid: '1nqbNlWFz4hp17Ynn6iquL',
        separation: 4,
      });

      // Bachata Tradicional
      shufflePlaylist({
        name: '☆ Bachata Dominicana ☆',
        description: "[DAILY SHUFFLE " + today + "] Manually curated, with traditional bachata songs, featuring a usually faster rythm, with more guitar.",
        sourceid: '5Rtc7DqGIj9H1yBhhgdgN6', 
        targetid: '6dmOgyY7Tb7c8omYe1j5y4',
        separation: 4,
      });

      // Chansons françaises
      shufflePlaylist({
        name: '★ Chansons françaises ★',
        description: "[DAILY SHUFFLE " + today + "]",
        sourceid: '3plV4afF2Xknof5Dg452oH', 
        targetid: '7dH9IZblZHHaTU093MIt8v',
        separation: 4,
      });

      // Cumbia
      shufflePlaylist({
        name: 'Cumbia',
        description: "[DAILY SHUFFLE " + today + "] Manually curated, with an emphasis on traditional cumbia, and a good dose of cumbia peruana.",
        sourceid: '1hSmpmZbgkoGpcIrCU9rpF', 
        targetid: '7htbYn8f0q01n5br4XhQR9',
        separation: 4,
      });

      // Cumbia Instruméntales
      shufflePlaylist({ 
        name: 'Cumbia Instruméntales',
        description: "[DAILY SHUFFLE " + today + "]",
        sourceid: '2PrIjEASRTjDhYY3Ujtdzd', 
      });

      // ★ Latin Chill ★
      shufflePlaylist({ 
        name: '★ Latin Chill ★',
        description: "[DAILY SHUFFLE " + today + "]",
        sourceid: '1Dvvr3bXxcNBeokE8JiRCc', 
      });

      // <!>Melatone 1 relax
      shufflePlaylist({ 
        name: '<!>Melatone 1 relax',
        description: "[DAILY SHUFFLE " + today + "]",
        sourceid: '4ydomBoG4tHzp1ekls1rSd', 
        private:true,
      });
      // <!>Melatone 2 falling asleep
      shufflePlaylist({
        name: '<!>Melatone 2 falling asleep',
        description: "[DAILY SHUFFLE " + today + "]",
        sourceid: '26ttzfvBwnULKyT1F90Icb', 
        private:true,
      });
      // <!>Melatone 4 acoustic chill
      shufflePlaylist({
        name: '<!>Melatone 4 acoustic chill',
        description: "[DAILY SHUFFLE " + today + "]",
        sourceid: '49dOZG0Sys092mt1YtRmot', 
        private:true,
      });
      // <!>Melatone 5 chilltronic
      shufflePlaylist({
        name: '<!>Melatone 5 chilltronic',
        description: "[DAILY SHUFFLE " + today + "]",
        sourceid: '3nG6oYuH9mScge1RFqrFap', 
        private:true,
      });

      // Merengue
      shufflePlaylist({
        name: 'Merengue',
        description: "[DAILY SHUFFLE " + today + "] The best new and classic merengue.",
        sourceid: '0W2lVKgN2AbsFus2RIAiHz', 
        targetid: '3Bsz7QecNExg8bsDdW4iGW',
        separation: 4,
      });

      // Piano
      shufflePlaylist({
        name: 'Piano',
        description: "[DAILY SHUFFLE " + today + "]",
        sourceid: '7li32mQfzXE02G0U680J2J', 
        // separation: 4,
      });

      // Reggaeton
      shufflePlaylist({
        name: '☆ Reggaeton ☆',
        description: "[DAILY SHUFFLE " + today + "] Manually curated. Only the best reggaeton songs. Mostly for inclusion in my other playlists.",
        sourceid: '1UoWJkPDZbNwuvNYrH6JRu', 
        targetid: '6xkeo6Oz8VT1MhJ3nExVlE',
      });

      // Reggae du jour
      shufflePlaylist({
        name: '★ Reggae du jour ★',
        description: "[DAILY REFRESH " + today + "] 25 new songs everyday.",
        sourceid: '4gf91RHNDtzuXM7HgfzVUD', 
        targetid: '6kmna7mjnECJ2CV3XQYR2x',
        count:25,
        separation: 3,
      });

      // Romance en plusieurs langues
      shufflePlaylist({
        name: '♡ Romance en plusieurs langues ♡',
        description: "[DAILY SHUFFLE " + today + "] Soft and romantic songs, mainly in French, English, Spanish, Italian, Portuguese",
        sourceid: '607E5Mm4upC4GvYrcCeemC', 
        targetid: '6jcCwqV6X2iVrurEcmN1hf',
        separation: 4,
      });

      // Salsa
      shufflePlaylist({
        name: 'Salsa',
        description: "[DAILY SHUFFLE " + today + "] The best new and classic salsa.",
        sourceid: '1sWIaLkLdX2gf6GYJetcO5', 
        targetid: '0o2GXyncPfGLmGSiOqSINx',
        separation: 4,
      });

      // Soulful Rock
      shufflePlaylist({
        name: '★ Soulful Rock ★',
        description: "[DAILY SHUFFLE " + today + "]",
        sourceid: '2wqeIF04jeUL4aQOa45ME7', 
        targetid: '6s6sB82xc8GIrtzo4OIz9N',
        separation: 3,
      });

      // Tai Chi & Qi Gong
      // shufflePlaylist({
      //   name: '🏯⚖️🧘‍♂️ Shaolin Harmony in Motion: Qigong and Tai Chi Meditation Music (少林气功与太极)',
      //   description: "[DAILY SHUFFLE " + today + "] Relax, focus, and find balance with Shaolin Qigong and Tai Chi music (少林气功与太极). Perfect for meditation, studying, working, or unwinding, these serene Chinese melodies bring harmony, calm, and mindfulness to your day. Experience the authentic sounds of Shaolin wisdom. 🏯⚖️🧘‍♂️",
      //   sourceid: '4imxKpvlV2XfbCYaBeqRYO', 
        // separation: 4,
      // });

      // Yogasthenics
      // shufflePlaylist({
      //   name: 'Yogasthenics',
      //   description: "[DAILY SHUFFLE " + today + "]",
      //   sourceid: '632redXHfMP9fQsFmJawpP', 
      // });

    //// ARTIST PLAYLIST SHUFFLE ////

      // Beatles
      shufflePlaylist({
        name: '☆ The Beatles best songs (latest mixes and remasters) ☆',
        description: "[DAILY SHUFFLE " + today + "] My favourite Beatles songs. Using the latest official mixes and remasters.",
        sourceid: '3pmiXMayJntkFCQeUHi6qI', 
        targetid: '1Tj0vECvFl2zmu2j6sC3DY',
      });

      // Classical music and lullabies for sleep and relaxation (432Hz)
      shufflePlaylist({
        name: 'Classical music and lullabies for sleep and relaxation (432Hz)',
        description: "[DAILY SHUFFLE " + today + "] Scientifically engineered for better sleep. Listen at low volume in stereo. Deep Waves stimulation. Vestibular stimulation. Binaural beats. Isochornic tones. 432Hz tuning.",
        sourceid: '1gfHDlRWRYk4gk5qVQ5BXB',
      });

      // Marc Anthony
      shufflePlaylist({
        name: 'Marc Anthony',
        description: "[DAILY SHUFFLE " + today + "]",
        sourceid: '4I4PdPyF2Dl2LA7G0rDKgh', 
        targetid: '1ywmwzWHIQz8aCxu8rD548',
      });

      // Queen
      shufflePlaylist({
        name: 'Queen',
        description: "[DAILY SHUFFLE " + today + "]",
        sourceid: '7iuvV4MVzSOtvbzYl1zZQN',
      });

      // Relaxing Classical Music for Sleeping, tuned to 432Hz
      shufflePlaylist({
        name: 'Relaxing Classical Music for Sleeping, tuned to 432Hz',
        description: "[DAILY SHUFFLE " + today + "] Scientifically engineered music, to help you relax or fall asleep. Carefully selected tunes, arranged with calm and soothing instrumentation, with a tempo adjusted to match the desired heartbeat.",
        sourceid: '6FfOhT7qsKwsXAqrdMIkPC',
      });


    //// MULTIPLE PLAYLISTS ALTERNATED ////

      // Chillax : <!>Melatone 4 acoustic chill + <!>Melatone 5 chilltronic + <!>Melatone 1 relax + Neurological Waves Science + Tai Chi & Qigong + Promo Chillax
      alternatePlaylists({
        name: 'nws - influence',
        description: "Relax & focus with serene melodies designed for work, study, chillout, and relaxation. Perfect background music for productivity, calming moments, yoga, and mindfulness. Whether you're studying, working, or meditating, this playlist will enhance your focus and peace of mind.",
        playlists: ['49dOZG0Sys092mt1YtRmot', '3nG6oYuH9mScge1RFqrFap', '4ydomBoG4tHzp1ekls1rSd', '4g5XhSGUFWaOigZo5gEOlH', '4imxKpvlV2XfbCYaBeqRYO', '7sJK5D3jCNI3vdYm5dM2Lc'],
        targetid: '1NBSk4KnLzpqXlOjl6bcJP',
        toLimitOn: false,
        count: 100,
      });

      // Bachata : <!>Bachata moderna [archive] + <!>Bachata tradicional [archive]
      alternatePlaylists({
        name: 'Bachata',
        description: "[DAILY SHUFFLE " + today + "] The best new and classic bachata.",
        playlists: ['5EDacPfFnTVVw6jJiXGRGC', '5Rtc7DqGIj9H1yBhhgdgN6'],
        targetid: '7eufyawBpqQMvsIN4fgQB1',
        separation:3,
        toLimitOn: true,
      });

      // Salsa vs Bachata : Bachata (combined) + Salsa (shuffled)
      alternatePlaylists({
        name: 'Salsa vs Bachata',
        description: "[DAILY SHUFFLE " + today + "] 80 songs, alternating Bachata and Salsa. Artist separation of minimum 6 tracks.",
        playlists: ['7eufyawBpqQMvsIN4fgQB1', '0o2GXyncPfGLmGSiOqSINx'],
        targetid: '27eKRcsYJrHfsP5px09NuR',
        separation:3,
        toLimitOn: true,
      });

    //// AGGREGATED PLAYLISTS ////

      // [all english]
      aggregatePlaylists({
        name: '[all english]',
        description: "[DAILY SHUFFLE " + today + "]",
        playlists: [
          '7cqKGMH2ZHL0IbZHdN4rIc', // Aerosmith
          '3pmiXMayJntkFCQeUHi6qI', // Beatles [archive]
          '0jjn8ERn4k70j4fqBrHTd5', // Bruno Mars
          '0E5XQ0UXMGlVDnf2Cspltt', // Coldplay
          '256YnYCrbpOZye3i199wR9', // David Bowie
          '63aKffUl0gAKg99Z2QiVeB', // Eagles
          '6XNPksg2zCMqzSmcbcvSif', // Ed Sheeran
          '1nLZUbSwH0Y0K1hACAT9Io', // Great popular songs in english
          '2mBxrlbN6se8c4jIS0vAwN', // Jack Johnson
          '2kIld0Ip18tknlNTzji3iO', // Jason Mraz
          '05JGJ6gDGpj3LRMoDS0Xb7', // Katie Melua and Norah Jones
          '7iuvV4MVzSOtvbzYl1zZQN', // Queen
          '2wqeIF04jeUL4aQOa45ME7', // Soulful rock [archive]
          '36sCJlYKAmo251OrNddRCf', // Van Morrison
        ],
        targetid: '3XWhltPcZYDWq6MA7H7UvI',
        separation:6,
        private:true,
      });

      // [all latin]
      aggregatePlaylists({
        name: '[all latin]',
        description: "[DAILY SHUFFLE " + today + "]",
        playlists: [
          '5EDacPfFnTVVw6jJiXGRGC', // Bachata moderna [archive]
          '5Rtc7DqGIj9H1yBhhgdgN6', // Bachata tradicional [archive]
          '1hSmpmZbgkoGpcIrCU9rpF', // Cumbia [archive]
          '0W2lVKgN2AbsFus2RIAiHz', // Merengue [archive]
          '1sWIaLkLdX2gf6GYJetcO5', // Salsa [archive]
          '1UoWJkPDZbNwuvNYrH6JRu', // Reggaeton [archive]
          '4I4PdPyF2Dl2LA7G0rDKgh', // Marc Anthony [archive]
          '2TWkc36JcaPgbFePaxfyBq', // Joan Soriano [archive]
          '1Dvvr3bXxcNBeokE8JiRCc', // Latin chill
          '7qYD0PW41lQwWXLRY79D2n', // Latin pop
          '4Nrf3BDfakcysSuTyaWveE', // Duetissimo
        ],
        targetid: '1WFP39vejsXR3BTPfOGXDS',
        separation:6,
        private:true,
      });

      // [all reggae]
      aggregatePlaylists({
        name: '[all reggae]',
        description: "[DAILY SHUFFLE " + today + "]",
        playlists: [
          '26MCGpSuOloEY8mniqMDLE', // Reggae
          '27yNlimOUgrugbVZNCIRi3', // Alpha Blondy
          '4JLJUOn8VF22m45w6B8C4R', // Marley Family
          '0ImDCoOMMvWDW5ZihrfzFy', // Tiken Jah Fakoly
        ],
        targetid: '4gf91RHNDtzuXM7HgfzVUD',
        separation:6,
        private:true,
      });

  }

  // -------------------------------------------------------------------
  // Saves tracks to an existing destination playlist setting the name and description.
  // Duplicate tracks (both by name and id) are removed
  //   name (mandatory) : playlist name for saving
  //   descriptiom (optional) : description for saving
  //   targetid (mandatory) : target playlist URI - if omitted, tracks will be saved in place
  //   tracks (mandatory) : array of tracks to save
  //   private (optional boolean) : playlist visibility (default is public)
  // -------------------------------------------------------------------
  function saveTracks(params = {name, description, targetid, tracks, private}) {
  // function saveTracks( name, id, description = '', tracks, public = true) {

    let name = params.name;
    let description = params.description || '';
    let targetid  = params.targetid || params.sourceid; // default to source playlist for saving in-place
    let tracks = params.tracks;
    let public = !(params.private || false);

    // Remove duplicates, both by id and name
    Filter.dedupTracks(tracks);

    if (description == '') {
      Playlist.saveWithReplace({
        id: targetid,
        name: name,
        tracks: tracks,
        public : public,
      });
    } else {
      Playlist.saveWithReplace({
        id: targetid,
        name: name,
        tracks: tracks,
        description: description,
        public : public,
      });
    }
  }

  // -------------------------------------------------------------------
  // Shuffle a playlist
  //   name (mandatory) : playlist name for saving
  //   descriptiom (optional) : description for saving
  //   sourceid (mandatory) : source playlist URI
  //   targetid (optional) : target playlist URI - if omitted, tracks will be saved in place
  //   count (optional) : number of tracks to retrieve
  //   separation (optional) : tracks separation by artist - warning: if separation is not possible, tracks will be deleted
  //   private (optional boolean) : playlist visibility (default is public)
  // -------------------------------------------------------------------
  function shufflePlaylist(params = {name, description , sourceid, targetid, count, separation, private}) {

    let name = params.name;
    let description = params.description || '';
    let sourceid = params.sourceid;
    let targetid  = params.targetid || params.sourceid; // default to source playlist for saving in-place
    let count = params.count || 0;            // 0 retrieves all tracks
    let separation = params.separation || 0;  // 0 does not separate tracks
    let private = params.private || false;

    Logger.log("Shuffling playlist: " + name);

    // Get tracks from source playlist, randomly, limited to the optional number of tracks
    let tracks = Source.getTracks([{
      id: sourceid,
      count: count,   // If count = 0, retrieve all tracks
      inRow: false    // There seems to be a bug: when all tracks are retrieved, there is no shuffling
    }]);
  
    // During artist separation, if separation is not possible, tracks will be deleted.
    // Therefore we only apply artist separation when saving to a different playlist
    if ((targetid != sourceid) && (separation != 0 )) {
      Order.separateArtists(tracks, separation, true);
    } else {
      Order.shuffle(tracks);
    };
    
    // Save the playlist
    saveTracks({
      name: name,
      targetid: targetid,
      description: description,
      tracks: tracks,
      private: private,
    });
  }


  // -------------------------------------------------------------------
  // Alternate playlists and save to a new playlist
  //   name (mandatory) : playlist name for saving
  //   descriptiom (optional) : description for saving
  //   playlists (mandatory) : array of source playlist URI
  //   targetid (mandatory) : target playlist URI - if omitted, tracks will be saved in place
  //   count (optional) : number of tracks to retrieve
  //   separation (optional) : tracks separation by artist - warning: if separation is not possible, tracks will be deleted
  //   toLimitOn (optional, boolean) : stop or continue (default) processing once one of the source playlists is exhausted
  //   private (optional boolean) : playlist visibility (default is public)
  // -------------------------------------------------------------------
  function alternatePlaylists(params = {name, description, playlists, targetid, count, separation, toLimitOn, private}) {

    let name = params.name;
    let description = params.description || '';
    let playlists = params.playlists;  // array of playlists URI
    let targetid  = params.targetid;
    let count = params.count || 0;            // 0 retrieves all tracks
    let separation = params.separation || 0;  // 0 does not separate tracks
    let toLimitOn = params.toLimitOn || false;
    let private = params.private || false;

    Logger.log("Creating alternated playlist: " + name);

    // Number of tracks to retrieve from each playlist
    // If this is 0, all tracks will be retrieved
    let plsCount = count / (playlists.length);

    // Build up an array of track lists, corresponding to each playlist id
    let trackGroups = playlists.map(id => {

      // For efficiency, tracks are retrieved randomly, and limited to the number needed
      let plsTracks = Source.getTracks([{
        id: id,
        count: plsCount,   // If count = 0, retrieve all tracks
        inRow: false       // There seems to be a bug: when all tracks are retrieved, there is no shuffling
      }]);

      if (separation != 0 ) {
        Order.separateArtists(plsTracks, separation, true);
      } else {
        Order.shuffle(plsTracks);
      };

      return plsTracks
    });

    // Build up a simple array to define an equal mixing ratio for each playlist,
    // of one track at a time from each track list: [1,1,1,...]
    let ratio = playlists.map( id => {return 1} )

    // Alternate the track lists, 1 track at a time
    let tracks = Combiner.mixinMulti({
      source: trackGroups,
      inRow: ratio,
      toLimitOn: toLimitOn // true (default) stop processing as soon as the ratio cannot be adhered to
    });

    // Save playlist
    saveTracks({
      name: name,
      targetid: targetid,
      description: description,
      tracks: tracks,
      private: private,
    });
  }

  // -------------------------------------------------------------------
  // Aggregate playlists and save to a new playlist
  //   name (mandatory) : playlist name for saving
  //   descriptiom (optional) : description for saving
  //   playlists (mandatory) : array of source playlist URI
  //   targetid (mandatory) : target playlist URI - if omitted, tracks will be saved in place
  //   separation (optional) : tracks separation by artist - warning: if separation is not possible, tracks will be deleted
  //   private (optional boolean) : playlist visibility (default is public)
  // -------------------------------------------------------------------
  function aggregatePlaylists(params = {name, description, playlists, targetid, separation, private}) {

    let name = params.name;
    let description = params.description || '';
    let playlists = params.playlists;  // array of playlists URI
    let targetid  = params.targetid;
    let separation = params.separation || 0;  // 0 does not separate tracks
    let private = params.private || false;

    Logger.log("Creating aggregated playlist: " + name);

    // Concatenate all the track lists
    let tracks = []
    playlists.map( id => {
      Combiner.push( tracks, Source.getPlaylistTracks('', id))
    });

    // Separate artists, with 6 slots, shuffling the tracks at the same time
      if (separation != 0 ) {
      Order.separateArtists(tracks, separation, true);
    } else {
      Order.shuffle(tracks);
    };

    // Save playlist
    saveTracks({
      name: name,
      targetid: targetid,
      description: description,
      tracks: tracks,
      private: private,
    });
  }

}
