import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

router.get('/status', (req, res) => {
	const re = AppController.getStatus();
	res.status(re.status).json(re.stat)
});

router.get('/stats', (req, res) => {
        const re = AppController.getStatus();
        res.status(re.status).json(re.stat);
});

export default router;
