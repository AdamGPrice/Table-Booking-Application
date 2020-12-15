class BookingDisplay {
    constructor(tables) {
        this.tables = tables;
        this.initTables();
    }

    initTables() {
        console.log(this.tables);
        this.tables.forEach(table => {
            const css = $(`<div class="bookings-row" id="table-${table.table_num}">
                            <div class="table-num">
                                <h4>Table ${table.table_num}</h4>
                            </div>
                            </div>`);

            $('#bookings-all').append(css);

        });
    }
}