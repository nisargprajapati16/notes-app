# Notes App

A full-stack collaborative notes application built with **React**, **Vite**, **TypeScript**, **Material UI**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.

---

## 🚀 Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/nisargprajapati16/notes-app
cd notes-app
```

---

## ⚙️ Project Structure

```
notes-app/
  frontend/   # React + Vite client
  backend/    # Node.js + Express + MongoDB server
```

---

## 🖥️ Frontend Setup

### 1. **Install Dependencies**

```sh
cd frontend
npm install
```

### 2. **Configure Environment Variables**

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

Adjust the URLs if your backend runs elsewhere.

### 3. **Start the Development Server**

```sh
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### 4. **Running Frontend Tests**

```sh
npm test
```

### 5. **Build for Production**

```sh
npm run build
```

---

## 🖧 Backend Setup

### 1. **Install Dependencies**

```sh
cd backend
npm install
```

### 2. **Configure Environment Variables**

Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGO_URI="mongodb+srv://<username>:<password>@<cluster-url>/"
```

Replace `<username>`, `<password>`, and `<cluster-url>` with your MongoDB credentials.

### 3. **Start the Server**

```sh
npm run dev
```

The backend will run at [http://localhost:3000](http://localhost:3000) by default.

### 4. **Running Backend Tests**

```sh
npm test
```

### 5. **Build for Production**

```sh
npm run build
npm start
```

---

## 🧪 Environment Variables

### Frontend

| Variable         | Description                      |
|------------------|----------------------------------|
| VITE_API_URL     | Backend API base URL             |
| VITE_SOCKET_URL  | Socket.IO server URL             |

### Backend

| Variable   | Description                |
|------------|----------------------------|
| PORT       | Port for the server        |
| MONGO_URI  | MongoDB connection string  |

