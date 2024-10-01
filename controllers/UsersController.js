import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import sha1 from 'sha1';
import { ObjectId } from 'mongodb';

class UsersController {

	static async postNew(req, res) {
		const body = req.body;
		if (!body || !body.email) {
			res.status(400).json({"error": "Missing email"});
			return;
		}
		if (!body.password) {
			res.status(400).json({"error": "Missing password"});
			return;
		}
		const user = await (await (dbClient.users)
				    .findOne({"email": body.email}));
		if (user) {
			res.status(400).json({"error": "Already exist"});
			return;
		}
		const data = {"email": body.email,
			      "password": sha1(body.password)};
		const re = await (await dbClient.users).insertOne(data);
		const final = {"_id": re.insertedId.toString(), ...data};
		res.status(201).json(final);
		return;
	}

	static async getMe(req, res) {
		const token = req.headers['x-token'];
		const user_id = await redisClient.get(`auth_${token}`);
		const user = await dbClient.users
			.findOne({"_id": ObjectId(user_id)});
		if (!user || !user_id) {
                        res.status(401).json({"error": "Unauthorized"});
                        return;
                }
		const final = {"id": user._id,
				"email": user.email};
		res.status(201).json(final);
	}
}
export default UsersController;
