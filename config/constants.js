let constant = {

    'base_url' : 'http://localhost:3000',
    'mongo_url': 'mongodb://faheen12:Computerxp12@ds245150.mlab.com:45150/trip_management',
    'dbname'   : 'trip_management',
    'auth' 	   : {key:'api-key',token:'influx'},
    'success'  : function(msg){
        return {metadata:{"status":200,"message":"success"}, response:msg }
    },
    'failed'  : function(msg){
        return {metadata:{"status":500,"message":"failed"}, response:msg }
    }

} 

module.exports = constant;