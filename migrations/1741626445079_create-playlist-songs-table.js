/* eslint-disable camelcase */
export const up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: 'playlists(id)',
      onDelete: 'CASCADE',
    },
    song_id: {
      type: 'VARCHAR(50)',
      references: 'songs(id)',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
