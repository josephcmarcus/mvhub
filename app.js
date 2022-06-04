const path = require('path');
const express = require('express');

const rootRoutes = require('./routes/root');
const teachableRoutes = require('./routes/teachable');
const thrivecartRoutes = require('./routes/thrivecart');

const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

app.use('/teachable', teachableRoutes);
app.use('/thrivecart', thrivecartRoutes);
app.use('/', rootRoutes);

app.listen( PORT || 3000, () => console.log(`🚀 Server running on port 3000`));