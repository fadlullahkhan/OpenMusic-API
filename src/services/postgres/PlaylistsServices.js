import pg from 'pg';
import { nanoid } from 'nanoid';
import time from 'date-and-time';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import AuthorizationError from '../../exceptions/AuthorizationError.js';

const { Pool } = pg;

export default class PlaylistsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(18)}`;
    const now = new Date();
    const createdAt = time.format(now, 'ddd, DD MMM YYYY HH:mm:ss');

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4)',
      values: [id, name, createdAt, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan Playlist');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username AS username FROM playlists JOIN users ON users.id = playlists.owner WHERE playlists.owner = $1',
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getPlaylistsById(id) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username AS username FROM playlists JOIN users ON users.id = playlists.owner WHERE playlists.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal mendapatkan Playlist. Id tidak ditemukan');
    }

    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus Playlist. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses Playlist ini');
    }
  }
}
