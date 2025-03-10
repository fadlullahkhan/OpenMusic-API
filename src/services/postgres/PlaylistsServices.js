import pg from 'pg';
import { nanoid } from 'nanoid';
import time from 'date-and-time';
import InvariantError from '../../exceptions/InvariantError.js';

const { Pool } = pg;

export default class PlaylistsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(18)}`;
    const now = new Date();
    const createdAt = time.format(now, 'ddd, DD MMM YYYY HH:mm:ss');

    const query = {
      text: 'INSERT INTO playlist VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, createdAt, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan playlist');
    }

    return result.rows[0].id;
  }
  
  async getPlaylists(owner) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username AS username FROM playlists JOIN users ON users.id = playlists.owner'
    }
  }
}
