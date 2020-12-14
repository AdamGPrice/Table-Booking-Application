const db = require('../../mysql');

const tables = require('../../libs/tableNames');
const collumns = ['id', 'table_id', 'is_guest', 'guest_id', 'user_id', 'start', 'end', 'past_day'];

module.exports = {
    // Post request
    async newBooking(table_id, is_guest, guest_id, user_id, start, end, past_day) {
        return db(tables.booking)
            .insert({ table_id, is_guest, guest_id, user_id, start, end, past_day });
    },

    // Get requests
    async getAll() {
        return db(tables.booking)
            .select(collumns);
    },

    async getAllPubBookings(pub_id) {
        return db(tables.booking)
            .join(tables.table, 'booking.table_id', '=', 'table.id')
            .where('table.pub_id', '=', pub_id)
            .select('booking.id', 'table_id', 'table_num', 'is_guest', 
                    'guest_id', 'user_id', 'start', 'end', 'past_day')
            .orderBy(['table_num', 'start']);

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
    }
}; 