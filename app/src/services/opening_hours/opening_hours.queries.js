const db = require('../../mysql');

const tables = require('../../libs/tableNames');
const collumns = ['id', 'pub_id', 'day', 'open', 'close'];

module.exports = {
    // Post request
    async newOpeningHour(pub_id, day, open, close) {
        return db(tables.opening_hours)
            .insert({ pub_id, day, open, close });
    },

    // Get requests
    async getAll() {
        return db(tables.opening_hours)
            .select(collumns);
    },

    async getByPubId(pub_id) {
        return db(tables.opening_hours)
            .select(collumns)
            .where('pub_id', '=', pub_id)
            .first();
    },

    async getByPubIdAndDay(pub_id, day) {
        return db(tables.opening_hours)
            .select(collumns)
            .where('pub_id', '=', pub_id)
            .andWhere('day', '=', day)
            .first();
    }
};