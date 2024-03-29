exports.up = (pgm) => {
  pgm.sql("INSERT INTO albums(id, name, year) VALUES ('old_songs', 'old_songs', '1990')");
  pgm.sql("UPDATE songs SET album_id = 'old_songs' WHERE album_id IS NULL");
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');

  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_playlists', 'old_playlists', 'old_playlists', 'old playlists')");
  pgm.sql("UPDATE playlists SET owner = 'old_playlists' WHERE owner IS NULL");
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');
  pgm.sql("UPDATE songs SET album_id = NULL WHERE album_id = 'old_songs'");
  pgm.sql("DELETE FROM albums WHERE id = 'old_songs'");

  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
  pgm.sql("UPDATE playlists SET owner = NULL WHERE owner = 'old_playlists'");
  pgm.sql("DELETE FROM users WHERE id = 'old_playlists'");
};
