import express from 'express';
import routerIN from './routes/index';

const app = express();
const port = process.PORT || 5000;
app.use(express.json());
app.use('/', routerIN);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
