const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./api/routes/productRoutes');
const userRoutes = require('./api/routes/userRoutes');

const port = 8000 ;
const app = express();

// 1) Configure mongoose
const db = "mongodb://127.0.0.1:27017/OnlineStore"; // OnlineStore: database name
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// 2) Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 3) Configure cors
app.use(cors());

// 4) Register routers
app.use('/products', productRoutes);
app.use('/users', userRoutes);

app.listen(process.env.PORT || port, () => {
  console.log(`Server started on port ${port}`);
});


// Run web app in terminal : npm start
