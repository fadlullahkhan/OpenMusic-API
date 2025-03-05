export const albumMapDBToModel = ({
  id,
  name,
  year,
  created_at,
  updated_at,
}) => ({ id, name, year, createdAt: created_at, updatedAt: updated_at });

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
