import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import sha1 from 'sha1';

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
}
export default UsersController;
