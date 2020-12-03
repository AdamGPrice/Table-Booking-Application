const db = require('../../mysql');

const tables = require('../../libs/tableNames');
const collumns = ['id', 'pub_id', 'name'];

module.exports = {
    // Post Request
    async newPicture(pub_id, name) {
        return db(tables.picture)
            .insert({ pub_id, name });
    },

    // Get Requests
    async getAll() {
        return db(tables.picture)
            .select(collumns);
    },

    async getAllByPubId(pub_id) {
        return db(tables.picture)
            .select(collumns)
            .where('pub_id', '=', pub_id);
    },

    async getByPubIdAndName(pub_id, name) {
        return db(tables.picture)
            .select(collumns)
            .where('pub_id', '=', pub_id)
            .andWhere('name', '=', name)
            .first();
    },

    // Delete request
    async deleteByPubIdAndName(pub_id, name) {
        return db(tables.picture)
            .where('pub_id', '=', pub_id)
            .andWhere('name', '=', name)
            .delete();
    },
};