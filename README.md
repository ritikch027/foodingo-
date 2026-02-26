# Foodingo Backend API

Backend for a food delivery platform built with Node.js, Express, MongoDB (Mongoose), JWT authentication, Cloudinary, and Razorpay.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (auth) + bcrypt (password hashing)
- Cloudinary (image hosting)
- Razorpay (payments)
- Helmet, CORS, compression, rate limiting

## Project Layout

```
.
|- index.js
|- db.js
|- controllers/
|  |- admin/
|  |- customer/
|  `- owner/
|- middleware/
|- models/
`- routes/
   |- admin/
   |- customer/
   `- owner/
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- MongoDB connection string (Atlas or local)

### Install

```bash
npm install
```

### Environment Variables

Create `.env` (do not commit it; it's already in `.gitignore`):

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

Notes:
- Use `KEY=value` with no extra spaces around `=`.
- If you ever committed real secrets, rotate them immediately.

### Run

Development (nodemon):

```bash
npm run dev
```

The API listens on `http://localhost:<PORT>` (default `3000`).

Health check:

```
GET /health
```

## Auth

Protected endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

## API Overview

Base path: routes are mounted under `/api` (for example `/api/register`).

### Public

```
GET    /api/categories
GET    /api/offers
GET    /api/restaurants
GET    /api/items/search
GET    /api/items/category/:categoryName
GET    /api/items/restaurant/:restaurantId
GET    /api/items/:itemId
```

### Customer (Auth Required)

```
POST   /api/register
POST   /api/login-user
GET    /api/userdata
PUT    /api/update-profile

GET    /api/cart
POST   /api/cart/add
POST   /api/cart/increment
POST   /api/cart/decrement
POST   /api/cart/bulk-add

POST   /api/orders/create
GET    /api/orders/my

POST   /api/payments/razorpay/order
POST   /api/payments/razorpay/verify
```

### Owner (Auth Required)

```
POST   /api/restaurants
PATCH  /api/restaurants/:restaurantId

POST   /api/items/:restaurantId
PATCH  /api/items/:restaurantId/:productId
DELETE /api/items/:restaurantId/:productId

GET    /api/restaurant/orders
PATCH  /api/orders/:id/status
```

### Admin (Auth Required)

```
GET    /api/admin
GET    /api/admin/users
PATCH  /api/admin/users/:userId/ban
PATCH  /api/admin/users/:userId/role
GET    /api/admin/restaurants
DELETE /api/admin/restaurants/:restaurantId

POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id

POST   /api/offers
PATCH  /api/offers/:id
DELETE /api/offers/:id

GET    /api/users
GET    /api/all-users
DELETE /api/delete/:userId
```

## Runtime Notes

<<<<<<< HEAD
- CORS is currently locked to `http://localhost:3000` in `index.js`; update it for your frontend domain.
- An API rate limiter is applied to `/api/*`.
=======
## 🧠 Performance Optimizations

* MongoDB indexes on all high-traffic collections
* Atomic cart updates
* Connection pooling
* Gzip compression
* Lean queries
* Role-based authorization via JWT
* Optimized payload sizes

---

## 🛡 Security

* Password hashing with bcrypt
* JWT token expiration
* Rate limiting on APIs
* Helmet security headers
* Request size limits
* Role-based access
* Admin-only protected routes

---

## 📈 Scalability

This backend is built to scale to:

* A large number of users
* Lots of cart operations
* High traffic browsing
* Cloud deployment (Render)

---

## 🧑‍💻 Author

Built by **Ritik Chauhan**
Designed for real-world food delivery platforms.

---

## ⭐ Final Notes

This backend is production-ready and follows modern backend engineering standards.

If you're building a food delivery app, this gives you:

* Speed
* Security
* Stability
* Clean architecture

---
>>>>>>> a58eeea81a00071325cd12e98364f0f445eddc12
