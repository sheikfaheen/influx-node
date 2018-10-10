let config = require('../config/db');
let cons = require('../config/constants');
let ObjectId = require('mongodb').ObjectID;
var async = require('async');
let mongoClient = config.mongo;

let Trips = {
    api_addtrip: function (req, res) {
        if (req.body.userid == "" || typeof (req.body.userid) == 'undefined' || req.body.tripname == "" || typeof (req.body.tripname) == 'undefined' || req.body.budget == "" || typeof (req.body.budget) == 'undefined') {
            res.send(cons.failed({ "msg": "Please check the required fields!" }));
        } else {
            mongoClient.connect(cons.mongo_url, { useNewUrlParser: true }, function (err, client) {
                var mongo = client.db(cons.dbname);
                if (err) {
                    res.send(cons.failed(err));
                } else {
                    let trip_group = mongo.collection('trip_group');
                    let trip_user_mapping = mongo.collection('trip_user_mapping ');
                    async.parallel([
                        function (callback) {
                            trip_group.find({ 'created_by': ObjectId(req.body.userid), 'tripname': req.body.tripname }).toArray(callback,function (err, result) {
                                callback(err,result);
                            });
                        },
                        function (arg, callback) {
                            if (arg.length == 0) {
                                trip_group.insert({ 'tripname': req.body.tripname, 'budget': req.body.budget, 'created_by': ObjectId(req.body.userid), 'status': 1 },callback, function (err, result) {
                                    callback(err,result);
                                });
                            } else {
                                callback(arg);
                            }
                        }
                    ], function (err, results) {
                        if (results.length == 0) {
                            trip_user_mapping.insert({ 'trip_id': ObjectId(results["ops"][0]["_id"]), 'user_id': ObjectId(req.body.userid), 'isadmin': 1, 'status': 1 }, function (err, result) {
                                if (err) {
                                    res.send(cons.failed(err));
                                } else {
                                    res.send(con.success({ "msg": "Group name created sucessfully" }));
                                }
                            })
                        } else {
                            res.send(con.success({ "msg": "Group name already created" }));
                        }
                    });
                }
            });
        }
    },
    api_addmem: function (req, res) {
        if (req.body.userid == "" || typeof (req.body.userid) == 'undefined' || req.body.tripid == "" || typeof (req.body.tripid) == 'undefined' || req.body.isadmin == "" || typeof (req.body.isadmin) == 'undefined') {
            res.send(cons.failed({ "msg": "Please check the required fields!" }));
        } else {
            mongoClient.connect(cons.mongo_url, { useNewUrlParser: true }, function (err, client) {
                var mongo = client.db(cons.dbname);
                if (err) {
                    res.send(cons.failed(err));
                } else {
                    let trip_group = mongo.collection('trip_group');
                    let trip_user_mapping = mongo.collection('trip_user_mapping ');
                    async.parallel([
                        function (callback) {
                            trip_user_mapping.find({ 'user_id': ObjectId(req.body.userid), 'trip_id': req.body.tripid }).toArray(function (err, result) {
                                callback(result);
                            });
                        }
                    ], function (err, results) {
                        if (results.length == 0) {
                            trip_user_mapping.insert({ 'trip_id': ObjectId(req.body.tripid), 'user_id': ObjectId(req.body.userid), 'status': 1, 'isadmin': req.body.isadmin }, function (err, result) {
                                if (err) {
                                    res.send(cons.failed(err));
                                } else {
                                    res.send(con.success({ "msg": "Member added sucessfully" }));
                                }
                            })
                        } else {
                            res.send(con.success({ "msg": "Member already created" }));
                        }
                    });
                }
            });
        }
    },
    api_addamount: function (req, res) {
        if (req.body.userid == "" || typeof (req.body.userid) == 'undefined' || req.body.tripid == "" || typeof (req.body.tripid) == 'undefined') {
            res.send(cons.failed({ "msg": "Please check the required fields!" }));
        } else {
            mongoClient.connect(cons.mongo_url, { useNewUrlParser: true }, function (err, client) {
                var mongo = client.db(cons.dbname);
                if (err) {
                    res.send(cons.failed(err));
                } else {
                    let expenditure = mongo.collection('expenditure');
                    expenditure.insertOne({ 'trip_id': ObjectId(req.body.tripid), 'user_id': ObjectId(req.body.userid), 'category_id': ObjectId(req.body.categoryid), 'amount': req.body.amount, 'status': 1 }, function (err, result) {
                        if (err) {
                            res.send(cons.failed(err));
                        } else {
                            res.send(cons.success({ "msg": "Expenditure added sucessfully" }));
                        }
                    });
                }
            })
        }
    },
    api_spliton: function (req, res) {
        if (req.body.tripid == "" || typeof (req.body.tripid) == 'undefined') {
            res.send(cons.failed({ "msg": "Please check the required fields!" }));
        } else {
            mongoClient.connect(cons.mongo_url, { useNewUrlParser: true }, function (err, client) {
                var mongo = client.db(cons.dbname);
                if (err) {
                    res.send(cons.failed(err));
                } else {
                    let trip_group = mongo.collection('trip_group');
                    let expenditure = mongo.collection('expenditure');
                    async.waterfall([
                        function (callback) {
                            trip_group.aggregate([
                                { $match: { "_id": ObjectId(req.body.tripid) } },
                                {
                                    $lookup: {
                                        from: 'trip_user_mapping',
                                        localField: '_id',
                                        foreignField: 'trip_id',
                                        as: 'usermapping'
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'expenditure',
                                        localField: '_id',
                                        foreignField: 'trip_id',
                                        as: 'expenditure'
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'users',
                                        localField: 'usermapping.user_id',
                                        foreignField: '_id',
                                        as: 'user'
                                    }
                                }
                            ]).toArray(callback, function (err, result) {
                                callback(err, result);
                            })
                        }
                    ], function (err, results) {

                        let totalAmount = 0;
                        let expenditure_amount = {};
                        let cResult = [];
                        let userCount = 0;

                        userCount = results[0].usermapping.length;

                        results[0].expenditure.forEach(function (row) {
                            totalAmount += parseFloat(row.amount);
                            dividedshare = totalAmount / userCount;
                            expenditure_amount = {
                                'totalAmount': totalAmount,
                                'dividedshare': dividedshare
                            }
                        });

                        var userid = {};
                        for (var i = 0; i < results[0].expenditure.length; i++) {
                            var groupuserid = results[0].expenditure[i].user_id;
                            if (!userid[groupuserid]) {
                                userid[groupuserid] = [];
                            }
                            userid[groupuserid].push(results[0].expenditure[i].amount);                        
                        }
                        myArray = [];
                        
                        for (var groupuserid in userid) {
                            let amount = 0;
                            userid[groupuserid].forEach(function(row){
                                amount += parseFloat(row);
                            });
                            let spend_amount = 0;
                            let lent_amount = 0;
                            if(amount <= expenditure_amount.dividedshare)
                            spend_amount = Math.abs(amount - expenditure_amount.dividedshare);
                            else
                            lent_amount = Math.abs(amount - expenditure_amount.dividedshare);

                            let indexUser = {};

                            results[0].user.forEach(function(row){                                
                                if(groupuserid.toString()==row._id.toString()){
                                    indexUser = {
                                        name: row.name
                                    }
                                }
                            });

                            myArray.push({name:indexUser.name,userid: groupuserid, amount: amount,lent_amount:spend_amount,get_amount:lent_amount });
                        }

                        res.send(cons.success(myArray));
                    })

                }
            })
        }
    }
}

module.exports = Trips;