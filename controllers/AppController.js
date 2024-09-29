import dbClient from '../utils/db';
import redisClient from '../utils/redis';


class AppController {
	
	static getStatus() {
		const stats = {
			"redis": redisClient.isAlive(),
			"db": dbClient.isAlive(),
		};
		return {"stat": stats, "status": 200};
	}

	static async getStats() {
		const stat = {
			"users": await dbClient.nbUsers(),
			"files": await dbClient.nbFiles(),
		}
		return {"stat": stat, "status": 200};
	}
}
export default AppController;
