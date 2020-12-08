const db = require('../../mysql');

const tables = require('../../libs/tableNames');
const collumns = ['id', 'user_id', 'first_name', 'last_name', 'phone'];

module.exports = {
    // Post request
    async newUserInfo(user_id, first_name, last_name, phone) {
        return db(tables.user_info)
            .insert({ user_id, first_name, last_name, phone });
    },

    // Put request
    async editUserInfo(user_id, first_name, last_name, phone) {
        return db(tables.user_info)
            .where('user_id', '=', user_id)
            .update({ first_name, last_name, phone });
    },

    // Get requests
    async getAll() {
        return db(tables.user_info)
            .select(collumns);
    },

    async getByUserId(user_id) {
        return db(tables.user_info)
            .select(collumns)
            .where('user_id', '=', user_id)
            .first();
    },

    async getById(id) {
        return db(tables.user_info)
            .select(collumns)
            .where('id', '=', id)
            .first();
    }
};