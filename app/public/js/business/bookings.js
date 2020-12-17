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
            console.log(data);
        },
        error: (response) => {
            // if 404 display pub not open on this date
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

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// Setup functions

function setupPage() {
    const pubId = localStorage.getItem('pubId');
    $.ajax({
        url: '/api/opening_hours/pub/' + pubId,
        type: 'GET',
        success: (data) => {
            opening_hours = data;
            inputSetup(data);
        },
        error: (response) => {
            console.log(response);  
        }
    });
}

function nextOpenDate(date) {
    for (i = 0; i < 7; i++) {
        for (j = 0; j < opening_hours.length; j++) {
            if (opening_hours[j].day == getWeekDay(date)) {
                return date;
            }
        }
        date = date.addDays(1);
    }
}

function inputSetup(opening_times) {
    let days = [];
    opening_times.forEach(oh => {
        days.push(oh.day);
    });

    const nextDate = nextOpenDate(new Date());
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