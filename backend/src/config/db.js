const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (typeof mongoUri === 'string') {
      mongoUri = mongoUri.trim();

      if (mongoUri.startsWith('MONGO_URI=')) {
        mongoUri = mongoUri.slice('MONGO_URI='.length).trim();
      }

      if (
        (mongoUri.startsWith('"') && mongoUri.endsWith('"')) ||
        (mongoUri.startsWith("'") && mongoUri.endsWith("'"))
      ) {
        mongoUri = mongoUri.slice(1, -1).trim();
      }
    }

    if (!mongoUri || typeof mongoUri !== 'string') {
      throw new Error('MONGO_URI is not set. Add MONGO_URI in environment variables before starting the server.');
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
