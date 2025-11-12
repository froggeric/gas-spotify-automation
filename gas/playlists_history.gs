// One off complex playlists creation with history, to avoid repeat on consecutive days
//  Playlist d'aujourd'hui

// Playlist d'aujourd'hui
function createAujourdhui() {

  let name = 'La playlist d\'aujourd\'hui';
  let id = '2X3iP4naAyWlgIaIC5vbSB';
  let historyFile = 'aujourdhui.json';
  let playlistSize = 200;
  let historyDays = 6;
  let today = (new Date()).toISOString().split('T')[0];
  let description = "[DAILY UPDATE " + today + "]";

  Logger.log("Creating custom playlist: " + name);

  // Load previously saved tracks
  let tracksPrevious = Cache.read(historyFile);
  Logger.log(Math.round(tracksPrevious.length) + ' tracks from recent playlist loaded');

  // Get all tracks from source playlists
  let tracks = Source.getTracks([
    {
      name: '[all english]',
      id: '3XWhltPcZYDWq6MA7H7UvI'
    },
    {
      name: '[all latin]',
      id: '1WFP39vejsXR3BTPfOGXDS'
    },
    {
      name: '[all reggae]',
      id: '4gf91RHNDtzuXM7HgfzVUD'
    },
    {
      name: '<!>Chansons françaises',
      id: '3plV4afF2Xknof5Dg452oH'
    },
    {
      name: '<!>Romance en plusieurs langues',
      id: '607E5Mm4upC4GvYrcCeemC'
    },
    {
      name: 'Africa',
      id: '01ZFpwEJjerIgTovfnSaGO'
    }]);
  Logger.log(Math.round(tracks.length) + ' total tracks available from source playlists');
  // Remove duplicates
  Filter.dedupTracks(tracks);
  Logger.log(Math.round(tracks.length) + ' tracks left after removing duplicates');
  // Remove the tracks loaded from the previous history
  Filter.removeTracks(tracks, tracksPrevious);
  Logger.log(Math.round(tracks.length) + ' tracks left after removing selections from the past ' + historyDays + ' days');
  // Only keep a specified number of tracks, randomly selected
  Selector.keepRandom(tracks, playlistSize);
  Logger.log(Math.round(tracks.length) + ' tracks randomly selected for the new playlist');

  // Save playlist, without modifying the cover
  Playlist.saveWithReplace({
    id: id,
    name: name,
    tracks: tracks,
    description: description,
    public: true
  });

  // Add new playlist tracks to history
  // Cleanup the tracklist by removing unnecessary information
  Cache.compressTracks(tracks);
  // Add tracks to the beginning, and truncate the history according to the preset limit
  let historyLimit = historyDays * playlistSize;
  Cache.append(historyFile, tracks, 'begin', historyLimit);
}
