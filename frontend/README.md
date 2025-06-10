# Notes App Frontend

This is the **frontend** for the Notes App, built with React, Vite, TypeScript, Material UI, and Socket.IO.

---

## 🚀 Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/your-username/notes-app.git
cd notes-app/frontend
```

### 2. **Install Dependencies**

```sh
npm install
```

### 3. **Configure Environment Variables**

Create a `.env` file in the `frontend` directory (if not present):

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

Adjust the URLs if your backend runs elsewhere.

### 4. **Start the Development Server**

```sh
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

---

## 🧪 Running Tests

```sh
npm test
```

---

## 🌓 Theming

- Supports **light/dark mode**.  
- Use the theme toggle button in the UI to switch modes.

---

## 📦 Build for Production

```sh
npm run build
```

---

## 📄 Environment Variables

| Variable         | Description                      |
|------------------|----------------------------------|
| VITE_API_URL     | Backend API base URL             |
| VITE_SOCKET_URL  | Socket.IO server URL             |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📜 License

MIT