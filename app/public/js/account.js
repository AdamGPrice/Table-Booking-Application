$(() => {
    getUserInfo();
    getUserBookings();
    $('#make-changes-btn').click(editView);
    $('#discard-changes-btn').click(getUserInfo);
    $('#save-changes-btn').click(updateUserInfo);
});

function getUserInfo() {
    const account = JSON.parse(localStorage.getItem('account'));

    $.ajax({
        url: '/api/user_info/user/' + account.id,
        type: 'GET',
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            populateUserInfo(data);
            saveView();
        },
        error: (response) => {
            console.log(response);
        }
    });
}

function editView() {
    $('#first-name').removeAttr('disabled');
    $('#last-name').removeAttr('disabled');
    $('#phone').removeAttr('disabled');
    $('#make-changes-btn').css('display', 'none');
    $('#discard-changes-btn').css('display', 'inline-block');
    $('#save-changes-btn').css('display', 'inline-block');
}

function saveView() {
    $('#first-name').attr('disabled', '');
    $('#last-name').attr('disabled', '');
    $('#phone').attr('disabled', '');
    $('#make-changes-btn').css('display', 'inline-block');
    $('#discard-changes-btn').css('display', 'none');
    $('#save-changes-btn').css('display', 'none');
}

function updateUserInfo() {
    const account = JSON.parse(localStorage.getItem('account'));
    user_info = {
        first_name: $('#first-name').val(),
        last_name: $('#last-name').val(),
        phone: $('#phone').val()
    };

    $.ajax({
        url: '/api/user_info',
        type: 'PUT',
        data: JSON.stringify(user_info),
        contentType: "application/json;charset=utf-8",
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            getUserInfo();
        },
        error: (response) => {
            console.log(response);        
        }
    });
};

function populateUserInfo(user_info) {
    $('#first-name').val(user_info.first_name);
    $('#last-name').val(user_info.last_name);
    $('#phone').val(user_info.phone);
    M.updateTextFields();
}






// User Bookings functions

function getUserBookings() {
    const account = JSON.parse(localStorage.getItem('account'));
    $.ajax({
        url: '/api/bookings/mybookings',
        type: 'GET',
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            displayBookings(data);
        },
        error: (response) => {
            console.log(response);        
        }
    });
}

function displayBookings(bookings) {
    if (bookings.length < 1) {
        $('#bookings-block').html(`
        <h4 class="center">You currently have no booking linked to this account.</h4>
        <h4 class="center">Check out the <a href="/search" class="teal-text text-darken-2">search</a> 
            page to find pubs you want to book a table for</h4>`);  
    } else {
        $('#bookings-block').html(`
        <div class="col s1"></div>
        <div class="col s10" id="bookings-list"></div>
        <div class="col s1"></div>`);  


        bookings.forEach(booking => {
            let date = new Date(booking.start);
    
            if (booking.past_day) {
                date = date.addDays(-1);
            }

            start = new Date(booking.start);
            end = new Date(booking.end);
            startTime = start.getHours() + ':' + start.getMinutes() + '0';
            endTime = end.getHours() + ':' + end.getMinutes() + '0';

            $('#bookings-list').append(`
                <div class="listing z-depth-3 col s12">
                    <h3 class="center"> ${booking.name} </h3>
                    <div class="divider"></div>
                    <div class="col s8">
                        <h5>Reference ID: ${booking.id}</h5>
                        <h5>Table Number: ${booking.table_num}</h5>
                        <h5>Date: ${date.toDateString()}</h5>
                        <h5>Time: ${startTime} - ${endTime}</h5>
                    </div>
                    <div class="col s4 center">
                        <a class="waves-effect waves-light btn-large red darken-2 booking-cancel" 
                                    id="cancel-btn-${booking.id}">Cancel Booking</a>
                    </div>
                </div>`);

            $(`#cancel-btn-${booking.id}`).click(() => {
                cancelUserBooking(booking.id);
            })
        });
    }
}

function cancelUserBooking(bookingRef) {
    const account = JSON.parse(localStorage.getItem('account'));
    $.ajax({
        url: '/api/bookings/' + bookingRef + '/user',
        type: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            getUserBookings();
        },
        error: (response) => {
            console.log(response);        
        }
    });
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}