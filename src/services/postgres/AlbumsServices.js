import pg from 'pg';
import { nanoid } from 'nanoid';
import time from 'date-and-time';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import { albumMapDBToModel } from '../../utils/index.js';

const { Pool } = pg;

export default class AlbumsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(18)}`;
    const now = new Date();
    const createdAt = time.format(now, 'ddd, DD MMM YYYY HH:mm:ss');
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4,$5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan album.');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT id, name, year FROM albums');

    return result.rows.map(albumMapDBToModel);
  }

  async getAlbumById(id) {
    const query = {
      text: `
        SELECT 
          a.id AS album_id, a.name AS album_name, a.year AS album_year,
          s.id AS song_id, s.title AS song_title, 
          s.performer AS song_performer
        FROM albums a
        LEFT JOIN songs s ON a.id = s.album_id
        WHERE a.id = $1;
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal mendapatkan album. Id tidak ditemukan.');
    }

    const album = {
      id: result.rows[0].album_id,
      name: result.rows[0].album_name,
      year: result.rows[0].album_year,
      songs: result.rows
        .filter((row) => row.song_id)
        .map((row) => ({
          id: row.song_id,
          title: row.song_title,
          performer: row.song_performer,
        })),
    };

    return album;
  }

  async editAlbumById(id, { name, year }) {
    const now = new Date();
    const updatedAt = time.format(now, 'ddd, DD MMM YYYY HH:mm:ss');
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan.');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus catatan. Id tidak ditemukan');
    }
  }
}
