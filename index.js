let http = require('http');
let express = require('express');

let app = express();

let morgan = require('morgan');

app.use(morgan('dev'));

let bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

/* User Routes */

var Users = require('./routes/userRoute');
var User_Controller = require('./controller/userController');
Users.setup(app, User_Controller);

/* Trip Routes */

var Trips = require('./routes/tripsRoute');
var Trips_Controller = require('./controller/tripsController');
Trips.setup(app, Trips_Controller);

app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});