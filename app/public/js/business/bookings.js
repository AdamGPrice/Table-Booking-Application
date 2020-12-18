let opening_hours;
let tables;

$(() => {
    setupPage();
});

function dateChange() {
    const date = new Date($('#datepicker').val());
    getBookingsByDate(date);
}

function getBookingsByDate(date) {
    const dateStr = formatDate(date);
    const day = getWeekDay(date);

    const account = JSON.parse(localStorage.getItem('account'));
    $.ajax({
        url: '/api/bookings/date/' + dateStr,
        type: 'GET',
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            displayBookings(data, day)
        },
        error: (response) => {
            // if 404 display pub not open on this date
            console.log('error');
        }
    });
}

function displayBookings(bookings, day) {
    $('#bookings-all').html('');
    const hours = getOpeningHoursFromDay(day);

    const displayTables = [];

    for (let j = 0; j < tables.length; j++) {
        displayTables.push(tables[j]);
        displayTables[j].bookings = [];
        for (let i = 0; i < bookings.length; i++ ) {
            if (tables[j].id == bookings[i].table_id) {
                displayTables[j].bookings.push(bookings[i]);
            }
        }
    } 
    
    if (displayTables.length < 1) {
        $('#bookings-all').append(`
            <h5>There can not be any booking without tables</h5>
            <p>Go to the tables tab to add your tables to the system.</p>
        `);
    }

    displayTables.forEach(table => {
        $('#bookings-all').append(`
            <div>
                <h5>Table Num: ${table.table_num}<h5>
                <div class="divider"></div>
                <div id="table-${table.id}-bookings" class="table-row"></div>
                <div class="divider"></div>
            </div>
        `);
        if (table.bookings.length < 1) {
            $(`#table-${table.id}-bookings`).html(`<h6>No bookings for this table</h6>`);
        }

        table.bookings.forEach(booking => {
            const start = dateToTimeStr(new Date(booking.start));
            const end = dateToTimeStr(new Date(booking.end));

            $(`#table-${table.id}-bookings`).append(`
                <div class="z-depth-3 booking">
                    <div class="center">
                        <p class="center"><b>booking ref #${booking.id}</b></br>
                            ${booking.user_info.first_name}
                            ${booking.user_info.last_name}</br>
                            ${booking.user_info.phone}</br>
                            ${start} - ${end}</p>
                        <a class="waves-effect waves-light btn tt-btn btn-close red darken-2" id="delete-btn-${booking.id}">Remove</a>
                    </div>
                </div>
            `);

            $(`#delete-btn-${booking.id}`).click(() => {
                deleteBooking(booking.id);
            });
        });


        $(`#table-${table.id}-bookings`).append('<div style="clear:both;"></div>');
    });
}

function deleteBooking(id) {
    const account = JSON.parse(localStorage.getItem('account'));
    $.ajax({
        url: '/api/bookings/' + id + '/owner',
        type: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            dateChange();
        },
        error: (response) => {
            alert('could not delete booking at this time. Try again later');
        }
    });
}


// Setup functions

function setupPage() {
    const pubId = localStorage.getItem('pubId');
    $.ajax({
        url: '/api/opening_hours/pub/' + pubId,
        type: 'GET',
        success: (data) => {
            opening_hours = data;
            if (tables && opening_hours) {
                inputSetup(opening_hours);
            }
        },
        error: (response) => {
            console.log(response);  
        }
    });

    $.ajax({
        url: '/api/tables/pub/' + pubId,
        type: 'GET',
        success: (data) => {
            tables = data;
            if (tables && opening_hours) {
                inputSetup(opening_hours);
            }
        },
        error: (response) => {
            console.log(response);  
        }
    });


    $('#arrow-left').click(leftArrowClick);
    $('#arrow-right').click(rightArrowClick);
}

function leftArrowClick() {
    let date = new Date($('#datepicker').val());
    date = date.addDays(-1);
    date = nextOpenDate(date, -1);
    setDatePicker(date);
}

function rightArrowClick() {
    let date = new Date($('#datepicker').val());
    date = date.addDays(1);
    date = nextOpenDate(date, 1);
    setDatePicker(date);
}

function setDatePicker(date) {
    const  instance = M.Datepicker.getInstance($('#datepicker'));
    instance.setDate(new Date(date));

    dateArr = date.toDateString().split(' ');
    dateStr = `${dateArr[1]} ${dateArr[2]}, ${dateArr[3]}`;
    $('#datepicker').val(dateStr);

    instance.open();
    instance.close();
}

function nextOpenDate(date, dir) {
    for (i = 0; i < 7; i++) {
        for (j = 0; j < opening_hours.length; j++) {
            if (opening_hours[j].day == getWeekDay(date)) {
                return date;
            }
        }
        date = date.addDays(dir);
    }
}

function inputSetup(opening_times) {
    let days = [];
    opening_times.forEach(oh => {
        days.push(oh.day);
    });

    const nextDate = nextOpenDate(new Date(), 1);
    $('.datepicker').datepicker({
        defaultDate: nextDate,
        setDefaultDate: true,
        disableDayFn: (date) => {
            let openDay = false;
            days.forEach(day => {
                if (getWeekDay(date) == day) {
                    openDay = true
                }
            });
            return !openDay;
        },
        onClose: dateChange
    });
    dateChange();
}

// utility functions

function getOpeningHoursFromDay(day) {
    let day_hours;
    for (let i = 0; i < opening_hours.length; i++) {
        if (opening_hours[i].day == day) {
            day_hours = opening_hours[i];
        }
    }

    times = [];
    const start = day_hours.open.split(':');
    const end = day_hours.close.split(':');
    const date = new Date($('#datepicker').val());
   
    if (start[0] < end[0]) {
        for (let i = Number(start[0]); i <= Number(end[0]); i++) {
            times.push(convertTime(date, i + ':00', false));
            if (i != Number(end[0])) {
                times.push(convertTime(date, i + ':30', false));
            }
        }
    } else {
        for (let i = Number(start[0]); i < 24; i++) {
            times.push(convertTime(date, i + ':00', false));
            times.push(convertTime(date, i + ':30', false));
        }
        for (let i = 0; i <= Number(end[0]); i++) {
            times.push(convertTime(date, i + ':00', true));
            if (i != Number(end[0])) {
                times.push(convertTime(date, i + ':30', true));
            }
        }
    }
    
    return times;
}

function convertTime(date, time, pastMidnight) {
    if (pastMidnight) {
        date = date.addDays(1);
    }
    const dateStr = formatDate(date) + ' ' + time;
    return { dateStr, time}
}

function formatDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function formatDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function getWeekDay(date) {
    let day = date.getDay();
    if (day == 0) {
        day = 7;
    }
    return day;
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function dateToTimeStr(date) {
    const hourStr = `${date.getHours() >= 10 ? date.getHours() : date.getHours() + '0'}`;
    const minuteStr = `${date.getMinutes() >= 10 ? date.getMinutes() : date.getMinutes() + '0'}`;
    return hourStr + ':' + minuteStr;
}