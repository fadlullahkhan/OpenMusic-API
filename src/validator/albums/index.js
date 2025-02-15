import InvariantError from '../../exceptions/InvariantError.js';
import AlbumPayloadsSchema from './schema.js';

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadsSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default AlbumsValidator;
