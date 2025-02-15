import 'dotenv/config';
import Hapi from '@hapi/hapi';
import albums from './api/albums/index.js';
import AlbumsServices from './services/postgres/AlbumsServices.js';
import AlbumsValidator from './validator/albums/index.js';
import ClientError from './exceptions/ClientError.js';

const init = async () => {
  const albumsServices = new AlbumsServices();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsServices,
      validator: AlbumsValidator,
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
