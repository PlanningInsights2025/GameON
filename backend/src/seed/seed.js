const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Sport = require('../models/Sport');
const Discipline = require('../models/Discipline');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await Product.deleteMany();
    await Discipline.deleteMany();
    await Sport.deleteMany();
    await User.deleteMany();

    const sports = [
      { name: 'Gymnastics', disciplines: ['Artistic Gymnastics (Men)', 'Artistic Gymnastics (Women)', 'Rhythmic Gymnastics', 'Trampoline Gymnastics'] },
      { name: 'Athletics', disciplines: ['Track Events','Field Events','Road Events','Combined Events'] },
      { name: 'Aquatics', disciplines: ['Swimming','Diving','Artistic Swimming','Water Polo'] },
      { name: 'Badminton', disciplines: ['Singles','Doubles','Mixed Doubles'] },
      { name: 'Basketball', disciplines: ['5x5 Basketball'] },
      { name: 'Football', disciplines: ['Football (11-a-side)','Futsal','Beach Soccer'] },
      { name: 'Hockey', disciplines: ['Field Hockey'] },
      { name: 'Volleyball', disciplines: ['Indoor Volleyball','Beach Volleyball'] },
      { name: 'Tennis', disciplines: ['Singles','Doubles'] },
      { name: 'Table Tennis', disciplines: ['Singles','Doubles','Mixed Doubles'] },
      { name: 'Combat Sports', disciplines: ['Boxing','Judo','Taekwondo','Wrestling'] },
      { name: 'Weightlifting', disciplines: ['Snatch','Clean & Jerk'] },
      { name: 'Cycling', disciplines: ['Road Cycling','Track Cycling','Mountain Bike','BMX Racing','BMX Freestyle'] },
      { name: 'Skateboarding', disciplines: ['Street','Park'] },
      { name: 'Sport Climbing', disciplines: ['Speed','Bouldering','Lead'] },
      { name: 'Archery', disciplines: ['Recurve','Compound'] },
      { name: 'Winter Ice Hockey', disciplines: ['Men','Women'] },
      { name: 'Cricket', disciplines: [] }
    ];

    const createdSports = {};
    const createdDisciplines = [];

    for (const s of sports) {
      const sport = await Sport.create({ name: s.name });
      createdSports[s.name] = sport;
      for (const dName of s.disciplines) {
        const discipline = await Discipline.create({ name: dName, sport: sport._id });
        createdDisciplines.push({ name: dName, discipline, sport });
      }
    }

    // Sample products with ratings
    const productData = [
      // Gymnastics
      { name: 'Professional Balance Beam', description: 'Official competition balance beam', price: 15999, stock: 5, brand: 'Spieth Gymnastics', rating: 4.8 },
      { name: 'Gymnastic Rings Set', description: 'Olympic standard wooden rings', price: 8999, stock: 12, brand: 'Gibson Athletic', rating: 4.6 },
      { name: 'Rhythmic Gymnastics Ribbon', description: 'Competition grade ribbon', price: 1299, stock: 30, brand: 'Sasaki', rating: 4.5 },
      { name: 'Gymnastics Mat 4x8ft', description: 'High-density foam mat', price: 6999, stock: 8, brand: 'Tumbl Trak', rating: 4.7 },
      
      // Athletics
      { name: 'Carbon Fiber Javelin', description: 'Professional throwing javelin 800g', price: 12999, stock: 7, brand: 'Nordic Sport', rating: 4.9 },
      { name: 'Competition Running Spikes', description: 'Lightweight track spikes', price: 8499, stock: 20, brand: 'Nike', rating: 4.4 },
      { name: 'Shot Put 7.26kg', description: 'IAAF certified shot put', price: 4599, stock: 15, brand: 'Nelco', rating: 4.6 },
      { name: 'High Jump Landing Mat', description: 'Professional landing system', price: 45999, stock: 3, brand: 'UCS', rating: 4.8 },
      
      // Aquatics
      { name: 'Competition Swimsuit', description: 'FINA approved racing suit', price: 9999, stock: 25, brand: 'Speedo', rating: 4.7 },
      { name: 'Swimming Goggles Pro', description: 'Anti-fog racing goggles', price: 2499, stock: 50, brand: 'Arena', rating: 4.5 },
      { name: 'Training Fins', description: 'Silicone swimming fins', price: 3499, stock: 35, brand: 'TYR', rating: 4.3 },
      { name: 'Pull Buoy Set', description: 'Professional training aid', price: 1899, stock: 40, brand: 'Finis', rating: 4.4 },
      
      // Basketball
      { name: 'Official Basketball', description: 'FIBA approved game ball', price: 5999, stock: 30, brand: 'Molten', rating: 4.8, images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800', 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800'] },
      { name: 'Basketball Shoes High-Top', description: 'Professional court shoes', price: 12999, stock: 18, brand: 'Nike', rating: 4.6, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800'] },
      { name: 'Adjustable Basketball Hoop', description: 'Portable hoop system', price: 24999, stock: 5, brand: 'Spalding', rating: 4.5, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=800'] },
      
      // Football
      { name: 'Match Football Size 5', description: 'FIFA approved match ball', price: 4999, stock: 40, brand: 'Adidas', rating: 4.7 },
      { name: 'Football Cleats', description: 'Professional soccer boots', price: 10999, stock: 22, brand: 'Puma', rating: 4.5 },
      { name: 'Goalkeeper Gloves Pro', description: 'Latex palm goalkeeper gloves', price: 3499, stock: 28, brand: 'Reusch', rating: 4.6 },
      
      // Tennis
      { name: 'Professional Tennis Racket', description: 'Carbon fiber racket 300g', price: 18999, stock: 12, brand: 'Wilson', rating: 4.9 },
      { name: 'Tennis Ball Can (3 balls)', description: 'ITF approved tennis balls', price: 599, stock: 100, brand: 'Dunlop', rating: 4.4 },
      { name: 'Tennis Shoes Clay Court', description: 'Specialized clay court shoes', price: 8999, stock: 15, brand: 'Asics', rating: 4.6 },
      
      // Cycling
      { name: 'Road Bike Carbon Frame', description: 'Professional racing bike', price: 125999, stock: 4, brand: 'Trek', rating: 4.9 },
      { name: 'Cycling Helmet Aero', description: 'Aerodynamic racing helmet', price: 12999, stock: 20, brand: 'Giro', rating: 4.7 },
      { name: 'Cycling Shoes Clipless', description: 'Carbon sole cycling shoes', price: 15999, stock: 18, brand: 'Shimano', rating: 4.6 },
      
      // Weightlifting
      { name: 'Olympic Barbell 20kg', description: 'Competition grade barbell', price: 24999, stock: 10, brand: 'Eleiko', rating: 4.9 },
      { name: 'Bumper Plates Set', description: 'Rubber Olympic plates 140kg', price: 32999, stock: 8, brand: 'Rogue', rating: 4.8 },
      { name: 'Weightlifting Belt', description: 'Leather lifting belt', price: 4999, stock: 25, brand: 'Inzer', rating: 4.7 },
      
      // Combat Sports
      { name: 'Boxing Gloves 16oz', description: 'Professional training gloves', price: 6999, stock: 30, brand: 'Everlast', rating: 4.6 },
      { name: 'Judo Gi White', description: 'IJF approved judo uniform', price: 8999, stock: 20, brand: 'Mizuno', rating: 4.7 },
      { name: 'Taekwondo Sparring Gear', description: 'Complete protection set', price: 12999, stock: 15, brand: 'Adidas', rating: 4.5 },
      
      // Volleyball
      { name: 'Indoor Volleyball', description: 'FIVB approved game ball', price: 4999, stock: 35, brand: 'Mikasa', rating: 4.8 },
      { name: 'Volleyball Knee Pads', description: 'Professional protection pads', price: 1999, stock: 40, brand: 'Mizuno', rating: 4.4 },
      
      // Table Tennis
      { name: 'Professional Table Tennis Bat', description: 'Competition blade with rubber', price: 9999, stock: 20, brand: 'Butterfly', rating: 4.8 },
      { name: 'Table Tennis Balls 3-Star', description: 'ITTF approved balls (pack of 6)', price: 899, stock: 60, brand: 'DHS', rating: 4.5 },
      
      // Badminton
      { name: 'Carbon Badminton Racket', description: 'Professional racket 85g', price: 12999, stock: 18, brand: 'Yonex', rating: 4.8 },
      { name: 'Feather Shuttlecocks', description: 'Tournament grade (pack of 12)', price: 1899, stock: 50, brand: 'Li-Ning', rating: 4.6 },
      
      // Archery
      { name: 'Recurve Bow 70"', description: 'Olympic standard recurve bow', price: 35999, stock: 6, brand: 'Hoyt', rating: 4.9 },
      { name: 'Carbon Arrows Set of 12', description: 'Competition grade arrows', price: 8999, stock: 15, brand: 'Easton', rating: 4.7 },
      
      // Hockey
      { name: 'Field Hockey Stick Composite', description: 'Professional composite stick', price: 14999, stock: 12, brand: 'Grays', rating: 4.7 },
      { name: 'Hockey Ball Official', description: 'FIH approved match ball', price: 899, stock: 80, brand: 'Kookaburra', rating: 4.5 },
      
      // Cricket
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

    // Assign products to sports and disciplines
    const assignments = [
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

    for (const assignment of assignments) {
      const sport = createdSports[assignment.sport];
      const discipline = assignment.discipline ? createdDisciplines.find(d => d.name === assignment.discipline && d.sport._id.equals(sport._id)) : null;
      
      for (const productIndex of assignment.products) {
        const productInfo = productData[productIndex];
        await Product.create({
          ...productInfo,
          sport: sport._id,
          discipline: discipline ? discipline.discipline._id : undefined
        });
      }
    }

    // Create admin user
    await User.create({
      name: 'Admin',
      email: 'admin@gameon.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Seed completed with products and admin user!');
    console.log('Admin credentials: admin@gameon.com / admin123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
