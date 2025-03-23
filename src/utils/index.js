/* eslint-disable camelcase */
export const albumMapDBToModel = ({
  id,
  name,
  year,
  created_at,
  updated_at,
  cover_url,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
  coverUrl: cover_url,
});

export const songMapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  created_at,
  updated_at,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  createdAt: created_at,
  updatedAt: updated_at,
  duration,
  albumId: album_id,
});
