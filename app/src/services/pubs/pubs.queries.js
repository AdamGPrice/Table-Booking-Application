const db = require('../../mysql');

const tables = require('../../libs/tableNames');
const collumns = ['id', 'owner_id', 'name', 'description', 'email', 'phone'];

module.exports = {
    // Post Request
    async newPub(owner_id, name, description, email, phone) {
        return db(tables.pub)
            .insert({ owner_id, name, description, email, phone });
    },

    // Put Request
    async editPub(id, name, description, email, phone) {
        return db(tables.pub)
            .where('id', '=', id)
            .update({ name, description, email, phone });
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

    async filterByName(name) {
        return db(tables.pub)
            .select(collumns)
            .where('name', 'like', `%${name}%`);
    },

    async filterByDay(day) {
        return db(tables.pub)
            .join(tables.opening_hours, 'pub.id', '=', 'opening_hours.pub_id')
            .where('day', '=', day)
            .select('pub.id', 'name', 'description', 'email', 'phone');
    },

    async filterByNameAndDay(name, day) {
        return db(tables.pub)
            .join(tables.opening_hours, 'pub.id', '=', 'opening_hours.pub_id')
            .where('day', '=', day)
            .andWhere('name', 'like', `%${name}%`)
            .select('pub.id', 'name', 'description', 'email', 'phone');
    },
    
    async filterByEverything(query) {
        return db(tables.pub)
            .join(tables.address, 'pub.id', '=', 'address.pub_id')
            .where('name', 'like', `%${query}%`)
            .orWhere('line_1', 'like', `%${query}%`)
            .orWhere('line_2', 'like', `%${query}%`)
            .orWhere('town', 'like', `%${query}%`)
            .orWhere('country', 'like', `%${query}%`)
            .select('pub.id', 'name', 'description', 'email', 'phone');
    },

    async filterByEverythingAndDay(query, day) {
        return db(tables.pub)
            .join(tables.address, 'pub.id', '=', 'address.pub_id')
            .join(tables.opening_hours, 'pub.id', '=', 'opening_hours.pub_id')
            .where('name', 'like', `%${query}%`)
            .andWhere('day', '=', day)
            .orWhere('line_1', 'like', `%${query}%`)
            .andWhere('day', '=', day)
            .orWhere('line_2', 'like', `%${query}%`)
            .andWhere('day', '=', day)
            .orWhere('town', 'like', `%${query}%`)
            .andWhere('day', '=', day)
            .orWhere('country', 'like', `%${query}%`)
            .andWhere('day', '=', day)
            .select('pub.id', 'name', 'description', 'email', 'phone');
    },
};