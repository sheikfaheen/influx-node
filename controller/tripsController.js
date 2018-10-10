let trips = require('../models/tripsModel');

Trips = {
    api_addtrip : trips.api_addtrip,
    api_addmem  : trips.api_addmem,
    api_addamount : trips.api_addamount,
    api_spliton   : trips.api_spliton
}

module.exports = Trips;