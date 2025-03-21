import routes from './routes.js';
import ExportsHandler from './handler.js';

export default {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, playlistsService, validator }) => {
    const exportsHandler = new ExportsHandler(
      service,
      playlistsService,
      validator,
    );

    server.route(routes(exportsHandler));
  },
};
