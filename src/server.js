import 'dotenv/config';

import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import inert from '@hapi/inert';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

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

// playlists plugin
import playlists from './api/playlists/index.js';
import PlaylistsServices from './services/postgres/PlaylistsServices.js';
import PlaylistSongsServices from './services/postgres/PlaylistSongsServices.js';
import ActivitiesServices from './services/postgres/ActivitiesServices.js';
import PlaylistValidator from './validator/playlists/index.js';

// collaborations plugin
import collaborations from './api/collaborations/index.js';
import CollaborationsServices from './services/postgres/CollaborationsServices.js';
import CollaborationsValidator from './validator/collaborations/index.js';

// exports plugin
import _exports from './api/exports/index.js';
import ProducerServices from './services/rabbitmq/ProducerServices.js';
import ExportsValidator from './validator/exports/index.js';

// uploads plugin
import uploads from './api/uploads/index.js';
import StorageServices from './services/storage/StorageServices.js';
import UploadsValidator from './validator/uploads/index.js';

import ClientError from './exceptions/ClientError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const init = async () => {
  const albumsServices = new AlbumsServices();
  const songsServices = new SongsServices();
  const usersServices = new UsersServices();
  const authenticationsServices = new AuthenticationsServices();
  const collaborationsServices = new CollaborationsServices();
  const playlistsServices = new PlaylistsServices(collaborationsServices);
  const playlistSongsServices = new PlaylistSongsServices();
  const activitiesServices = new ActivitiesServices();
  const storageServices = new StorageServices(
    path.resolve(__dirname, 'images/cover')
  );

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
      plugin: Jwt,
    },
    {
      plugin: inert,
    },
  ]);

  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: playlists,
      options: {
        service: playlistsServices,
        playlistSongsService: playlistSongsServices,
        activitiesService: activitiesServices,
        songsService: songsServices,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationsServices,
        playlistsService: playlistsServices,
        usersService: usersServices,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerServices,
        playlistsService: playlistsServices,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageServices,
        albumsService: albumsServices,
        validator: UploadsValidator,
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
