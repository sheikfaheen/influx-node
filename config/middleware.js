let cons = require('../config/constants');

exports.auth = function(req, res, next){
	//next();
	var authentication_key = req.headers[cons.auth.key];

	if(typeof authentication_key != 'undefined'){

		if(authentication_key == cons.auth.token){
			next();
		}else{
			res.send({"status":401,"message":"Error mismatch token"});
		}

	}else{
		res.send({"status":403,"message":"Missing token"});
	}
}