import { PlaylistPayloadSchema } from './schema';
import InvariantError from '../../exceptions/InvariantError';

const PlaylistValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default PlaylistValidator;
