import autoBind from 'auto-bind';

export default class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist(name, credentialId);

    const response = h.response({
      status: 'succes',
      message: 'Menambahkan Playlist',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const playlists = await this._service.getPlaylists(credentialId);

    const response = h.response({
      status: 'success',
      message: 'Mendapatkan Playlist',
      data: {
        playlists,
      },
    });
    response.code(200);
    return response;
  }

  async getPlaylistByIdHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);

    const playlist = await this._service.getPlaylistById(credentialId);

    const response = h.response({
      status: 'success',
      message: 'Mendapatkan Playlist',
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  }
}
