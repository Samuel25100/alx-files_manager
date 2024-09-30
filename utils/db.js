import { MongoClient } from 'mongodb';

class DBClient {

	constructor() {
		this.host = process.env.DB_HOST || 'localhost';
		this.port = process.env.DB_PORT || 27017;
		this.database = process.env.DB_DATABASE || 'files_manager';
		const url = `mongodb://${this.host}:${this.port}/${this.database}`;
		this.client = new MongoClient(url, { useUnifiedTopology: true });
		this.ready = false;
		this.users = null;
		this.files = null;
		this.client.connect()
			.then(() => {
				this.db = this.client.db(this.database);
                        	this.users = this.db.collection('users');
                        	this.files = this.db.collection('files');
				this.ready = true;
			})
			.catch((err) => {
				this.ready = false;
				console.log(err);
			});
	}

	isAlive() {
		return Boolean(this.ready);
	}

	async nbUsers() {
		const count = await this.users.countDocuments();
		return count;
	}

	async nbFiles() {
                const count = await this.files.countDocuments();
                return count;
        }

	async usersCol() {
		return await this.client.db(this.database).collection('users');
	}
}

const dbClient = new DBClient();
export default dbClient;
