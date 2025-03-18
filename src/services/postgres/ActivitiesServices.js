import pg from 'pg';
import { nanoid } from 'nanoid';
import time from 'date-and-time';
import InvariantError from '../../exceptions/InvariantError.js';

const { Pool } = pg;

export default class ActivitiesServices {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(18)}`;
    const now = new Date();
    const update = time.format(now, 'ddd, DD MMM YYYY HH:mm:ss');

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, update],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Aktivitas tidak disimpan');
    }
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: 'SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time FROM playlist_song_activities LEFT JOIN users ON users.id = playlist_song_activities.user_id LEFT JOIN songs ON songs.id = playlist_song_activities.song_id WHERE playlist_song_activities.playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}
