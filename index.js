require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./src/api/albums');
const songs = require('./src/api/songs');
const AlbumsService = require('./src/services/AlbumsService');
const SongsService = require('./src/services/SongsService');
const AlbumsValidator = require('./src/validator/albums');
const SongsValidator = require('./src/validator/songs');
const ClientError = require('./src/exceptions/ClientError');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Register plugins
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
      routes: {
        prefix: '/albums',
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
      routes: {
        prefix: '/songs',
      },
    },
  ]);

  // Error handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    
    if (response instanceof Error) {
      // Handle client errors
      if (response instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: response.message,
        }).code(response.statusCode);
      }
      
      // Handle server errors
      console.error(response);
      return h.response({
        status: 'error',
        message: 'Internal Server Error',
      }).code(500);
    }
    
    return h.continue;
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init().catch((err) => {
  console.error(err);
  process.exit(1);
});