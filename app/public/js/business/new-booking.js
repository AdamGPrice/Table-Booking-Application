let opening_hours;
let times = [];

$(() => {
    getPubOpeningTimes();
    $('#location-select').formSelect();
    $('#duration-select').formSelect();
    $('#find-tables-btn').click(findTable);
    $('.materialboxed').materialbox();
});

function getPubOpeningTimes() {
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

    $.ajax({
        url: '/api/tables/pub/' + pubId + '/capacity',
        type: 'GET',
        success: (data) => {
            maxCapacity(data);
        },
        error: (response) => {
            console.log(response);  
        }
    });
}

function maxCapacity(value) {
    console.log(value);
    $('#seats').attr("max", value);
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

    const pubId = localStorage.getItem('pubId');
    $.ajax({
        url: '/api/bookings/tables/pub/' + pubId,
        type: 'POST',
        data: JSON.stringify(query),
        contentType: "application/json;charset=utf-8",
        success: (data) => {
            $('#loading-bar').css('display', 'none');
            if (data.available) {
                displayTables(data);
            } else {
                displayOptionalTables(data);
            }
        },
        error: (response) => {
            console.log(response);  
        }
    });
}

function displayTables(data) {
    const locations = ['Inside', 'Outside'];
    $('#table-list').html('');
    const tables = data.tables;

    $('#table-list').append(`<h5>${tables.length} tables available at 
                            ${data.start.split(' ')[1]} - ${data.end.split(' ')[1]}</h5>`);

    tables.forEach(table => {
        $('#table-list').append(`
        <div class="table col s12">
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

function displayOptionalTables(data) {
    const locations = ['Inside', 'Outside']
    $('#table-list').html('');
    console.log(data);

    $('#table-list').append(`<h5 class="center"> No tables are available at </br>
        ${data.start.split(' ')[1]} - ${data.end.split(' ')[1]}</h5>`);

    if (data.tables.length > 0) {
        $('#table-list').append(`<h6 class="center">Here are some alternative times that may interest you...</h6>`);

        data.tables.forEach(alt => {
            const table = alt.table;
            $('#table-list').append(`
            <div class="table col s12">
                <div class="col s7">
                    <p>Time: ${alt.start.split(' ')[1]} - ${alt.end.split(' ')[1]} </br>
                    Table Num: ${table.table_num}</br>
                    Seats: ${table.seats}</br>
                    Location: ${locations[table.is_outside]}</p>
                </div>
                <div class="col s5">
                    <a class="waves-effect waves-light btn" id="book-btn-${table.id + alt.start.split(' ')[1].split(':')[0]}">Book Table</a>
                </div>
            </div>`);
            $(`#book-btn-${table.id + alt.start.split(' ')[1].split(':')[0]}`).click(() => {
                console.log('ello');
                handleBooking({ 
                    table_id: table.id, 
                    start: alt.start, 
                    end: alt.end 
                });
            });
        });
    } else {
        $('#table-list').append(`<h5 class="center">There are not tables avaialable around the time you specified.
                                    Try later on in the day or a different day alltogeher.</h5>`);
    }
}

function handleBooking(bookingInfo) {
    // If the user is signed in send a booking request if not ask for contact information
    const account = JSON.parse(localStorage.getItem('account'));
    if (account && account.type == 'user') {
        userCreateBooking(bookingInfo);
    } else {
        showGuestForm(bookingInfo);
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

function showGuestForm(bookingInfo) {
    $('#booking-guest').css('display', 'block');
    $('#search-block').css('display', 'none');

    $('#guest-btn').click(() => {
        createGuestBooking(bookingInfo);
    });
}

function createGuestBooking(bookingInfo) {
    const first_name = $('#first_name').val();
    const last_name = $('#last_name').val();
    const phone = $('#phone').val();

    if (first_name && phone) {
        info = {
            ...bookingInfo,
            first_name,
            last_name,
            phone
        };
    
        $.ajax({
            url: '/api/bookings/guest',
            type: 'POST',
            data: JSON.stringify(info),
            contentType: "application/json;charset=utf-8",
            success: (data) => {
                guestBookingComfirmed(data.bookingInfo);
            },
            error: (response) => {
                console.log(response);        
            }
        });

    } else {
        // Error messages or something idk......
    }
}

function guestBookingComfirmed(bookingInfo) {
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
        <h5>Provide the customer with the booking reference 
            so they can cancel at a later date if they want to.</h5>
    </div>`);
    $('#booking-outcome').css('display', 'block');
    $('#search-block').css('display', 'none');
    $('#booking-guest').css('display', 'none');
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