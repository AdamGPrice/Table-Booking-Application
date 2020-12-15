let display;
const info = {};

$(() => {
    setupPage();
});

function dateChange() {
    const date = new Date($('#datepicker').val());
    getBookingsByDate(date);
}

function setupPage() {
    getAllTables();
    $('.datepicker').datepicker({
        defaultDate: new Date(),
        setDefaultDate: true,
        onClose: dateChange
    });
}

function getAllTables() {
    const pubId = localStorage.getItem('pubId');
    $.ajax({
        url: '/api/tables/pub/' + pubId,
        type: 'GET',
        success: (data) => {
            display = new BookingDisplay(data);
            info.tables = data;
            getBookingsByDate(new Date());
        },
        error: (response) => {
            console.log(response);
        }
    });
}

function getBookingsByDate(date) {
    const dateStr = formatDate(date);
    const day = getWeekDay(date);
    console.log(day);

    const account = JSON.parse(localStorage.getItem('account'));
    $.ajax({
        url: '/api/bookings/date/' + dateStr,
        type: 'GET',
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            info.bookings = data;
            getOpeningTimesByDay(day);
        },
        error: (response) => {
            // if 404 display pub not open on this date
            console.log(response);     
        }
    });
}

function getOpeningTimesByDay(day) {
    const pubId = localStorage.getItem('pubId');
    $.ajax({
        url: '/api/opening_hours/pub/' + pubId + '/day/' + day,
        type: 'GET',
        success: (data) => {
            info.opening_hours = data;
            console.log(info);
        },
        error: (response) => {
            console.log(response);  
        }
    });
}


// utility functions

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