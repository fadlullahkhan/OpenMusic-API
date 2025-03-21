import autoBind from 'auto-bind';

export default class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    console.log(request.payload);
    const { cover } = request.payload;

    this._validator.validateImageHeader(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);

    const response = h.response({
      status: 'success',
      data: {
        fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
      },
    });
    response.code(201);
    console.log(response);
    return response;
  }
}
