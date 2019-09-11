const path = require('path');
const exphbs = require('express-handlebars');

const morgan = require('morgan');
const multer = require('multer');
const express = require('express');

const errorHandler = require('errorhandler');

const routes = require('../routes/index');



module.exports = app =>{

// settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, '../views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),


  helpers: require('./helpers'),
  extname: '.hbs'
}));


app.set('view engine', '.hbs');

//middlewares


app.use(morgan('dev'));
app.use(multer({dest: path.join(__dirname, '../public/upload/temp')}).single('image'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//routes
routes(app);

app.use('/public', express.static(path.join(__dirname, '../public')));





//errorhandler
if('development' === app.get('env')){
  app.use(errorHandler);
}

return app;
}
