let opening_hours;
let times = [];

$(() => {
    getPubOpeningTimes();
    $('#location-select').formSelect();
    $('#duration-select').formSelect();
    $('#find-tables-btn').click(findTable);
});

function getPubOpeningTimes() {
    const params = new URLSearchParams(window.location.search);
    const pubId = params.get('id');
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
        onClose: generateTimeOptions
    });
    generateTimeOptions();
}

function generateTimeOptions() {
    $('#time-div').html(`<p>Time:</p>
                        <select id="time-select">
                        </select>`);

    const date = new Date($('#datepicker').val());
    const day = getWeekDay(date);
    let opening_times;
    opening_hours.forEach(oh => {
        if (oh.day == day) {
            opening_times = oh;
        }
    });

    times = [];
    const start = opening_times.open.split(':');
    const end = opening_times.close.split(':');
   
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

    for (let i = 0; i < times.length - 1; i++) {
        $('#time-select').append(`<option value="${i}">${times[i].time}</option>`);
    }

    $('#time-select').formSelect();
    $('#time-select').on('change', () => {
        generateDurationOptions();
    });
    generateDurationOptions();
}

function generateDurationOptions() {
    $('#duration-div').html(`<p>Duration:</p>
                            <select id="duration-select">
                            </select>`);

    const time = $('#time-select').val();

    let count = 1;
    let val = -1;
    for (let i = Number(time) + 1; i < times.length && i <= Number(time) + 8; i++) {
        $('#duration-select').append(`<option value="${i}">${intToStr(count)}</option>`);
        if (count == 2) {
            val = i; 
        }
        count++;
    }

    if (val != -1) {
        $('#duration-select').val(val); 
    }
    
    $('#duration-select').formSelect();
}

function findTable() {
    $('#loading-bar').css('display', 'block');

    const start = times[$('#time-select').val()];
    const end = times[$('#duration-select').val()];

    const query = {
        start: start.dateStr,
        end: end.dateStr,
        seats: $('#seats').val(),
        location: $('#location-select').val()
    }

    const params = new URLSearchParams(window.location.search);
    const pubId = params.get('id');
    $.ajax({
        url: '/api/bookings/tables/pub/' + pubId,
        type: 'POST',
        data: JSON.stringify(query),
        contentType: "application/json;charset=utf-8",
        success: (data) => {
            $('#loading-bar').css('display', 'none');
            displayTables(data);
        },
        error: (response) => {
            console.log(response);  
        }
    });
}

function displayTables(data) {
    const locations = ['Inside', 'Outside']
    $('#table-list').html('');
    const tables = data.availableTables;

    $('#table-list').append(`<h5>${tables.length} tables available at 
                            ${data.start.split(' ')[1]} - ${data.end.split(' ')[1]}</h5>`);

    tables.forEach(table => {
        $('#table-list').append(`<div class="table col s12">
                                    <div class="col s7">
                                        <p>Table Num: ${table.table_num}</br>
                                        Seats: ${table.seats}</br>
                                        Location: ${locations[table.is_outside]}</p>
                                    </div>
                                    <div class="col s5">
                                        <a class="waves-effect waves-light btn" id="book-btn-${table.id}">Book Table</a>
                                    </div>
                                </div>`);

        $(`#book-btn-${table.id}`).click(() => {
            handleBooking({ 
                table_id: table.id, 
                start: data.start, 
                end: data.end 
            });
        });
    });
}

function handleBooking(bookingInfo) {
    // If the user is signed in send a booking request if not ask for contact information
    const account = JSON.parse(localStorage.getItem('account'));
    if (account && account.type == 'user') {
        userCreateBooking(bookingInfo);
    } else {
        guestCreateBooking(bookingInfo);
    }
}

function userCreateBooking(bookingInfo) {
    const account = JSON.parse(localStorage.getItem('account'));

    $.ajax({
        url: '/api/bookings/user',
        type: 'POST',
        data: JSON.stringify(bookingInfo),
        contentType: "application/json;charset=utf-8",
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            userBookingComfirmed(data.bookingInfo);
        },
        error: (response) => {
            console.log(response);        
        }
    });
}

function userBookingComfirmed(bookingInfo) {
    let date = new Date(bookingInfo.start);
    
    if (bookingInfo.past_day) {
        date = date.addDays(-1);
    }

    $('#booking-outcome').html(`
    <h3 class="center">Booking Confirmed</h3>
    <div class="divider"></div>
    <div class="center"> 
        <h4>booking infomation:</h4>
        <h5>Booking Refernce: ${bookingInfo.bookingId}</br>
        Table Number: ${bookingInfo.table_id}</br>
        Date: ${date.toDateString()}</br>
        Start Time: ${bookingInfo.start.split(' ')[1]}</br>
        End Time: ${bookingInfo.end.split(' ')[1]}</br>
        </h5>
        <p>This booking is now linked to your account. </br>
            You can view all or cancel any of your booking in the account page. </p>
    </div>`);
    $('#booking-outcome').css('display', 'block');
    $('#search-block').css('display', 'none');
}

function guestCreateBooking(bookingInfo) {
    console.log(bookingInfo);
    $('#booking-outcome').html(`
    <h3 class="center">Booking</h3>
    <div class="divider"></div>
    <div class="center">
        <h5>Enter Contact information for booking</h5>
    </div>`);


    $('#booking-outcome').css('display', 'block');
    $('#search-block').css('display', 'none');
}


// Utility functions

function intToStr(value) {
    if (value % 2 == 0) {
        const hour = value / 2;
        return `${hour} H`;
    } else {
        const hour = (value / 2) - 0.5;
        return `${hour} H 30 M`;
    }
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

function getWeekDay(date) {
    let day = date.getDay();
    if (day == 0) {
        day = 7;
    }
    return day;
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

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}