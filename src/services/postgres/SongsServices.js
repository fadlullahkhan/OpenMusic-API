import pg from 'pg';
import { nanoid } from 'nanoid';
import time from 'date-and-time';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import { songMapDBToModel } from '../../utils/index.js';

const { Pool } = pg;

export default class SongsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(18)}`;
    const now = new Date();
    const createdAt = time.format(now, 'ddd, DD MMM YYYY HH:mm:ss');
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [
        id,
        title,
        year,
        performer,
        genre,
        createdAt,
        updatedAt,
        duration,
        albumId,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu');
    }

    return result.rows[0].id;
  }

  // async getSongs({ title = '', performer = '' }) {
    // const result = await this._pool.query(
    //   'SELECT songs.id, songs.title, songs.performer FROM songs',
    // );

    // if (title !== '' || performer !== '') {
    //   const filterResult = result.rows.filter(
    //     (song) => song.title === title || song.performer === performer,
    //   );

    //   return filterResult;
    // }

    // return result.rows;}
    
    async getSongs({ title = '', performer = '' }) {
    let queryText = 'SELECT id, title, performer FROM songs';
    const values = [];
    const conditions = [];

    if (title) {
        conditions.push(`LOWER(title) LIKE LOWER($${values.length + 1})`);
        values.push(`%${title}%`);
    }

    if (performer) {
        conditions.push(`LOWER(performer) LIKE LOWER($${values.length + 1})`);
        values.push(`%${performer}%`);
    }

    if (conditions.length > 0) {
        queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    const result = await this._pool.query({
        text: queryText,
        values,
    });

    return result.rows;
}

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal mendpatkan lagu. Id tidak ditemukan');
    }

    return result.rows.map(songMapDBToModel)[0];
  }

  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    const now = new Date();
    const updatedAt = time.format(now, 'ddd, DD MMM YYYY HH:mm:ss');

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, updated_at = $5, duration = $6, album_id = $7 WHERE id = $8 RETURNING id',
      values: [title, year, performer, genre, updatedAt, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
    }
  }
}
