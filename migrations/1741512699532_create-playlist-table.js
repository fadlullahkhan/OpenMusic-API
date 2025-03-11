/* eslint-disable camelcase */
export const up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('playlists');
};
