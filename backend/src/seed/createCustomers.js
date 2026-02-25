const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Order = require('../models/Order');

dotenv.config();
connectDB();

const createCustomersAndUpdateOrders = async () => {
  try {
    console.log('Creating customer accounts...');

    const customers = [
      { name: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', password: 'customer123', role: 'user' },
      { name: 'Priya Sharma', email: 'priya.sharma@gmail.com', password: 'customer123', role: 'user' },
      { name: 'Amit Patel', email: 'amit.patel@gmail.com', password: 'customer123', role: 'user' },
      { name: 'Sneha Reddy', email: 'sneha.reddy@gmail.com', password: 'customer123', role: 'user' },
      { name: 'Vikram Singh', email: 'vikram.singh@gmail.com', password: 'customer123', role: 'user' },
      { name: 'Ananya Iyer', email: 'ananya.iyer@gmail.com', password: 'customer123', role: 'user' },
      { name: 'Rohit Verma', email: 'rohit.verma@gmail.com', password: 'customer123', role: 'user' },
      { name: 'Kavya Menon', email: 'kavya.menon@gmail.com', password: 'customer123', role: 'user' },
      { name: 'Arjun Malhotra', email: 'arjun.malhotra@gmail.com', password: 'customer123', role: 'user' },
      { name: 'Divya Nair', email: 'divya.nair@gmail.com', password: 'customer123', role: 'user' },
    ];

    // Create customers
    const createdCustomers = [];
    for (const customer of customers) {
      const existingUser = await User.findOne({ email: customer.email });
      if (!existingUser) {
        const newCustomer = await User.create(customer);
        createdCustomers.push(newCustomer);
        console.log(`✅ Created customer: ${customer.name}`);
      } else {
        createdCustomers.push(existingUser);
        console.log(`ℹ️ Customer already exists: ${customer.name}`);
      }
    }

    // Update orders to assign different customers
    const orders = await Order.find().sort({ createdAt: -1 });
    
    for (let i = 0; i < orders.length; i++) {
      const customerIndex = i % createdCustomers.length;
      orders[i].user = createdCustomers[customerIndex]._id;
      await orders[i].save();
    }

    console.log(`\n✅ Successfully created ${createdCustomers.length} customers!`);
    console.log(`✅ Updated ${orders.length} orders with customer assignments!`);
    console.log('\nCustomer Login Credentials (password for all: customer123):');
    customers.forEach(c => {
      console.log(`- ${c.name}: ${c.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createCustomersAndUpdateOrders();
