import PlaylistsHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'playlists',
  version: '1.0.0',
  register: async (
    server,
    { service, playlistSongsService, activitiesService, songsService, validator },
  ) => {
    const playlistsHandler = new PlaylistsHandler(service, playlistSongsService, activitiesService, songsService, validator);

    server.route(routes(playlistsHandler));
  },
};
