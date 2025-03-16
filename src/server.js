import 'dotenv/config';
import Hapi from '@hapi/hapi';
// albums plugin
import albums from './api/albums/index.js';
import AlbumsServices from './services/postgres/AlbumsServices.js';
import AlbumsValidator from './validator/albums/index.js';

// songs plugin
import songs from './api/songs/index.js';
import SongsServices from './services/postgres/SongsServices.js';
import SongsValidator from './validator/songs/index.js';

// users plugin
import users from './api/users/index.js';
import UsersServices from './services/postgres/UsersServices.js';
import UserValidator from './validator/users/index.js';

// authentications plugin
import authentications from './api/authentications/index.js';
import AuthenticationsServices from './services/postgres/AuthenticationsServices.js';
import TokenManager from './tokenize/TokenManager.js';
import AuthenticationsValidator from './validator/authentications/index.js';

import ClientError from './exceptions/ClientError.js';

const init = async () => {
  const albumsServices = new AlbumsServices();
  const songsServices = new SongsServices();
  const usersServices = new UsersServices();
  const authenticationsServices = new AuthenticationsServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsServices,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsServices,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersServices,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService: authenticationsServices,
        usersService: usersServices,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

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
