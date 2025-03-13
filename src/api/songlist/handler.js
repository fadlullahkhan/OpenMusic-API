import autoBind from 'auto-bind';

export default class SongListHandler {
  constructor(service, playlistsService, songsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postSongListHandler(request, h) {
    this._validator.validateSongListPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this._playlistsService.getPlaylistById(playlistId);
    this._songsService.getSongById(songId);

    await this._service.addSongList(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Menambahkan Lagu ke Playlist',
    });
    response.code(201);
    return response;
  }

  async getSongListHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const playlist = await this._playlistsService.getPlaylistById(playlistId);

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const songs = await this._service.getSongList(playlistId);

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    };
  }

  async deleteSongListHandler(request) {
    this.validator.validateSongListPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.getPlaylistById(playlistId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteSongList(playlistId, songId);
    
    return {
      status: 'success',
      message: 'Menghapus Lagu dari Playlist'
    }
  }
}
