const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const app = express();

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

// routes
app.use('/', indexRoutes);

app.listen(app.get('port'), () =>{
    console.log(`server on port ${app.get('port')}`);
})


