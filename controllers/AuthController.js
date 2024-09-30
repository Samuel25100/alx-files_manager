import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import sha1 from 'sha1';
import {v4 as uuidv4 } from 'uuid';


class AuthController {

	static async getConnect(req, res) {
		const base = req.headers["authorization"].split(" ")[1];
		const decod = Buffer.from(base, 'base64').toString('utf8');
		const email = decod.split(":")[0];
		const pwd = decod.split(":")[1];
		const data = {"email": email, "password": sha1(pwd)};
		const user = await dbClient.users.findOne(data);
		if (!user) {
			res.status(401).json({"error": "Unauthorized"});
			return;
		}
		const token = uuidv4().toString();
		const user_id = user._id.toString();
		await redisClient.set(`auth_${token}`, user_id, 86400);
		res.status(200).json({"token": token});
	}

	static async getDisconnect(req, res) {
		const token = req.headers['x-token'];
                const user_id = await redisClient.get(`auth_${token}`);
                if (!user_id) {
                        res.status(401).json({"error": "Unauthorized"});
                        return;
                }
		await redisClient.del(`auth_${token}`);
		res.status(204).send();
	}
}

export default AuthController;
