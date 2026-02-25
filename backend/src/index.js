const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const sportRoutes = require('./routes/sports');
const disciplineRoutes = require('./routes/disciplines');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const otpRoutes = require('./routes/otp');
const bannerRoutes = require('./routes/banners');
const reviewRoutes = require('./routes/reviews');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();
const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || 'https://gameon24.netlify.app,http://localhost:3000')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || corsOrigins.includes(origin)) {
			return callback(null, true);
		}
		return callback(new Error('CORS not allowed for this origin'));
	},
	credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

connectDB();

app.get('/', (req, res) => res.send('GameON API — Olympic Sports E-commerce'));

app.use('/api/auth', authRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/disciplines', disciplineRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
