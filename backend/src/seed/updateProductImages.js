require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');

const PRODUCT_IMAGES = {
  'Professional Balance Beam':    'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=600&q=80',
  'Gymnastic Rings Set':          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
  'Rhythmic Gymnastics Ribbon':   'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=600&q=80',
  'Gymnastics Mat 4x8ft':         'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=80',
  'Carbon Fiber Javelin':         'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=600&q=80',
  'Competition Running Spikes':   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'Shot Put 7.26kg':              'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80',
  'High Jump Landing Mat':        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
  'Competition Swimsuit':         'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
  'Swimming Goggles Pro':         'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80',
  'Training Fins':                'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80',
  'Pull Buoy Set':                'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80',
  'Official Basketball':          'https://images.unsplash.com/photo-1546519638405-a9f82048e9f8?w=600&q=80',
  'Basketball Shoes High-Top':    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'Adjustable Basketball Hoop':   'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=600&q=80',
  'Match Football Size 5':        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80',
  'Football Cleats':              'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&q=80',
  'Goalkeeper Gloves Pro':        'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80',
  'Professional Tennis Racket':   'https://images.unsplash.com/photo-1551773188-0801da12ddae?w=600&q=80',
  'Tennis Ball Can (3 balls)':    'https://images.unsplash.com/photo-1521075486433-bf4052bb37bc?w=600&q=80',
  'Tennis Shoes Clay Court':      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80',
  'Road Bike Carbon Frame':       'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80',
  'Cycling Helmet Aero':          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'Cycling Shoes Clipless':       'https://images.unsplash.com/photo-1517215002853-c2b51d50b8e6?w=600&q=80',
  'Olympic Barbell 20kg':         'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  'Bumper Plates Set':            'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=600&q=80',
  'Weightlifting Belt':           'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
  'Boxing Gloves 16oz':           'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&q=80',
  'Judo Gi White':                'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&q=80',
  'Taekwondo Sparring Gear':      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=600&q=80',
  'Indoor Volleyball':            'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80',
  'Volleyball Knee Pads':         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  'Professional Table Tennis Bat':'https://images.unsplash.com/photo-1611251135345-18c56206b863?w=600&q=80',
  'Table Tennis Balls 3-Star':    'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&q=80',
  'Carbon Badminton Racket':      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80',
  'Feather Shuttlecocks':         'https://images.unsplash.com/photo-1617083934555-ac7e4c1b3765?w=600&q=80',
  'Recurve Bow 70"':              'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=600&q=80',
  'Carbon Arrows Set of 12':      'https://images.unsplash.com/photo-1533514119692-b21bc5f4efb6?w=600&q=80',
  'Field Hockey Stick Composite': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=600&q=80',
  'Hockey Ball Official':         'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=600&q=80',
  'English Willow Cricket Bat':   'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80',
  'Kashmir Willow Cricket Bat':   'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80',
  'Cricket Ball Leather Red':     'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80',
  'Cricket Ball Leather White':   'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80',
  'Batting Gloves Professional':  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80',
  'Wicket Keeping Gloves':        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80',
  'Cricket Pads Leg Guards':      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80',
  'Cricket Helmet with Grill':    'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=600&q=80',
  'Cricket Thigh Guard':          'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80',
  'Cricket Abdominal Guard':      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80',
  'Cricket Stumps Set':           'https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?w=600&q=80',
  'Cricket Kit Bag':              'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80',
};

const FALLBACK = 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80';

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Fetching products...');

  const products = await Product.find({});
  console.log(`Found ${products.length} products. Updating images...`);

  let updated = 0;
  for (const p of products) {
    const url = PRODUCT_IMAGES[p.name] || FALLBACK;
    p.image = url;
    p.images = [url];
    await p.save();
    console.log(`  ✓ ${p.name}`);
    updated++;
  }

  console.log(`\nDone! Updated ${updated} products.`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
