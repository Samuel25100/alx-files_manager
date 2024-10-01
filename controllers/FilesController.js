import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import {existsSync, mkdirSync, writeFile} from 'fs';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

export default class FilesController {

	static async postUpload(req, res) {
		const token = req.headers['x-token'];
		const userId = await redisClient.get(`auth_${token}`);
		if (!userId) {
			res.status(401).json({"error": "Unauthorized"});
                        return;
		}
		const body = req.body;
		const name = body.name;
		if (!name) {
			res.status(400).json({"error": "Missing name"});
			return;
		}
		const type = body.type;
                if (!type) {
                        res.status(400).json({"error": "Missing type"});
                        return;
                }
		const data = body.data;
		if (!data && type != "folder") {
			res.status(400).json({"error": "Missing data"});
                        return;
		}

		if (body.parentId) {
			const parent = await (await dbClient.files)
					.findOne({"parentId": parentId});
			if (!parent) {
				res.status(400)
					.json({"error": "Parent not found"});
                        	return;
			}
			if (parent.type != "folder") {
				res.status(400)
                                        .json({"error": "Parent is not a folder"});
                                return;
			}
		}
		const dirPath = process.FOLDER_PATH || "/tmp/files_manager";
                const filePath = join(dirPath, `${uuidv4()}`);
		if (!existsSync(dirPath)) {
			mkdirSync(dirPath, {recursive: true});
		}
		if (data) {
			const dec = Buffer.from(data, 'base64').toString('utf8');
			writeFile(filePath, dec, (err) => {
				if (err) {
				  console.error("Writing data failed", filepath);
				}
			});
		}
		const final = {
			"userID": ObjectId(userId),
			"name": name,
			"type": type,
			"parentId": body.parentId || 0,
			"isPublic": body.isPublic || false,
			"data": data,
		};
		if (type != "folder") {
			final["localPath"] = filePath;
		}
		const result = await (await dbClient.files).insertOne(final);
		res.status(201).json({
			"id": result.insertedId.toString(),
			"userID": userId,
			"name": name,
			"type": type,
			"isPublic": final["isPublic"],
			"parentId": final["parentId"]
		});
	}
}
