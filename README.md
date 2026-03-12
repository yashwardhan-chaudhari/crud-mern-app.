# Creator's Platform — Full-Stack Project

A complete full-stack application built across Lessons 3.4 – 3.9 of the Kalvium curriculum.

## 🗂 Project Structure

```
fullstack-project/
├── server/                     # Express backend
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Login + JWT generation
│   │   ├── postController.js   # Full CRUD with auth checks
│   │   └── userController.js   # Registration
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── errorHandler.js     # ⭐ Global error handler (4-param)
│   ├── models/
│   │   ├── Post.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js               # CORS config + route registration
│
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── ConnectionTest.jsx   # Lesson 3.4
│   │   │   │   ├── ProtectedRoute.jsx   # Lesson 3.5
│   │   │   │   └── PublicRoute.jsx
│   │   │   └── layout/
│   │   │       └── Header.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Lesson 3.5 — Global state
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Register.jsx             # Lesson 3.5
│   │   │   ├── Login.jsx                # Lesson 3.5
│   │   │   ├── Dashboard.jsx            # Lessons 3.7, 3.8, 3.9
│   │   │   ├── CreatePost.jsx           # Lesson 3.7
│   │   │   └── EditPost.jsx             # Lesson 3.8
│   │   ├── services/
│   │   │   └── api.js                   # Lesson 3.6 — Axios interceptors
│   │   ├── App.jsx                      # Routes + ToastContainer
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js                   # Lesson 3.4 — Proxy config
│
├── package.json                # Root — concurrent dev scripts
└── README.md
```

---

## 🚀 Setup Instructions

### 1. Clone & Install Dependencies

```bash
# Install root concurrently package
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Configure Environment Variables

**Server** — copy `.env.example` to `.env`:
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/creators-platform
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=generate-a-long-random-string-here
JWT_EXPIRE=7d
```

Generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Client** — copy `.env.example` to `.env`:
```bash
cd client
cp .env.example .env
```

### 3. Run Both Servers

```bash
# From project root
npm run dev
```

Or separately:
```bash
npm run server   # http://localhost:5000
npm run client   # http://localhost:5173
```

---

## 📚 Lessons Covered

| Lesson | Topic | Files |
|--------|-------|-------|
| 3.4 | CORS & Vite Proxy | `server.js`, `vite.config.js`, `ConnectionTest.jsx` |
| 3.5 | Registration, Login, JWT, Context API, Protected Routes | `AuthContext.jsx`, `ProtectedRoute.jsx`, `Login.jsx`, `Register.jsx` |
| 3.6 | Authenticated API Requests (Axios interceptors) | `services/api.js`, `middleware/auth.js` |
| 3.7 | CRUD Create + Read with Pagination | `postController.js`, `CreatePost.jsx`, `Dashboard.jsx` |
| 3.8 | CRUD Update + Delete with Authorization | `postController.js`, `EditPost.jsx`, `Dashboard.jsx` |
| 3.9 | Full-Stack Error Handling with Toasts | `errorHandler.js`, `App.jsx` (ToastContainer), all pages |

---

## 🔑 Key Patterns

### Backend Error Middleware (4 parameters — Lesson 3.9)
```js
// server/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};
app.use(errorHandler); // MUST be after all routes
```

### Triggering Errors with next(err)
```js
// In any route/controller:
if (!post) {
  const err = new Error('Post not found');
  err.status = 404;
  return next(err); // → errorHandler middleware
}
```

### Frontend Toast Notifications (Lesson 3.9)
```jsx
// In App.jsx root:
<ToastContainer position="bottom-right" autoClose={4000} />

// In any component:
import { toast } from 'react-toastify';

try {
  await api.delete(`/posts/${id}`);
  toast.success('Post deleted!');
} catch (error) {
  toast.error(error.response?.data?.message || 'Something went wrong');
}
```

### Authorization Check Pattern (Lesson 3.8)
```js
// In postController.js:
if (post.author.toString() !== req.user._id.toString()) {
  return next(createError('You don\'t have permission to delete this post', 403));
}
```

### Axios Interceptor (Lesson 3.6)
```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 🧪 Test Error Scenarios (for Assignment Video)

| Scenario | How to Trigger | Expected Toast |
|----------|---------------|----------------|
| 403 Forbidden | Delete a post via Postman with another user's token | "You don't have permission to delete this post" |
| 404 Not Found | Request `/api/posts/invalidid` | "Post not found" |
| 400 Bad Request | Create post with empty title | "Title is required" |
| 401 Unauthorized | Request `/api/posts` without token | "Not authorized. Please login." |

---

## 📝 Assignment PR Checklist

- [ ] `errorHandler.js` has 4 parameters `(err, req, res, next)`
- [ ] `app.use(errorHandler)` is after all routes in `server.js`
- [ ] `<ToastContainer>` is in root `App.jsx`
- [ ] All API calls are in `try-catch` blocks
- [ ] `toast.error()` is called in every `catch` block
- [ ] 403 Forbidden demo works (delete another user's post)
- [ ] Video shows error flowing: backend → middleware → API → frontend → toast
