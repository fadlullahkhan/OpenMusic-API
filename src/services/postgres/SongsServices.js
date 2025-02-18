import pg from 'pg';
import { nanoid } from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
// import NotFoundError from '../../exceptions/NotFoundError.js';

const { Pool } = pg;

export default class SongsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(18)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    console.log(query);

    const result = await this._pool.query(query);

    console.log(result);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu');
    }

    return result.rows[0].id;
  }
}
