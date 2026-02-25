const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();
connectDB();

const createTestOrders = async () => {
  try {
    console.log('Creating test orders...');

    // Get admin user and some products
    const admin = await User.findOne({ email: 'admin@gameon.com' });
    const products = await Product.find().limit(10);

    if (!admin || products.length === 0) {
      console.log('Please run seed.js first to create admin user and products');
      process.exit(1);
    }

    // Create 15 test orders with different statuses
    const testOrders = [
      {
        user: admin._id,
        products: [
          { product: products[0]._id, qty: 2, price: products[0].price },
          { product: products[1]._id, qty: 1, price: products[1].price }
        ],
        total: (products[0].price * 2) + products[1].price,
        status: 'delivered',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      },
      {
        user: admin._id,
        products: [
          { product: products[2]._id, qty: 1, price: products[2].price },
          { product: products[3]._id, qty: 3, price: products[3].price }
        ],
        total: products[2].price + (products[3].price * 3),
        status: 'delivered',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
      },
      {
        user: admin._id,
        products: [
          { product: products[4]._id, qty: 2, price: products[4].price }
        ],
        total: products[4].price * 2,
        status: 'shipped',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        user: admin._id,
        products: [
          { product: products[5]._id, qty: 1, price: products[5].price },
          { product: products[6]._id, qty: 1, price: products[6].price }
        ],
        total: products[5].price + products[6].price,
        status: 'shipped',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        user: admin._id,
        products: [
          { product: products[7]._id, qty: 4, price: products[7].price }
        ],
        total: products[7].price * 4,
        status: 'processing',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        user: admin._id,
        products: [
          { product: products[8]._id, qty: 1, price: products[8].price }
        ],
        total: products[8].price,
        status: 'processing',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      },
      {
        user: admin._id,
        products: [
          { product: products[0]._id, qty: 1, price: products[0].price },
          { product: products[2]._id, qty: 1, price: products[2].price },
          { product: products[4]._id, qty: 1, price: products[4].price }
        ],
        total: products[0].price + products[2].price + products[4].price,
        status: 'pending',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        user: admin._id,
        products: [
          { product: products[1]._id, qty: 5, price: products[1].price }
        ],
        total: products[1].price * 5,
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      },
      {
        user: admin._id,
        products: [
          { product: products[3]._id, qty: 2, price: products[3].price }
        ],
        total: products[3].price * 2,
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      {
        user: admin._id,
        products: [
          { product: products[5]._id, qty: 3, price: products[5].price }
        ],
        total: products[5].price * 3,
        status: 'delivered',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      },
      {
        user: admin._id,
        products: [
          { product: products[6]._id, qty: 1, price: products[6].price },
          { product: products[7]._id, qty: 2, price: products[7].price }
        ],
        total: products[6].price + (products[7].price * 2),
        status: 'delivered',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) // 12 days ago
      },
      {
        user: admin._id,
        products: [
          { product: products[8]._id, qty: 2, price: products[8].price }
        ],
        total: products[8].price * 2,
        status: 'cancelled',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        user: admin._id,
        products: [
          { product: products[9]._id, qty: 1, price: products[9].price }
        ],
        total: products[9].price,
        status: 'delivered',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) // 20 days ago
      },
      {
        user: admin._id,
        products: [
          { product: products[0]._id, qty: 3, price: products[0].price },
          { product: products[1]._id, qty: 2, price: products[1].price }
        ],
        total: (products[0].price * 3) + (products[1].price * 2),
        status: 'delivered',
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000) // 18 days ago
      },
      {
        user: admin._id,
        products: [
          { product: products[2]._id, qty: 1, price: products[2].price }
        ],
        total: products[2].price,
        status: 'processing',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
      }
    ];

    // Insert all orders
    await Order.insertMany(testOrders);

    console.log(`✅ Successfully created ${testOrders.length} test orders!`);
    console.log('\nOrder Statistics:');
    console.log(`- Delivered: ${testOrders.filter(o => o.status === 'delivered').length}`);
    console.log(`- Shipped: ${testOrders.filter(o => o.status === 'shipped').length}`);
    console.log(`- Processing: ${testOrders.filter(o => o.status === 'processing').length}`);
    console.log(`- Pending: ${testOrders.filter(o => o.status === 'pending').length}`);
    console.log(`- Cancelled: ${testOrders.filter(o => o.status === 'cancelled').length}`);
    
    const totalRevenue = testOrders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0);
    console.log(`\nTotal Revenue from delivered orders: ₹${totalRevenue.toLocaleString()}`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating test orders:', error);
    process.exit(1);
  }
};

createTestOrders();
