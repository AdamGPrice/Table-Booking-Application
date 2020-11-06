const db = require('../../mysql');

const tables = require('../../../libs/tableNames');
const collumns = ['id', 'owner_id', 'name', 'description', 'email', 'phone'];

module.exports = {
    // Post Requests
    async newPub(owner_id, name, description, email, phone) {
        return db(tables.pub)
            .insert({ owner_id, name, description, email, phone });
    },

    // Get Requests
    async getAll() {
        return db(tables.pub)
            .select(collumns);
    },

    async getById(id) {
        return db(tables.pub)
            .select(collumns)
            .where('id', '=', id)
            .first();
    },

    async getByOwnerId(owner_id) {
        return db(tables.pub)
            .select(collumns)
            .where('owner_id', '=', owner_id)
            .first();
    },

    async FilterByName(name) {
        return db(tables.pub)
            .select(collumns)
            .where('name', 'like', `%${name}%`);
    }
}