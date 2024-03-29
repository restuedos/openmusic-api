class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async postAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.getAlbumById(albumId);
    const likes = await this._service.verifyAlbumLikes({ albumId, userId });
    if (likes) {
      await this._service.deleteAlbumLikes({ albumId, userId });
    } else {
      await this._service.addAlbumLikes({ albumId, userId });
    }

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dilike',
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();

    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    let album = await this._service.getAlbumById(id);
    const songs = await this._service.getSongsByAlbumId(id);
    album = ({
      id: album.id,
      name: album.name,
      year: album.year,
      coverUrl: album.cover ?? null,
      songs,
    });

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async getAlbumLikesHandler(request, h) {
    const { id } = request.params;
    const likes = await this._service.getAlbumLikes(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: likes.count,
      },
    }).header('X-Data-Source', likes.dataSource);
    response.code(200);
    return response;
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
