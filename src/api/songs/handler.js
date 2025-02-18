import autoBind from 'auto-bind';

export default class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const { title, year, performer, genre, duration, albumId } =
      request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    console.log('songId');

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan.',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }
}
