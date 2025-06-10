# Notes App Backend

This is the **backend** for the Notes App, built with Node.js, Express, TypeScript, MongoDB, and Socket.IO.

---

## 🚀 Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/your-username/notes-app.git
cd notes-app/backend
```

### 2. **Install Dependencies**

```sh
npm install
```

### 3. **Configure Environment Variables**

Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGO_URI="mongodb+srv://<username>:<password>@<cluster-url>/"
```

Replace `<username>`, `<password>`, and `<cluster-url>` with your MongoDB credentials.

---

### 4. **Start the Server**

```sh
npm run dev
```

The backend will run at [http://localhost:3000](http://localhost:3000) by default.

---

## 🧪 Running Tests

```sh
npm test
```

---

## 📄 Environment Variables

| Variable   | Description                |
|------------|----------------------------|
| PORT       | Port for the server        |
| MONGO_URI  | MongoDB connection string  |

---

## 📦 Build for Production

```sh
npm run build
npm start
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📜 License

MIT