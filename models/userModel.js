let config = require('../config/db');
let cons = require('../config/constants');
let ObjectId = require('mongodb').ObjectID;
let mongoClient = config.mongo;

let Users = {

    api_getallusers: function (req, res) {
        mongoClient.connect(cons.mongo_url, { useNewUrlParser: true }, function (err, client) {
            var mongo = client.db(cons.dbname);
            if (err) {
                res.send(cons.failed(err));
            } else {
                var users = mongo.collection('users');
                users.find({}, { '_id': 1, 'name': 1, 'email': 1, 'mobile': 1 }).toArray(function (err, result) {
                    if (err) {
                        res.send(cons.failed(err));
                    } else {
                        res.send(cons.success(result));
                    }
                })
            }
        });
    },
    api_login: function (req, res) {
        if (req.body.email == "" || typeof (req.body.email) == 'undefined') {
            res.send(cons.failed({ "msg": "Please check the required fields!" }));
        } else {
            mongoClient.connect(cons.mongo_url, { useNewUrlParser: true }, function (err, client) {
                var mongo = client.db(cons.dbname);
                if (err) {
                    res.send(cons.failed(err));
                } else {
                    var users = mongo.collection('users');

                    users.find({ 'email': req.body.email },{'status':0}).toArray(function (err, result) {
                        if (result.length == 0) {
                            res.send(cons.failed({ "msg": "Invalid Login Credential","details":result }));
                        } else {
                            res.send(cons.success({ "msg": "Login Success","details":result }));
                        }
                    })

                }
            })
        }
    },
    api_indUser: function (req, res) {
        if (req.body.userid != "" || typeof (req.body.userid) == 'undefined') {
            res.send(cons.failed({ "msg": "Please check the required fields!" }));
        } else {
            mongoClient.connect(cons.mongo_url, { useNewUrlParser: true }, function (err, client) {
                var mongo = client.db(cons.dbname);
                if (err) {
                    res.send(cons.failed(err));
                } else {
                    var users = mongo.collection('users');
                    users.aggregate([{
                        $match:{"_id":ObjectId(req.body.userid)}
                    },{
                        $lookup:{
                            from:'trip_group',
                            localField:'_id',
                            foreignField:'created_by',
                            as:'trips'
                        }
                    }]).toArray(function(err,result){
                        if(err){
                            res.send(cons.failed(err));
                        }else{
                            res.send(cons.success(result));
                        }
                    })
                }
            })
        }
    }

}

module.exports = Users;
