import autoBind from 'auto-bind';

export default class CollaborationsHandler {
  constructor(service, playlistsService, usersService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    await this._usersService.getUserById(userId);

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._service.addCollaboration(
      playlistId,
      userId,
    );

    const response = h.response({
      status: 'success',
      message: 'Menambahkan Kolaborator',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Menghapus Kolaborator',
    });
    response.code(200);
    return response;
  }
}
