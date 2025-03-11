import InvariantError from '../../exceptions/InvariantError.js';
import { PlaylistPayloadSchema, SonglistPayloadSchema } from './schema.js';

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSonglistPayload: (payload) => {
    console.log(payload);
    const validationResult = SonglistPayloadSchema.validate(payload);
    
    console.log(validationResult);
    
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
};

export default PlaylistsValidator;
