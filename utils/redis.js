import { createClient } from 'redis';

class RedisClient {
	constructor() {
		this.client = createClient();
		this.ready = true;
		this.client.on('error', (err) => {
			this.ready = false;
			console.log(err);
		});
		this.client.on('ready', () => {
			this.ready = true;
            	});
	}

	isAlive() {
		return this.ready;
	}

	async get(key) {
		const val = new Promise((resolve, reject) => {
			this.client.GET(key, (err, result) => {
				if (!err) {
					resolve(result);
				}
			});
		});
		return val ? val : null;
	}

	async set(key, val, exp) {
		new Promise((resolve, reject) => {
                        this.client.SETEX(key, exp, val, (err) => {
                                if (!err) {
                                        resolve();
                                }
                        });
                });
	}

	async del(key) {
		await this.client.del(key);
	}
}
const redisClient = new RedisClient();
export default redisClient;
