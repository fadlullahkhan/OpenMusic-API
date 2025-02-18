import InvariantError from '../../exceptions/InvariantError.js';
import SongPayloadsSchema from './schema.js';

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadsSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default SongsValidator;
