import autoBind from 'auto-bind';

export default class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);

    const { username, password, fullname } = request.payload;

    const userId = await this._service.addUser(username, password, fullname);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan User',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;
    const user = await this._service.getUserById(id);

    return {
      statue: 'success',
      data: {
        user,
      },
    };
  }
}
