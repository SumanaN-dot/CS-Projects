const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const pool = require('./db.js');
require('dotenv').config();

const path = require('path');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const featuredBooksRoute = require('./routes/books/featured');
const newReleasesBooksRoute = require('./routes/books/newReleases')
const comingSoonBooksRoute = require('./routes/books/comingSoon.js')
const allBooksRoute = require('./routes/books/all');
const addBookRoute = require('./routes/books/addBook');
const usersRoute = require('./routes/users/register');
const searchRoute = require('./routes/books/search');
const loginRoute = require('./routes/users/login');
const logoutRoute = require('./routes/users/logout');
const checkAuth = require('./routes/users/check-auth');
const cartAddRoute = require('./routes/cart/add');
const cartCountRoute = require('./routes/cart/count');
const cartItemsRoute = require('./routes/cart/cartItems');
const cartDecreaseQuantityRoute = require('./routes/cart/decreaseQuantity');
const cartIncreaseQuantityRoute = require('./routes/cart/increaseQuantity');
const cartRemoveItemRoute = require('./routes/cart/removeItem');
const promotionsRoute = require('./routes/admin/promotions');
const activateRoute = require('./routes/users/activateUser.js');
const editProfileRoute = require('./routes/users/editProfile.js');
const bookDetailsRoute = require('./routes/books/bookDetails.js');
const ordersRoute = require('./routes/users/order.js');


app.use('/api/books/featured', featuredBooksRoute);
app.use('/api/books/newReleases', newReleasesBooksRoute);
app.use('/api/books/comingSoon', comingSoonBooksRoute);
app.use('/api/books/all', allBooksRoute);
app.use('/api/books', addBookRoute);
app.use('/api/users', usersRoute);
app.use('/api/books/search', searchRoute);
app.use('/api/users/login', loginRoute);
app.use('/api/users/logout', logoutRoute);
app.use('/api/users/check-auth', checkAuth);
app.use('/api/cart/add', cartAddRoute);
app.use('/api/cart/count', cartCountRoute);
app.use('/api/cart/cartItems', cartItemsRoute);
app.use('/api/cart/decreaseQuantity', cartDecreaseQuantityRoute);
app.use('/api/cart/increaseQuantity', cartIncreaseQuantityRoute);
app.use('/api/cart/removeItem', cartRemoveItemRoute);
app.use('/api/users/activate', activateRoute);
app.use('/api/users/editProfile', editProfileRoute);
app.use('/api/admin/promotions', promotionsRoute);
app.use('/api/books/bookDetails', bookDetailsRoute);
app.use('/api/users/order', ordersRoute);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Server startup
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

const initialPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
startServer(initialPort);
