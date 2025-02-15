export const up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'UUID',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    duration: {
      type: 'INT',
    },
    albumId: {
      type: 'VARCHAR(50)',
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('songs');
};
