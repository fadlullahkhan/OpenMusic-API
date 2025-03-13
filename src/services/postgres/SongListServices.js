import pg from 'pg';
import { nanoid } from 'nanoid';
import time from 'date-and-time';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import AuthorizationError from '../../exceptions/AuthorizationError.js';

const { Pool } = pg;

export default class SongListServices {
  constructor() {
    this._pool = new Pool();
  }

  async addSongList(playlistId, songId) {
    const id = `songlist-${nanoid(18)}`;
    const now = new Date();
    const createdAt = time.format(now, 'ddd, DD MMM YYYY HH:mm:ss');

    const query = {
      text: 'INSERT INTO songlist VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, playlistId, songId, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist');
    }

    return result.rows[0].id;
  }

  async getSongList(id) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs JOIN songlist ON songs.id = songlist.song_id WHERE songlist.playlist_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteSongList(playlistId, songId) {
    const query = {
      text: 'DELETE FROM songlist WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan')
    }
  }
}
