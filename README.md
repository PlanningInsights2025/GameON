# GameON — Olympic Sports Equipment E-Commerce Platform

A complete, production-ready full-stack e-commerce platform for Olympic sports equipment with discipline-level subcategories.

## 🏅 Tech Stack

**Frontend:**
- React.js (Vite)
- React Router
- Context API (Auth + Cart)
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Role-based access control

## 📁 Project Structure

```
GameON/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & error handling
│   │   ├── seed/            # Olympic sports seed data
│   │   └── index.js         # Server entry
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── admin/           # Admin panel pages
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth & Cart context
│   │   ├── pages/           # User pages
│   │   ├── services/        # API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` with your configuration:**
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/gameon
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

5. **Seed Olympic sports and disciplines:**
   ```bash
   npm run seed
   ```

6. **Start backend server:**
   ```bash
   npm run dev
   ```

   Server runs at: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend runs at: `http://localhost:3000`

## 🎯 Features

### User Features
- Browse Olympic sports and disciplines
- Filter products by sport, discipline, brand, price
- Product detail pages
- Shopping cart with quantity management
- User registration and login
- Protected checkout
- Order history

### Admin Features
- Secure admin-only dashboard
- Full CRUD for:
  - Sports
  - Disciplines (linked to sports)
  - Products (mapped to sport + discipline)
  - Users
  - Orders
- Order status management
- Protected admin routes

## 🏆 Olympic Sports Data

The platform includes official Olympic sports with discipline-level subcategories:

- **Gymnastics:** Artistic (Men/Women), Rhythmic, Trampoline
- **Athletics:** Track, Field, Road, Combined Events
- **Aquatics:** Swimming, Diving, Artistic Swimming, Water Polo
- **Badminton:** Singles, Doubles, Mixed Doubles
- **Basketball:** 5x5, 3x3
- **Football:** 11-a-side, Futsal, Beach Soccer
- **Hockey:** Field Hockey
- **Volleyball:** Indoor, Beach
- **Tennis:** Singles, Doubles
- **Table Tennis:** Singles, Doubles, Mixed Doubles
- **Combat Sports:** Boxing, Judo, Taekwondo, Wrestling
- **Weightlifting:** Snatch, Clean & Jerk
- **Cycling:** Road, Track, Mountain Bike, BMX Racing, BMX Freestyle
- **Skateboarding:** Street, Park
- **Sport Climbing:** Speed, Bouldering, Lead
- **Archery:** Recurve, Compound
- **Winter Ice Hockey:** Men, Women

## 🔐 Default Admin Setup

To create an admin user, register via the frontend, then update the user's role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@gameon.com" },
  { $set: { role: "admin" } }
)
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Sports (public read, admin write)
- `GET /api/sports` - List all sports
- `GET /api/sports/:id` - Get sport by ID
- `POST /api/sports` - Create sport (admin)
- `PUT /api/sports/:id` - Update sport (admin)
- `DELETE /api/sports/:id` - Delete sport (admin)

### Disciplines (public read, admin write)
- `GET /api/disciplines?sport=<sportId>` - List disciplines (optionally by sport)
- `POST /api/disciplines` - Create discipline (admin)
- `PUT /api/disciplines/:id` - Update discipline (admin)
- `DELETE /api/disciplines/:id` - Delete discipline (admin)

### Products (public read, admin write)
- `GET /api/products?sport=&discipline=&brand=&minPrice=&maxPrice=&q=` - List/filter products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders (authenticated)
- `POST /api/orders` - Create order (user)
- `GET /api/orders` - List user orders (user) or all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

## 🧪 Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📝 Environment Variables

**Backend (.env):**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gameon
JWT_SECRET=your_jwt_secret_here
```

**Frontend:**
Proxy configured in `vite.config.js` to forward `/api` to `http://localhost:5000`

For production (e.g., Render Static Site), set:
```
VITE_API_BASE_URL=https://<your-backend-service>.onrender.com/api
```

## 🚀 Deploy on Render

### 1) Deploy Backend (Web Service)

1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect your GitHub repo and select this project.
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables:
   - `PORT=5000`
   - `MONGO_URI=<your-mongodb-atlas-uri>`
   - `JWT_SECRET=<your-strong-secret>`
5. Deploy and copy the backend URL (example: `https://gameon-api.onrender.com`).

### 2) Deploy Frontend (Static Site)

1. In Render Dashboard, click **New +** → **Static Site**.
2. Select the same GitHub repo.
3. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add environment variable:
   - `VITE_API_BASE_URL=https://<your-backend-service>.onrender.com/api`
5. Deploy.

### 3) Verify

- Open frontend URL and register/login.
- Confirm API calls succeed in browser Network tab.
- If login/register fails, verify `VITE_API_BASE_URL` points to your backend `/api` route.

## 🛠️ Development

- Backend uses `nodemon` for auto-reload
- Frontend uses Vite HMR for instant updates
- Clean MVC architecture
- Modular and scalable codebase

## 📄 License

MIT License - Free to use for personal and commercial projects.

---

**Built with ❤️ for Olympic Sports Enthusiasts**
