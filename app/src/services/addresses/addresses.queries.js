const db = require('../../mysql');

const tables = require('../../../libs/tableNames');
const collumns = ['id', 'pub_id', 'line_1', 'line_2', 'town', 'country', 'postcode'];

module.exports = {
    // Post Request
    async newAddress(pub_id, line_1, line_2, town, country, postcode) {
        return db(tables.address)
            .insert({ pub_id, line_1, line_2, town, country, postcode });   
    },

    // Put Request
    async editAddress(pub_id, line_1, line_2, town, country, postcode) {
        return db(tables.address)
            .where('pub_id', '=', pub_id)
            .update({ line_1, line_2, town, country, postcode });
    },

    // Get Requests
    async getByPubId(pub_id) {
        return db(tables.address)
            .select(collumns)
            .where('pub_id', '=', pub_id)
            .first();
    },

    async getAll() {
        return db(tables.address)
            .select(collumns);
    }
};
