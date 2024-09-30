import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router.get('/status', (req, res) => {
	const re = AppController.getStatus();
	res.status(re.status).json(re.stat)
});

router.get('/stats', (req, res) => {
        const re = AppController.getStatus();
        res.status(re.status).json(re.stat);
});

router.post('/users', UsersController.postNew);

export default router;
