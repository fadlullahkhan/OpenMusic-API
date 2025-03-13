import SongListHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'songlist',
  version: '1.0.0',
  register: async (
    server,
    { service, playlistsService, songsService, validator },
  ) => {
    const songlistHandler = new SongListHandler(
      service,
      playlistsService,
      songsService,
      validator,
    );

    server.route(routes(songlistHandler));
  },
};
