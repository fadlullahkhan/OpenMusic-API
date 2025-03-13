import { SongListPayloadSchema } from './schema.js';
import InvariantError from '../../exceptions/InvariantError.js';

const SongListValidator = {
  validateSongListPayload: (payload) => {
    const validationResult = SongListPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default SongListValidator;