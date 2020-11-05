const db = require('../../mysql');

const tables = require('../../../lib/tableNames');
const collumns = ['id', 'email', 'password'];

module.exports = {
    async newUser(email, password) {
        return db(tables.user)
            .insert({ email, password });
    },

    async authUser(email, password) {
        return db(tables.user)
            .select(collumns)
            .where('email', '=', email)
            .where('password', '=', password)
            .first();
    }
}