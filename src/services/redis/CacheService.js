const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      host: config.redis.host,
      legacyMode: true,
    });
    this._client.on('error', (error) => {
      console.error(error);
    });
    this._client.connect();
  }

  set(key, value, expirationInSecond = 1800) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, 'EX', expirationInSecond, (error, ok) => {
        if (error) {
          return reject(error);
        }
        return resolve(ok);
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this._client.get(key, (error, reply) => {
        if (error) {
          return reject(error);
        }
        if (reply === null) {
          return reject(new Error('Cache tidak ditemukan'));
        }
        return resolve(reply.toString());
      });
    });
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      this._client.del(key, (error, count) => {
        if (error) {
          return reject(error);
        }
        return resolve(count);
      });
    });
  }
}

module.exports = CacheService;
