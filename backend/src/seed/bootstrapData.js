const Sport = require('../models/Sport');
const Product = require('../models/Product');

const bootstrapProducts = [
  {
    name: 'Training Football Size 5',
    description: 'Durable training football for daily practice',
    price: 1499,
    stock: 40,
    brand: 'GameON',
    rating: 4.4,
    images: ['https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800'],
  },
  {
    name: 'All-Court Basketball',
    description: 'Indoor and outdoor basketball with deep grip channels',
    price: 1799,
    stock: 35,
    brand: 'GameON',
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'],
  },
  {
    name: 'Pro Tennis Racket',
    description: 'Lightweight graphite racket for match performance',
    price: 6999,
    stock: 15,
    brand: 'GameON',
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800'],
  },
  {
    name: 'Competition Badminton Set',
    description: '2 rackets with 6 feather shuttles',
    price: 2499,
    stock: 28,
    brand: 'GameON',
    rating: 4.3,
    images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'],
  },
  {
    name: 'Olympic Weight Plate Pair',
    description: 'Rubber-coated 10kg plates (pair)',
    price: 3999,
    stock: 18,
    brand: 'GameON',
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'],
  },
];

const bootstrapDataIfEnabled = async () => {
  const enabled = String(process.env.BOOTSTRAP_DATA || '').toLowerCase() === 'true';
  if (!enabled) return;

  const existingProducts = await Product.countDocuments();
  if (existingProducts > 0) {
    console.log('Bootstrap skipped: products already exist');
    return;
  }

  let defaultSport = await Sport.findOne({ name: 'General Sports' });
  if (!defaultSport) {
    defaultSport = await Sport.create({ name: 'General Sports' });
  }

  const payload = bootstrapProducts.map((product) => ({
    ...product,
    sport: defaultSport._id,
  }));

  await Product.insertMany(payload);
  console.log(`Bootstrap completed: ${payload.length} products inserted`);
};

module.exports = { bootstrapDataIfEnabled };
