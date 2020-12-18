const db = require('../../mysql');

const tables = require('../../libs/tableNames');
const collumns = ['id', 'table_id', 'is_guest', 'guest_id', 'user_id', 'start', 'end', 'past_day'];

module.exports = {
    // Post request
    async newBooking(table_id, is_guest, guest_id, user_id, start, end, past_day) {
        return db(tables.booking)
            .insert({ table_id, is_guest, guest_id, user_id, start, end, past_day });
    },

    // Delete request
    async deleteBooking(id) {
        return db(tables.booking)
            .andWhere('id', '=', id)
            .delete();
    },

    // Get requests
    async getAll() {
        return db(tables.booking)
            .select(collumns);
    },

    async getById(id) {
        return db(tables.booking)
        .where('id', '=', id)
        .select(collumns)
        .first();
    },

    async isBookingOwner(pub_id, id) {
        return db(tables.booking)
            .join(tables.table, 'booking.table_id', '=', 'table.id')
            .where('table.pub_id', '=', pub_id)
            .andWhere('booking.id', '=', id)
            .select('booking.id')
            .first();
    },

    async isBookingUser(user_id, id) {
        return db(tables.booking)
            .where('id', '=', id)
            .andWhere('user_id', '=', user_id)
            .select('id')
            .first();
    },

    async getAllPubBookings(pub_id) {
        return db(tables.booking)
            .join(tables.table, 'booking.table_id', '=', 'table.id')
            .where('table.pub_id', '=', pub_id)
            .select('booking.id', 'table_id', 'table_num', 'is_guest', 
                    'guest_id', 'user_id', 'start', 'end', 'past_day')
            .orderBy(['table_num', 'start']);

    },

    async getUserBookings(user_id) {
        return db(tables.booking)
            .join(tables.table, 'booking.table_id', '=', 'table.id')
            .join(tables.pub, 'table.pub_id', '=', 'pub.id')
            .where('user_id', '=', user_id)
            .select('booking.id as id', 'table.id as table_id', 'table_num', 'start', 'end', 'name');
    },

    async getPubBookingsByDate(pub_id, start, end) {
        return db(tables.booking)
            .join(tables.table, 'booking.table_id', '=', 'table.id')
            .where('table.pub_id', '=', pub_id)
            .andWhere('start', '>=', start)
            .andWhere('end', '<=', end)
            .select('booking.id', 'table_id', 'table_num', 'is_guest', 
                    'guest_id', 'user_id', 'start', 'end', 'past_day')
            .orderBy(['table_num', 'start']);
    },

    async getBookingOverlap(table_id, start, end) {
        return db(tables.booking)
            .select(collumns)
            
            .where('end', '>', start)
            .andWhere('end', '<=', end)
            .andWhere('table_id', '=', table_id)

            .orWhere('start', '<=', start)
            .andWhere('end', '>=', end)
            .andWhere('table_id', '=', table_id)

            .orWhere('start', '>=', start)
            .andWhere('start', '<', end)
            .andWhere('table_id', '=', table_id);
    },

    async newGuest(first_name, last_name, phone) {
        return db(tables.guest)
            .insert({ first_name, last_name, phone });
    },

    async getGuestById(guest_id) {
        return db(tables.guest)
            .select('first_name', 'last_name', 'phone')
            .where('id', '=', guest_id)
            .first();
    },
}; 