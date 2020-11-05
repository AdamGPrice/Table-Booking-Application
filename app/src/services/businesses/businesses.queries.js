const db = require('../../mysql');

const tables = require('../../../lib/tableNames');
const collumns = ['id', 'email', 'password']

module.exports = {
    async newBusiness(email, password) {
        return db(tables.business)
            .insert({ email, password });
    },

    async authBusiness(email, password) {
        return db(tables.business)
            .select(collumns)
            .where('email', '=', email)
            .where('password', '=', password)
            .first();
    },

    async find() {
        return db(tables.business)
            .select(collumns);
    },

    async get(id) {
        return db(tables.business)
            .select(collumns)
            .where('id', '=', id)
            .first(); // fisrt returns a single object instead of an array with 1 item
    }
};