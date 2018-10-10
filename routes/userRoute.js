let middleware = require('../config/middleware');

exports.setup = function(app, controllers){    
    app.get('/api/users',middleware.auth,controllers.api_getallusers);
    app.post('/api/login',middleware.auth,controllers.api_login);
    app.post('/api/induser',middleware.auth,controllers.api_indUser);
}