const db = require('../../mysql');

const tables = require('../../libs/tableNames');
const collumns = ['id', 'pub_id', 'table_num', 'seats', 'is_outside'];

module.exports = {
    // Post request
    async newTable(pub_id, table_num, seats, is_outside) {
        return db(tables.table)
            .insert({ pub_id, table_num, seats, is_outside });
    },

    // Put request
    async updateByPubIdAndNum(pub_id, table_num, seats, is_outside) {
        return db(tables.table)
            .where('pub_id', '=', pub_id)
            .andWhere('table_num', '=', table_num)
            .update({ seats, is_outside});
    },

    // Delete request
    async deleteTableByPubIdAndNumber(pub_id, table_num) {
        return db(tables.table)
            .where('pub_id', '=', pub_id)
            .andWhere('table_num', '=', table_num)
            .delete();
    },

    // Get requests
    async getTablesByPubId(pub_id) {
        return db(tables.table)
            .select()
            .where('pub_id', '=', pub_id)
            .orderBy('table_num');
    },

    async getTablesByPubIdIsOutside(pub_id, is_outside) {
        return db(tables.table)
            .select()
            .where('pub_id', '=', pub_id)
            .andWhere('is_outside', '=', is_outside);
    },

    async getTablesByPubIdAndQuery(pub_id, is_outside, seats) {
        return db(tables.table)
            .where('pub_id', '=', pub_id)
            .andWhere('is_outside', '=', is_outside)
            .andWhere('seats', '>=', seats)
            .select(collumns);
    },

    async getTablesByPubIdAndSeats(pub_id, seats) {
        return db(tables.table)
            .where('pub_id', '=', pub_id)
            .andWhere('seats', '>=', seats)
            .select(collumns);
    },

    async getTableByPubIdAndNumber(pub_id, table_num) {
        return db(tables.table)
            .select()
            .where('pub_id', '=', pub_id)
            .andWhere('table_num', '=', table_num)
            .first();
    },

    async getHighestCapacityTable(pub_id) {
        return db(tables.table)
            .where('pub_id', '=', pub_id)
            .orderBy('seats', 'desc')
            .first();
    }
};