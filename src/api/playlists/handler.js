import autoBind from 'auto-bind';

export default class PlaylistsHandler {
  constructor(
    service,
    playlistSongService,
    activitiesService,
    songsService,
    validator,
  ) {
    this._service = service;
    this._playlistSongService = playlistSongService;
    this._activitiesService = activitiesService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist(name, credentialId);

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

    const playlist = await this._service.getPlaylistById(playlistId);

    const response = h.response({
      status: 'success',
      message: `Mendapatkan Playlist ${playlist.name}`,
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylistById(playlistId);

    const response = h.response({
      status: 'success',
      message: 'Menghapus Playlist',
    });
    response.code(200);
    return response;
  }

  async postSongIntoPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    await this._songsService.getSongById(songId);

    await this._playlistSongService.addSongIntoPlaylist(playlistId, songId);

    await this._activitiesService.addPlaylistActivity(
      playlistId,
      songId,
      credentialId,
      'add',
    );

    const response = h.response({
      status: 'success',
      message: 'Menambahkan Lagu ke Playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsInPlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._service.getPlaylistById(playlistId);
    const songs =
      await this._playlistSongService.getSongsInPlaylist(playlistId);

    const response = h.response({
      status: 'success',
      message: `Mendapatkan Playlist ${playlist.name}`,
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    });
    response.code(200);
    return response;
  }

  async deleteSongInPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    await this._playlistSongService.deleteSongInPlaylist(playlistId, songId);

    await this._activitiesService.addPlaylistActivity(
      playlistId,
      songId,
      credentialId,
      'delete',
    );

    const response = h.response({
      status: 'success',
      message: 'Menghapus Lagu dari Playlist',
    });
    response.code(200);
    return response;
  }

  async getPlaylistActivities(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    await this._service.getPlaylistById(playlistId);

    const activities =
      await this._activitiesService.getPlaylistActivities(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
        activities: activities,
      },
    });
    response.code(200);
    return response;
  }
}
