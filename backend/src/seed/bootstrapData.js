const Sport = require('../models/Sport');
const Discipline = require('../models/Discipline');
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

const imageForProduct = (name) =>
  PRODUCT_IMAGES[name] || 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80';

const sportsConfig = [
  { name: 'Gymnastics', disciplines: ['Artistic Gymnastics (Men)', 'Artistic Gymnastics (Women)', 'Rhythmic Gymnastics', 'Trampoline Gymnastics'] },
  { name: 'Athletics', disciplines: ['Track Events', 'Field Events', 'Road Events', 'Combined Events'] },
  { name: 'Aquatics', disciplines: ['Swimming', 'Diving', 'Artistic Swimming', 'Water Polo'] },
  { name: 'Badminton', disciplines: ['Singles', 'Doubles', 'Mixed Doubles'] },
  { name: 'Basketball', disciplines: ['5x5 Basketball'] },
  { name: 'Football', disciplines: ['Football (11-a-side)', 'Futsal', 'Beach Soccer'] },
  { name: 'Hockey', disciplines: ['Field Hockey'] },
  { name: 'Volleyball', disciplines: ['Indoor Volleyball', 'Beach Volleyball'] },
  { name: 'Tennis', disciplines: ['Singles', 'Doubles'] },
  { name: 'Table Tennis', disciplines: ['Singles', 'Doubles', 'Mixed Doubles'] },
  { name: 'Combat Sports', disciplines: ['Boxing', 'Judo', 'Taekwondo', 'Wrestling'] },
  { name: 'Weightlifting', disciplines: ['Snatch', 'Clean & Jerk'] },
  { name: 'Cycling', disciplines: ['Road Cycling', 'Track Cycling', 'Mountain Bike', 'BMX Racing', 'BMX Freestyle'] },
  { name: 'Skateboarding', disciplines: ['Street', 'Park'] },
  { name: 'Sport Climbing', disciplines: ['Speed', 'Bouldering', 'Lead'] },
  { name: 'Archery', disciplines: ['Recurve', 'Compound'] },
  { name: 'Winter Ice Hockey', disciplines: ['Men', 'Women'] },
  { name: 'Cricket', disciplines: [] },
];

const productCatalog = [
  { name: 'Professional Balance Beam', description: 'Official competition balance beam', price: 15999, stock: 5, brand: 'Spieth Gymnastics', rating: 4.8 },
  { name: 'Gymnastic Rings Set', description: 'Olympic standard wooden rings', price: 8999, stock: 12, brand: 'Gibson Athletic', rating: 4.6 },
  { name: 'Rhythmic Gymnastics Ribbon', description: 'Competition grade ribbon', price: 1299, stock: 30, brand: 'Sasaki', rating: 4.5 },
  { name: 'Gymnastics Mat 4x8ft', description: 'High-density foam mat', price: 6999, stock: 8, brand: 'Tumbl Trak', rating: 4.7 },
  { name: 'Carbon Fiber Javelin', description: 'Professional throwing javelin 800g', price: 12999, stock: 7, brand: 'Nordic Sport', rating: 4.9 },
  { name: 'Competition Running Spikes', description: 'Lightweight track spikes', price: 8499, stock: 20, brand: 'Nike', rating: 4.4 },
  { name: 'Shot Put 7.26kg', description: 'IAAF certified shot put', price: 4599, stock: 15, brand: 'Nelco', rating: 4.6 },
  { name: 'High Jump Landing Mat', description: 'Professional landing system', price: 45999, stock: 3, brand: 'UCS', rating: 4.8 },
  { name: 'Competition Swimsuit', description: 'FINA approved racing suit', price: 9999, stock: 25, brand: 'Speedo', rating: 4.7 },
  { name: 'Swimming Goggles Pro', description: 'Anti-fog racing goggles', price: 2499, stock: 50, brand: 'Arena', rating: 4.5 },
  { name: 'Training Fins', description: 'Silicone swimming fins', price: 3499, stock: 35, brand: 'TYR', rating: 4.3 },
  { name: 'Pull Buoy Set', description: 'Professional training aid', price: 1899, stock: 40, brand: 'Finis', rating: 4.4 },
  { name: 'Official Basketball', description: 'FIBA approved game ball', price: 5999, stock: 30, brand: 'Molten', rating: 4.8 },
  { name: 'Basketball Shoes High-Top', description: 'Professional court shoes', price: 12999, stock: 18, brand: 'Nike', rating: 4.6 },
  { name: 'Adjustable Basketball Hoop', description: 'Portable hoop system', price: 24999, stock: 5, brand: 'Spalding', rating: 4.5 },
  { name: 'Match Football Size 5', description: 'FIFA approved match ball', price: 4999, stock: 40, brand: 'Adidas', rating: 4.7 },
  { name: 'Football Cleats', description: 'Professional soccer boots', price: 10999, stock: 22, brand: 'Puma', rating: 4.5 },
  { name: 'Goalkeeper Gloves Pro', description: 'Latex palm goalkeeper gloves', price: 3499, stock: 28, brand: 'Reusch', rating: 4.6 },
  { name: 'Professional Tennis Racket', description: 'Carbon fiber racket 300g', price: 18999, stock: 12, brand: 'Wilson', rating: 4.9 },
  { name: 'Tennis Ball Can (3 balls)', description: 'ITF approved tennis balls', price: 599, stock: 100, brand: 'Dunlop', rating: 4.4 },
  { name: 'Tennis Shoes Clay Court', description: 'Specialized clay court shoes', price: 8999, stock: 15, brand: 'Asics', rating: 4.6 },
  { name: 'Road Bike Carbon Frame', description: 'Professional racing bike', price: 125999, stock: 4, brand: 'Trek', rating: 4.9 },
  { name: 'Cycling Helmet Aero', description: 'Aerodynamic racing helmet', price: 12999, stock: 20, brand: 'Giro', rating: 4.7 },
  { name: 'Cycling Shoes Clipless', description: 'Carbon sole cycling shoes', price: 15999, stock: 18, brand: 'Shimano', rating: 4.6 },
  { name: 'Olympic Barbell 20kg', description: 'Competition grade barbell', price: 24999, stock: 10, brand: 'Eleiko', rating: 4.9 },
  { name: 'Bumper Plates Set', description: 'Rubber Olympic plates 140kg', price: 32999, stock: 8, brand: 'Rogue', rating: 4.8 },
  { name: 'Weightlifting Belt', description: 'Leather lifting belt', price: 4999, stock: 25, brand: 'Inzer', rating: 4.7 },
  { name: 'Boxing Gloves 16oz', description: 'Professional training gloves', price: 6999, stock: 30, brand: 'Everlast', rating: 4.6 },
  { name: 'Judo Gi White', description: 'IJF approved judo uniform', price: 8999, stock: 20, brand: 'Mizuno', rating: 4.7 },
  { name: 'Taekwondo Sparring Gear', description: 'Complete protection set', price: 12999, stock: 15, brand: 'Adidas', rating: 4.5 },
  { name: 'Indoor Volleyball', description: 'FIVB approved game ball', price: 4999, stock: 35, brand: 'Mikasa', rating: 4.8 },
  { name: 'Volleyball Knee Pads', description: 'Professional protection pads', price: 1999, stock: 40, brand: 'Mizuno', rating: 4.4 },
  { name: 'Professional Table Tennis Bat', description: 'Competition blade with rubber', price: 9999, stock: 20, brand: 'Butterfly', rating: 4.8 },
  { name: 'Table Tennis Balls 3-Star', description: 'ITTF approved balls (pack of 6)', price: 899, stock: 60, brand: 'DHS', rating: 4.5 },
  { name: 'Carbon Badminton Racket', description: 'Professional racket 85g', price: 12999, stock: 18, brand: 'Yonex', rating: 4.8 },
  { name: 'Feather Shuttlecocks', description: 'Tournament grade (pack of 12)', price: 1899, stock: 50, brand: 'Li-Ning', rating: 4.6 },
  { name: 'Recurve Bow 70"', description: 'Olympic standard recurve bow', price: 35999, stock: 6, brand: 'Hoyt', rating: 4.9 },
  { name: 'Carbon Arrows Set of 12', description: 'Competition grade arrows', price: 8999, stock: 15, brand: 'Easton', rating: 4.7 },
  { name: 'Field Hockey Stick Composite', description: 'Professional composite stick', price: 14999, stock: 12, brand: 'Grays', rating: 4.7 },
  { name: 'Hockey Ball Official', description: 'FIH approved match ball', price: 899, stock: 80, brand: 'Kookaburra', rating: 4.5 },
  { name: 'English Willow Cricket Bat', description: 'Professional grade cricket bat', price: 18999, stock: 15, brand: 'SS', rating: 4.8 },
  { name: 'Kashmir Willow Cricket Bat', description: 'Tournament quality bat', price: 8999, stock: 25, brand: 'MRF', rating: 4.6 },
  { name: 'Cricket Ball Leather Red', description: 'Match quality leather ball', price: 1299, stock: 60, brand: 'SG', rating: 4.7 },
  { name: 'Cricket Ball Leather White', description: 'Limited overs match ball', price: 1499, stock: 50, brand: 'Kookaburra', rating: 4.7 },
  { name: 'Batting Gloves Professional', description: 'Premium batting gloves', price: 3499, stock: 30, brand: 'Gray Nicolls', rating: 4.6 },
  { name: 'Wicket Keeping Gloves', description: 'Professional WK gloves', price: 4999, stock: 20, brand: 'SS', rating: 4.7 },
  { name: 'Cricket Pads Leg Guards', description: 'Batting leg protection', price: 5999, stock: 25, brand: 'MRF', rating: 4.5 },
  { name: 'Cricket Helmet with Grill', description: 'Safety helmet with face protection', price: 4999, stock: 22, brand: 'Masuri', rating: 4.8 },
  { name: 'Cricket Thigh Guard', description: 'Inner thigh protection', price: 1299, stock: 35, brand: 'SG', rating: 4.4 },
  { name: 'Cricket Abdominal Guard', description: 'Protective box', price: 899, stock: 40, brand: 'Gray Nicolls', rating: 4.3 },
  { name: 'Cricket Stumps Set', description: 'Complete stumps with bails', price: 2999, stock: 15, brand: 'SS', rating: 4.6 },
  { name: 'Cricket Kit Bag', description: 'Professional cricket bag', price: 3999, stock: 18, brand: 'MRF', rating: 4.5 },
];

const productAssignments = [
  { sport: 'Gymnastics', discipline: 'Artistic Gymnastics (Men)', products: [0, 1, 3] },
  { sport: 'Gymnastics', discipline: 'Rhythmic Gymnastics', products: [2] },
  { sport: 'Athletics', discipline: 'Field Events', products: [4, 6] },
  { sport: 'Athletics', discipline: 'Track Events', products: [5, 7] },
  { sport: 'Aquatics', discipline: 'Swimming', products: [8, 9, 10, 11] },
  { sport: 'Basketball', discipline: '5x5 Basketball', products: [12, 13, 14] },
  { sport: 'Football', discipline: 'Football (11-a-side)', products: [15, 16, 17] },
  { sport: 'Tennis', discipline: 'Singles', products: [18, 19, 20] },
  { sport: 'Cycling', discipline: 'Road Cycling', products: [21, 22, 23] },
  { sport: 'Weightlifting', discipline: 'Clean & Jerk', products: [24, 25, 26] },
  { sport: 'Combat Sports', discipline: 'Boxing', products: [27] },
  { sport: 'Combat Sports', discipline: 'Judo', products: [28] },
  { sport: 'Combat Sports', discipline: 'Taekwondo', products: [29] },
  { sport: 'Volleyball', discipline: 'Indoor Volleyball', products: [30, 31] },
  { sport: 'Table Tennis', discipline: 'Singles', products: [32, 33] },
  { sport: 'Badminton', discipline: 'Singles', products: [34, 35] },
  { sport: 'Archery', discipline: 'Recurve', products: [36, 37] },
  { sport: 'Hockey', discipline: 'Field Hockey', products: [38, 39] },
  { sport: 'Cricket', discipline: null, products: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51] },
];

const bootstrapDataIfEnabled = async () => {
  const enabled = String(process.env.BOOTSTRAP_DATA || '').toLowerCase() === 'true';
  if (!enabled) return;

  const sportsByName = {};
  const disciplinesByKey = {};

  for (const sportConfig of sportsConfig) {
    let sport = await Sport.findOne({ name: sportConfig.name });
    if (!sport) {
      sport = await Sport.create({ name: sportConfig.name });
    }
    sportsByName[sportConfig.name] = sport;

    for (const disciplineName of sportConfig.disciplines) {
      let discipline = await Discipline.findOne({ name: disciplineName, sport: sport._id });
      if (!discipline) {
        discipline = await Discipline.create({ name: disciplineName, sport: sport._id });
      }
      disciplinesByKey[`${sportConfig.name}::${disciplineName}`] = discipline;
    }
  }

  const productsToInsert = [];
  let productsUpdated = 0;
  for (const assignment of productAssignments) {
    const sport = sportsByName[assignment.sport];
    if (!sport) continue;

    const discipline = assignment.discipline
      ? disciplinesByKey[`${assignment.sport}::${assignment.discipline}`]
      : null;

    for (const index of assignment.products) {
      const baseProduct = productCatalog[index];
      if (!baseProduct) continue;
      const imgUrl = imageForProduct(baseProduct.name);
      const existing = await Product.findOne({ name: baseProduct.name });
      if (!existing) {
        productsToInsert.push({
          ...baseProduct,
          image: imgUrl,
          images: [imgUrl],
          sport: sport._id,
          discipline: discipline ? discipline._id : undefined,
        });
      } else {
        existing.sport = sport._id;
        existing.discipline = discipline ? discipline._id : undefined;
        existing.image = imgUrl;
        existing.images = [imgUrl];
        if (!existing.brand && baseProduct.brand) {
          existing.brand = baseProduct.brand;
        }
        if (!existing.rating && baseProduct.rating) {
          existing.rating = baseProduct.rating;
        }
        await existing.save();
        productsUpdated += 1;
      }
    }
  }

  if (productsToInsert.length > 0) {
    await Product.insertMany(productsToInsert);
  }

  console.log(
    `Bootstrap completed: ${productsToInsert.length} inserted, ${productsUpdated} updated across all categories`
  );
};

module.exports = { bootstrapDataIfEnabled };
