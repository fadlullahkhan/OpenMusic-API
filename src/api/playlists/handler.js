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

    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Menambahkan Playlist',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async postSongIntoPlaylistHandler(request, h) {
    console.log(request.payload);
    this._validator.validateSonglistPayload(request.payload);

    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.addSongIntoPlaylist(id, songId);

    const response = h.response({
      status: 'success',
      message: 'Menambahkan lagu ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getSonglistByIdHandler(request) {
    return request.params
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Menghapus Playlist',
    };
  }
}
