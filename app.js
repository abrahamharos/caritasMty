const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
const bodyparser = require('body-parser').json();

// connection to db
// importing routes
const indexRoutes = require('./routes/routeindex');
dotenv.config({ path: path.resolve(__dirname, '.env') });
// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'))

// middlewares
app.use(express.urlencoded({extended:false}));
app.use(bodyparser)
// routes
app.use('/', indexRoutes);

/* app.listen(app.get('port'), () =>{
    console.log(`server on port ${app.get('port')}`);
}) */


const {connectToDb} = require('./db/index');
const {port} = require('./config');

const start = async () => {
  try {
    console.info('Connecting to database');
    await connectToDb();
    console.info('Connected to database!');
    console.info('Starting server...');
    app.listen(port, () => {
      console.info(`🚀  Server running at port: ${port}`);
    });
  } catch (err) {
    console.error(err);
    console.error('Not able to run server');
  }
};

start();
