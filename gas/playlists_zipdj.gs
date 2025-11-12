function zipdjClassicTracks() {

  // let sourcePlaylist    = '7eufyawBpqQMvsIN4fgQB1'; let sourceName = 'Bachata';
  // let sourcePlaylist    = '7htbYn8f0q01n5br4XhQR9'; let sourceName = 'Cumbia';
  let sourcePlaylist    = '3Bsz7QecNExg8bsDdW4iGW'; let sourceName = 'Merengue';
  // let sourcePlaylist    = '0o2GXyncPfGLmGSiOqSINx'; let sourceName = 'Salsa';

  let numTracks         = 20;
  let archivePlaylist   = '1BQCyWrAkSLiDsra9TZgn8'; let archiveName = '[zipdj] all songs';
  let targetPlaylist    = '1uLOtPdWnESn9zbgzzZDlh'; let targetName = '[zipdj] workbench';

  // Load tracks already published on zipdj
  let publishedTracks = Source.getPlaylistTracks(archiveName, archivePlaylist);

  // Load tracks from source playlist
  let tracks = Source.getPlaylistTracks(sourceName, sourcePlaylist);
  Logger.log(tracks.length + ' tracks loaded from source playlist ' + sourceName);

  // Remove published tracks from source playlist
  Filter.removeTracks(tracks, publishedTracks);
  Logger.log(tracks.length + ' tracks remaining after removing the ones already published');

  // Sort tracks by decreasing popularity
  tracks.sort((a, b) => b.popularity - a.popularity);

  // Separate artists by the total number of tracks, to ensure artist uniqueness
  // There is a bug in the track ordering for separateArtists, and anything else produces unexpected results
  Order.separateArtists(tracks, tracks.length, false);

  Logger.log(tracks.length + ' tracks from unique artists');

  // // Sort tracks by decreasing popularity
  // tracks.sort((a, b) => b.popularity - a.popularity);

  // Keep only the number of tracks desired
  Selector.keepFirst(tracks, numTracks);
  
  // DEBUG LOG
  for (let i = 0; i < tracks.length; i++) {
    Logger.log('[' + tracks[i].popularity + '] : ' + tracks[i].artists[0].name + ' : ' + tracks[i].name );
  };

  // Save tracks to workbench playlist, appending to the existing ones
  Playlist.saveWithAppend({
    name: targetName,
    id: targetPlaylist,
    tracks: tracks,
    public: false
  });

}
