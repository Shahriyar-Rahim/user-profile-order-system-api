Here’s a complete `README.md` you can copy directly:

````markdown
# User Profile & Order System API

A simple yet powerful API for managing **users** and their **orders**.  
It allows you to create users, manage orders assigned to them, dynamically calculate total amounts, and store creation timestamps for both users and orders in separate collections.

---

## 🚀 Live Demo
- **GitHub Repo:** [user-profile-order-system-api](https://github.com/Shahriyar-Rahim/user-profile-order-system-api)  
- **Vercel Deployment:** [Live API](https://user-profile-order-system-api.vercel.app/)

---

## 📌 Features
- **User Management**  
  - Create new users with `email` and `id` indexes.
  - Store creation timestamp for each user.
- **Order Management**  
  - Create orders linked to a user via `user_id`.
  - Dynamically calculate total amount of orders.
  - Store creation timestamp for each order.
- **Data Handling**  
  - Users and orders stored in **separate collections**.
  - Email and ID indexing for quick lookups.
  - Total amount calculation on order creation.

---

## 🛠️ Technologies Used
- **Backend:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **Environment Variables:** [dotenv](https://www.npmjs.com/package/dotenv)
- **CORS Handling:** [cors](https://www.npmjs.com/package/cors)
- **Development:** [nodemon](https://www.npmjs.com/package/nodemon)

### Dependencies
```json
"dependencies": {
  "cors": "^2.8.5",
  "dotenv": "^17.2.1",
  "express": "^5.1.0",
  "mongodb": "^6.18.0"
},
"devDependencies": {
  "nodemon": "^3.1.10"
}
````

---

## 📂 Project Structure

```
user-profile-order-system-api/
│
├── .env                # Environment variables (MongoDB URI, etc.)
├── index.js            # Main server file & API route handlers
├── package.json        # Dependencies & scripts
├── README.md           # Project description
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Shahriyar-Rahim/user-profile-order-system-api.git
cd user-profile-order-system-api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### 4️⃣ Run the Server

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

---

## 📚 API Endpoints

### **Users**

| Method | Endpoint     | Description               |
| ------ | ------------ | ------------------------- |
| POST   | `/users`     | Create a new user         |
| GET    | `/users`     | Get all users             |

### **Orders**

| Method | Endpoint      | Description                   |
| ------ | ------------- | ----------------------------- |
| POST   | `/orders`     | Create a new order for a user |
| GET    | `/orders`     | Get all orders                |
| GET    | `/orders/:userId` | Get a specific order by ID    |
| DELETE    | `/users/:id` | Delete a specific user by ID with their ordered data  |

---

## 📊 Example User Document

```json
{
  "_id": "64ef8cbb78d32b0012e56b21",
  "name": "John Doe",
  "email": "john@example.com",
  "address": {
    "city": "City",
    "country": "Country",
    "zip": "ZIP"
  }
  "created_at": "2025-08-09T14:25:00.000Z"
}
```

## 📊 Example Order Document

```json
{
  "_id": "64ef8d4478d32b0012e56b22",
  "user_id": "64ef8cbb78d32b0012e56b21",
  "items": [
    { "product": "Item A", "price": 20,},
    { "product": "Item B", "price": 15,}
  ],
  "total_amount": 55,
  "created_at": "2025-08-09T14:30:00.000Z"
}
```

---

## 📌 How It Works

1. **Create a user** → stored in `users` collection.
2. **Create an order** → stored in `orders` collection with `user_id`.
3. **Total amount** is calculated dynamically from `items` array before storing.
4. **Timestamps** are generated automatically for both users and orders.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

```

If you want, I can also add **a usage example with actual API requests (via cURL or Postman)** so people can try it instantly. That would make it more practical.
```
