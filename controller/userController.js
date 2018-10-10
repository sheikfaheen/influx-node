let userModel = require('../models/userModel');

let Users = {
    api_getallusers: userModel.api_getallusers,
    api_login      : userModel.api_login,
    api_indUser    : userModel.api_indUser
}

module.exports = Users;