let middleware = require('../config/middleware');

exports.setup = function(app,controllers){
    app.post('/api/addtrip',middleware.auth,controllers.api_addtrip);
    app.post('/api/addmem',middleware.auth,controllers.api_addmem);
    app.post('/api/addamount',middleware.auth,controllers.api_addamount);
    app.post('/api/spliton',middleware.auth,controllers.api_spliton);    
}