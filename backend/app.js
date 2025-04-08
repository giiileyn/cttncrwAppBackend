require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const products = require('./routes/product');
// const userRoutes = require('./routes/userRoutes');
const authentication = require('./routes/authentication');
const order = require('./routes/order')

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());


// app.use('/api/v1', userRoutes);
app.use('/api/v1', products);
app.use('/api/v1', authentication);
app.use('/api/v1', order);

module.exports = app;