import UploadsHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { service, albumsService, validator }) => {
    const uploadsHandler = new UploadsHandler(
      service,
      albumsService,
      validator
    );
    server.route(routes(uploadsHandler));
  },
};
