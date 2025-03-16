const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/playlists',
    handler: handler.deletePlaylistByIdHandler,
  },
];

export default routes;
