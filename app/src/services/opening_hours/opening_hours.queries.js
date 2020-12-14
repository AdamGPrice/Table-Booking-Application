const db = require('../../mysql');

const tables = require('../../libs/tableNames');
const collumns = ['id', 'pub_id', 'day', 'open', 'close'];

module.exports = {
    // Post request
    async newOpeningHour(pub_id, day, open, close) {
        return db(tables.opening_hours)
            .insert({ pub_id, day, open, close });
    },

    // Put request
    async updateByPubIdAndDay(pub_id, day, open, close) {
        return db(tables.opening_hours)
            .where('pub_id', '=', pub_id)
            .andWhere('day', '=', day)
            .update({ open, close });
    },

    // Delete request
    async deleteByPubIdAndDay(pub_id, day) {
        return db(tables.opening_hours)
            .where('pub_id', '=', pub_id)
            .andWhere('day', '=', day)
            .del();
    },

    // Get requests
    async getAll() {
        return db(tables.opening_hours)
            .select(collumns);
    },

    async getByPubId(pub_id) {
        return db(tables.opening_hours)
            .select(collumns)
            .where('pub_id', '=', pub_id);
    },

    async getByPubIdAndDay(pub_id, day) {
        return db(tables.opening_hours)
            .select(collumns)
            .where('pub_id', '=', pub_id)
            .andWhere('day', '=', day)
            .first();
    },

    async getByTableId(table_id) {
        return db(tables.opening_hours)
            .join(tables.table, 'opening_hours.pub_id', '=', 'table.pub_id')
            .where('table.id', '=', table_id)
            .select('opening_hours.id', 'opening_hours.pub_id', 'day', 'open', 'close');
    }
};