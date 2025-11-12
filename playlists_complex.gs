// One off complex playlists creation:
//  Melatone
//  Bachata vs Salsa vs Cumbia
//  Back to sleep
//  Latin Party Mix
//  Fitness playlists

// Melatone
// Concatenated tracks from 3 playlists
// run on a different schedule from other playlists
function createMelatone() {

  let name = 'Melatone';
  let id = '6b4w2n49x7eVcYu3s90pCN';
  let today = (new Date()).toISOString().split('T')[0];
  let description = "[DAILY SHUFFLE " + today + "] An instrumental playlist to fall asleep to. Approximately 45 to 60 minutes long. [1] First part: soft melodic songs to relax. [2] Second part: calmer songs to help fall asleep. [3] Final part: a few repetitions of the most relaxing song ever (Weightless by Marconi Union).";

  Logger.log("Creating custom playlist: " + name);

  // Get x random tracks from each playlist
  let tracks = Source.getTracks([
    {
      name: '<!>Melatone 1 relax',
      id: '4ydomBoG4tHzp1ekls1rSd',
      count: 4,
      inRow: false
    },
    {
      name: '<!>Melatone 2 falling asleep',
      id: '26ttzfvBwnULKyT1F90Icb',
      count: 4,
      inRow: false
    },
    {
      name: '<!>Melatone 3 deep sleep',
      id: '5bo06n7PBW5vXNj5ae7qte',
      count: 3,
      inRow: false
    }]);

  // Save playlist, without modifying the cover nor description
  Playlist.saveWithReplace({
    id: id,
    name: name,
    tracks: tracks,
    description: description,
    public: true
  });
}

// Back to sleep
// Concatenated tracks from 2 playlists
// run on a different schedule from other playlists
function createBackToSleep() {

  let name = 'Back to sleep';
  let id = '0PYcAZ0kdV5wyjynCcGzIR';
  let today = (new Date()).toISOString().split('T')[0];
  let description = "[DAILY SHUFFLE " + today + "] A sort playlist to help going back to sleep when waking up in the middle of the night.";

  Logger.log("Creating custom playlist: " + name);

  // Get x random tracks from each playlist
  let tracks = Source.getTracks([
    {
      name: '<!>Melatone 2 falling asleep',
      id: '26ttzfvBwnULKyT1F90Icb',
      count: 1,
      inRow: false
    },
    {
      name: '<!>Melatone 3 deep sleep',
      id: '5bo06n7PBW5vXNj5ae7qte',
      count: 2,
      inRow: false
    }]);

  // Save playlist, without modifying the cover nor description
  Playlist.saveWithReplace({
    id: id,
    name: name,
    tracks: tracks,
    description: description,
    public: true
  });
}

// Latin Party Mix
// Alternated tracks from 4 playlists, filtered on duration, with a slight shuffle applied
function createLatinPartyMix() {
  let name = 'Latin party mix (cumbia, bachata, salsa, merengue)';
  let id = '672FuqsErGsxloQTpjbXYq';
  let playlists = [
    '7htbYn8f0q01n5br4XhQR9', // Cumbia (shuffled)
    '0o2GXyncPfGLmGSiOqSINx', // Salsa (shuffled)
    '7eufyawBpqQMvsIN4fgQB1', // Bachata (combined and shuffled)
    '3Bsz7QecNExg8bsDdW4iGW'  // Merengue (shuffled)
  ];
  let plsCount = 40;        // retrieve 40 tracks from each playlist
  let durationMin = 120000; // minimum duration in ms: 2min = 120s - exclude short intros
  let durationMax = 360000; // maximum duration in ms: 6mim = 360s - exclude long medleys
  let factor = 0.02;        // variable shuffle percentage (originally 0.02)

  let today = (new Date()).toISOString().split('T')[0];
  let description = "[DAILY SHUFFLE " + today + "] 25% cumbia, 25% bachata, 25% salsa, 25% merengue. Mostly alternated genres, with a slight shuffle. Filtered out by duration to try to exclude medleys.";

  Logger.log("Creating custom playlist: " + name);

  // Build up an array of track lists, corresponding to each playlist id
  let trackGroups = playlists.map(id => {

    // Get tracks from source playlist
    //   For efficiency, we randomly retrieve a limited number of tracks.
    //   Since some of those will excluded later, due to their duration,
    //   We add 50% extra tracks.
    let plsTracks = Source.getTracks([
      {
        id: id,
        count: Math.floor(plsCount * 1.5),
        inRow: false
      }
    ]);

    // Only keep tracks tracks within the desired duration
    Filter.rangeTracks(plsTracks, {
        meta: {
          duration_ms: { min: durationMin, max: durationMax }
        }
    });

    // Only keep the desired number of tracks from the playlist
    Selector.keepFirst(plsTracks, plsCount);

    return plsTracks
  });

  // Alternate the track lists
  let tracks = Combiner.mixinMulti({
    source: trackGroups,
    inRow: [1,1,1,1],  // equal mixing ratio for each playlist, 1 track at a time
    toLimitOn: true    // stop processing as soon as the ratio cannot be adhered to
  });

  // Variable shuffle with with localised randomness factor
  let length = tracks.length;
  let permutations = length * factor;   // number of permutations we need to perform
  // shuffled index matching the size of the array
  let shuffledIndexes = Array.from(Array(length).keys()).sort(_ => Math.random() - .5)
  for (let i = 0; i < permutations; i++) {
    let x = shuffledIndexes[i];
    let r = Math.floor(Math.random() * (x + 1));
    let y = Math.floor(r * factor + x * (1 - factor));
    [tracks[x], tracks[y]] = [tracks[y], tracks[x]];
  }

  // Save the playlist
  Playlist.saveWithReplace({
    id: id,
    name: name,
    tracks: tracks,
    description: description,
    public: true
  });

}

// Bachata vs Salsa vs Cumbia
// Alternated tracks from 3 playlists, pattern: BSBSBC
function createBachataSalsaCumbia() {
  let name = '★ Bachata vs Salsa vs Cumbia ★';
  let id = '2i86j69ApMQVL6Fi4oQ1H0';
  let today = (new Date()).toISOString().split('T')[0];
  let description = "[DAILY SHUFFLE " + today + "] 150 new tracks every day! Taken from my manually curated playlists, alternating Bachata, Salsa, and Cumbia. Pattern: Bachata/Salsa/Bachata/Salsa/Bachata/Cumbia.";

  Logger.log("Creating custom playlist: " + name);

  // Get bachata tracks
  let tracksBachata = Source.getTracks([{
    id: '7eufyawBpqQMvsIN4fgQB1', // Bachata (combined and shuffled)
    count: 75,
    inRow: false
  }]);

  // Get salsa tracks
  let tracksSalsa = Source.getTracks([{
    id: '0o2GXyncPfGLmGSiOqSINx', // Salsa (shuffled)
    count: 50,
    inRow: false
  }]);

  // Get cumbia tracks
  let tracksCumbia = Source.getTracks([{
    id: '7htbYn8f0q01n5br4XhQR9', // Cumbia (shuffled)
    count: 25,
    inRow: false
  }]);

  // Combine salsa and cumbia tracks as: SSC
  let tracksSalsaCumbia = Combiner.mixin(tracksSalsa, tracksCumbia, 2, 1);

  // Combine all tracks as: BSBSBC
  let tracks = Combiner.alternate('max', tracksBachata, tracksSalsaCumbia);

  // Save the playlist
  Playlist.saveWithReplace({
    id: id,
    name: name,
    tracks: tracks,
    description: description,
    public: true
  });

}

// Fitness playlists
// Sources: merengue, cumbia, reggaeton (running)
// Sources: merengue, cumbia, reggaeton, bachata, latin pop, all reggae, all english (cycling)
// filtered on bpm (including halved) and energy
function createFitnessPlaylists() {

  let today = (new Date()).toISOString().split('T')[0];

  // Running 180 bpm
  let name = 'Running 180 bpm (daily update)';
  let id = '3ObKrWDdeEAcO7RxWRMItj';
  let description = "[DAILY REFRESH " + today + "] 90 minutes of latin songs for running, around the 180 BPM range (including halved BPM). Selected from my Cumbia, Merengue and Reggaeton playlists. Sorted by increasing tempo.";
  let durationMax = 90;    // max duration in minutes of the final playlist
  let bpmTarget = 180;     // 180 BPM is the recemmended number of steps per minute for running
  let bpmDeviation = 0.15; // BPM range will be 15% of the target, centered around the target BPM
  let tracks = [];
  // Source playlists
  let energyMin = 0.4;     // minimum energy of tracks to keep
  let energyMax = 1.0;     // maximum energy of tracks to keep
  let danceMin = 0;        // minimum danceability of tracks to keep
  let valenceMin = 0;      // minimum valence of tracks to keep
  let happinessMin = 0;    // minimum happiness of tracks to keep
  let angerMax = 1;        // maximum anger of tracks to keep
  let sadnessMax = 1;      // maximum sadness of tracks to keep
  let tracksEnglish = FilterFitnessPlaylist('[all english]', '3XWhltPcZYDWq6MA7H7UvI');
  let tracksCumbia = FilterFitnessPlaylist('<!>Cumbia [archive]', '1hSmpmZbgkoGpcIrCU9rpF');
  let tracksMerengue = FilterFitnessPlaylist('<!>Merengue [archive]', '0W2lVKgN2AbsFus2RIAiHz');
  let tracksReggaeton = FilterFitnessPlaylist('<!>Reggaeton [archive]', '1UoWJkPDZbNwuvNYrH6JRu');
  Combiner.push(tracks, tracksCumbia, tracksMerengue, tracksReggaeton);
  // Shuffle, extract duration, and save playlist
  SaveFitnessPlaylist( name, id, tracks, description);

  // Cycling 80 rpm
  name = 'Cycling 80 rpm (daily update)';
  id = '3ILZOMnYvRpifSc6By5WfG';
  description = "[DAILY REFRESH " + today + "] 3 hours of songs for cycling, around the 80 BPM range (including doubled BPM). Selected from my cumbia, bachata, reggaeton, merengue and latin pop playlists."
  durationMax = 180;   // max duration in minutes of the final playlist
  bpmTarget = 160;     // 80 rpm is the recemmended number of steps per minute for running
  bpmDeviation = 0.20  // BPM range will be 20% of the target, centered around the target BPM
  tracks = [];
  // LATIN source playlists
  energyMin = 0.4;     // minimum energy of tracks to keep
  energyMax = 1.0;     // maximum energy of tracks to keep
  danceMin = 0;        // minimum danceability of tracks to keep
  valenceMin = 0;      // minimum valence of tracks to keep
  happinessMin = 0;    // minimum happiness of tracks to keep
  angerMax = 1;        // maximum anger of tracks to keep
  sadnessMax = 1;      // maximum sadness of tracks to keep
  tracksCumbia = FilterFitnessPlaylist('<!>Cumbia [archive]', '1hSmpmZbgkoGpcIrCU9rpF');
  tracksMerengue = FilterFitnessPlaylist('<!>Merengue [archive]', '0W2lVKgN2AbsFus2RIAiHz');
  tracksReggaeton = FilterFitnessPlaylist('<!>Reggaeton [archive]', '1UoWJkPDZbNwuvNYrH6JRu');
  let tracksBachata = FilterFitnessPlaylist('Bachata', '7eufyawBpqQMvsIN4fgQB1');
  let tracksLatinPop = FilterFitnessPlaylist('Latin pop', '7qYD0PW41lQwWXLRY79D2n');
  Combiner.push(tracks, tracksCumbia, tracksMerengue, tracksReggaeton, tracksBachata, tracksLatinPop);
  // Shuffle, extract duration, and save playlist
  SaveFitnessPlaylist( name, id, tracks, description, false );

  // Fitness 120 bpm
  name = 'Fitness 120 bpm (daily update)';
  id = '3V6pdBEtDLx49Oz6AYxIQ1';
  description = "[DAILY REFRESH " + today + "] 1 hour of songs for cardio and calisthenics, around the 120 BPM range (including halved BPM). Selected from my reggae, and english playlists."
  durationMax = 80;   // max duration in minutes of the final playlist
  bpmTarget = 120;     // 80 rpm is the recemmended number of steps per minute for running
  bpmDeviation = 0.20  // BPM range will be 20% of the target, centered around the target BPM
  tracks = [];
  // // REGGAE source playlist
  energyMin = 0.5;     // minimum energy of tracks to keep
  energyMax = 1.0;     // maximum energy of tracks to keep
  danceMin = 0;        // minimum danceability of tracks to keep
  valenceMin = 0;      // minimum valence of tracks to keep
  happinessMin = 0;    // minimum happiness of tracks to keep
  angerMax = 1;        // maximum anger of tracks to keep
  sadnessMax = 1;      // maximum sadness of tracks to keep
  let tracksReggae = FilterFitnessPlaylist('[all reggae]', '4gf91RHNDtzuXM7HgfzVUD');
  Combiner.push(tracks, tracksReggae);
  // ENGLISH source playlist
  energyMin = 0.75;    // minimum energy of tracks to keep
  energyMax = 1.0;     // maximum energy of tracks to keep
  danceMin = 0.5;      // minimum danceability of tracks to keep
  valenceMin = 0;      // minimum valence of tracks to keep
  happinessMin = 0;    // minimum happiness of tracks to keep
  angerMax = 1;        // maximum anger of tracks to keep
  sadnessMax = 1;      // maximum sadness of tracks to keep
  tracksEnglish = FilterFitnessPlaylist('[all english]', '3XWhltPcZYDWq6MA7H7UvI');
  Combiner.push(tracks, tracksEnglish);
  // Shuffle, extract duration, and save playlist
  SaveFitnessPlaylist( name, id, tracks, description, false );

  // Yoga
  // name = 'Yoga (daily update)';
  // id = '1ruY45aZSITo1NnS9IiNWn';
  // description = "[DAILY REFRESH " + today + "] Experimental Yoga playlist"
  // durationMax = 3600;  // max duration in minutes of the final playlist
  // bpmTarget = 110;     // middle point of 100-120
  // bpmDeviation = 0.11  // 89% to 111% of targe BPM
  // tracks = [];
  // ENGLISH and REGGAE source playlist
  // energyMin = 0.1;       // minimum energy of tracks to keep
  // energyMax = 0.7;       // maximum energy of tracks to keep
  // danceMin = 0.2;        // minimum danceability of tracks to keep
  // danceMax = 0.7;        // minimum danceability of tracks to keep
  // valenceMin = 0.2;      // minimum valence of tracks to keep
  // happinessMin = 0.2;    // minimum happiness of tracks to keep
  // angerMax = 0.6;        // maximum anger of tracks to keep
  // sadnessMax = 0.6;      // maximum sadness of tracks to keep
  // tracksEnglish = FilterFitnessPlaylist('[all english]', '3XWhltPcZYDWq6MA7H7UvI');
  // Combiner.push(tracks, tracksEnglish);
  // tracksReggae = FilterFitnessPlaylist('[all reggae]', '4gf91RHNDtzuXM7HgfzVUD');
  // Combiner.push(tracks, tracksReggae);
  // // Shuffle, extract duration, and save playlist
  // SaveFitnessPlaylist( name, id, tracks, description, false );
 

  function FilterFitnessPlaylist( name, id) {

    let bpmMargin = bpmTarget*bpmDeviation/2; // half percentage of BPM deviation to -/+ around the target
    let bpmMin = bpmTarget - bpmMargin;       // minimum BPM of tracks to keep
    let bpmMax = bpmTarget + bpmMargin;       // minimum BPM of tracks to keep

    // get source tracks
    let tracks = Source.getTracks([
      {
        name: name,
        id: id
      }]);
    let total = tracks.length;
  
    // Make a copy of the playlist for halved BPM filtering
    let halvedTracks = Selector.sliceCopy(tracks);

    // Filter the tracks based on tempo and energy
    // Add tempo information to tracks
    FilterByTempo( tracks, bpmMin, bpmMax, 1 );
    FilterByTempo( halvedTracks, bpmMin/2, bpmMax/2, 2 );

    let totalFullBPM = tracks.length;
    let totalHalfBPM = halvedTracks.length;
    
    // Combine both results, shuffle the tracks, and only keep up to a maximum duration
    Combiner.push(tracks, halvedTracks);
    let totalFiltered = tracks.length;

    Logger.log("Filtered " + totalFiltered + '/' + total + ' tracks (' + totalFullBPM + ' @ ' + bpmMin + '-' + bpmMax + ' bpm + ' + totalHalfBPM + ' @ ' + bpmMin/2 + '-' + bpmMax/2 + ' bpm) from ' + name);

    return tracks;
  }


  function FilterByTempo( tracks, bpmMin, bpmMax, multiplier = 1 ) {

    let danceMax = 1.0;     // maximum danceability of tracks to keep
    let valenceMax = 1.0;   // maximum valence of tracks to keep
    let happinessMax = 1.0; // maximum happiness of tracks to keep
    let angerMin = 0.0;     // minimum anger of tracks to keep
    let sadnessMin = 0.0;   // minimum sadness of tracks to keep

    // Only keep tracks tracks within the desired BPM range
    // Only keep tracks with sufficient energy
    // anger     = energy * (1 - valence);
    // happiness = energy * valence;
    // sadness   =  (1 - energy) * (1 - valence);
    Filter.rangeTracks(tracks, {
      features: {
        tempo: { min: bpmMin, max: bpmMax },
        energy: { min: energyMin, max: energyMax },
        danceability: { min: danceMin, max: danceMax },
        valence: { min: valenceMin, max: valenceMax },
        happiness: { min: happinessMin, max: happinessMax },
        anger: { min: angerMin, max: angerMax },
        sadness: { min: sadnessMin, max: sadnessMax },
      }
    });

    // Add tempo information to tracks
    // Since the audio features have already been queried during the filtering,
    // goofy keeps them in the cache, and we can retrieve the whole cache content
    let cache = getCachedTracks(tracks, { features: {} }).features;
    let cachedItems = Object.values(cache);

    // For efficiency, since we have a lot more in the cache than the tracklist,
    // we first iterate through all the cached items
    for (let x = 0; x < cachedItems.length; x++) {
      let item = cachedItems[x];
      let id = item.id;
      // Now we iterate the tracklist to find a matching track, if any
      for (let y = 0; y < tracks.length; y++) {
        // Check it the current cached item is a match for the current track
        if ( tracks[y].id == id ) {
          // Save the tempo (potentially modified) to the track properties
          let tempo = item.tempo * multiplier;
          tracks[y].tempo = tempo;
          // Logger.log( id + ' = '+ tracks[y].id + ' : ' + tempo);
        }
      }
    }
  }


  function SaveFitnessPlaylist( name, id, tracks, description, sorted = true ) {
 
    // dedup and shuffle tracks, before only keeping up to the maximum duration
    Filter.dedupTracks(tracks);
    let total = tracks.length;
    Order.shuffle(tracks);
    Selector.keepNoLongerThan(tracks, durationMax+1);
    let saved = tracks.length;

    Logger.log("Creating custom playlist: " + name + ' (kept ' + saved + '/' + total + ' tracks)');

    if (sorted) {
      // Sort by increasing tempo
      tracks.sort((x, y) => {
          return x.tempo - y.tempo;
      });
    }

    // for (let y = 0; y < tracks.length; y++) {
    //   Logger.log( tracks[y].tempo + ' ' + tracks[y].name);
    // }

    // Save playlist, without modifying the cover
    Playlist.saveWithReplace({
      id: id,
      name: name,
      tracks: tracks,
      description: description,
      public: true
    });

  }

}
