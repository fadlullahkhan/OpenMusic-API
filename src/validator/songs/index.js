import InvariantError from '../../exceptions/InvariantError.js';
import { PayloadsSchemaSong, QuerySchemaSong } from './schema.js';

const SongsValidator = {
  payloadSong: (payload) => {
    const validationResult = PayloadsSchemaSong.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  querySong: (query) => {
    const validationResult = QuerySchemaSong.validate(query);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default SongsValidator;
