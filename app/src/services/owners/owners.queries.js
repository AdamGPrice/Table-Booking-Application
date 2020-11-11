const db = require('../../mysql');

const tables = require('../../libs/tableNames');
const collumns = ['id', 'email', 'password']

module.exports = {
    async newOwner(email, password) {
        return db(tables.owner)
            .insert({ email, password });
    },

    async authOwner(email, password) {
        return db(tables.owner)
            .select(collumns)
            .where('email', '=', email)
            .where('password', '=', password)
            .first();
    },

    async getAll() {
        return db(tables.owner)
            .select(collumns);
    },

    async get(id) {
        return db(tables.owner)
            .select(collumns)
            .where('id', '=', id)
            .first(); // fisrt returns a single object instead of an array with 1 item
    }
};