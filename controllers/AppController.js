import dbClient from '../utils/db';
import redisClient from '../utils/redis';


class AppController {
	
	static getStatus(req, res) {
		const stats = {
			"redis": redisClient.isAlive(),
			"db": dbClient.isAlive(),
		};
		res.status(200).json(stats);
	}

	static async getStats(req, res) {
		const stat = {
			"users": await dbClient.nbUsers(),
			"files": await dbClient.nbFiles(),
		}
		res.status(200).json(stat);
	}
}
export default AppController;
