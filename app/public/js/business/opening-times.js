$(() => {
    setupBtnCalls();
    // Setup javascript for timepickers
    $('.timepicker').timepicker({
        twelveHour: false,
        showClearBtn: true,
        defaultTime: '8:00',
        autoClose: true
    });
    getOpeningTimes();    
});

function getOpeningTimes() {
    const pubId = localStorage.getItem('pubId');
    $.ajax({
        url: '/api/opening_hours/pub/' + pubId,
        type: 'GET',
        success: (data) => {
            populateData(data);
        },
        error: (response) => {
            
        }
    });
}

function getOpeningTimesDay(day) {
    const pubId = localStorage.getItem('pubId');
    $.ajax({
        url: '/api/opening_hours/pub/' + pubId + '/day/' + day,
        type: 'GET',
        success: (data) => {
            const div = $(`#day-${day}`);
            div.find('.open').val(data.open);
            div.find('.close').val(data.close);
            fullStyles(day);
        },
        error: (response) => {
            if (response.status == 404) {
                const div = $(`#day-${day}`);
                div.find('.open').val('');
                div.find('.close').val('');
                blankStyles(day);
            }        
        }
    });
}

function postOpeningHours(day) {
    const account = JSON.parse(localStorage.getItem('account'));
    const pubId = localStorage.getItem('pubId');
    const div = $(`#day-${day}`);
    const open = div.find('.open').val();
    const close = div.find('.close').val();

    const opening_hours = { 
        pub_id: pubId, 
        day,
        open,
        close 
    };

    $.ajax({
        url: '/api/opening_hours',
        type: 'POST',
        data: JSON.stringify(opening_hours),
        contentType: "application/json;charset=utf-8",
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            getOpeningTimesDay(day);
        },
        error: (response) => {

        }
    });
}

function editOpeningHours(day) {
    const account = JSON.parse(localStorage.getItem('account'));
    const pubId = localStorage.getItem('pubId');
    const div = $(`#day-${day}`);
    const open = div.find('.open').val();
    const close = div.find('.close').val();

    const opening_hours = { 
        pub_id: pubId, 
        day,
        open,
        close 
    };

    $.ajax({
        url: '/api/opening_hours',
        type: 'PUT',
        data: JSON.stringify(opening_hours),
        contentType: "application/json;charset=utf-8",
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            getOpeningTimesDay(day);
        },
        error: (response) => {

        }
    });
}

function deleteOpeningHours(day) {
    const account = JSON.parse(localStorage.getItem('account'));
    const pubId = localStorage.getItem('pubId');
    $.ajax({
        url: '/api/opening_hours/pub/' + pubId + '/day/' + day,
        type: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            const div = $(`#day-${day}`);
            div.find('.open').val('');
            div.find('.close').val('');
            blankStyles(day);
        },
        error: (response) => {
      
        }
    });
}

function setupBtnCalls() {
    // Assign calls to button to each day
    for(let i = 1; i <= 7; i++) {
        const div = $(`#day-${i}`);
        div.find('.btn-open').click(() => open(i));
        div.find('.btn-close').click(() => close(i));
        div.find('.btn-change').click(() => edit(i));
        div.find('.btn-save').click(() => save(i));
        div.find('.btn-create').click(() => post(i));
        div.find('.btn-discard').click(() => discard(i));
    };
}

function populateData(opening_hours) {
    let days = [0, 0, 0, 0, 0, 0, 0];
    opening_hours.forEach(o_h => {
        const dayDiv = $(`#day-${o_h.day}`);
        dayDiv.find('.open').val(o_h.open);
        dayDiv.find('.close').val(o_h.close);
        fullStyles(o_h.day);
        days[o_h.day - 1] = 1;
    });
    M.updateTextFields();

    for(let i = 0; i < days.length; i++) {
        if (days[i] == 0) {
            blankStyles(i + 1);
        }
    };
}
 
function open(day) {
    const div = $(`#day-${day}`);
    div.find('.open').val('10:00');
    div.find('.close').val('23:00');

    createStyles(day);
}

function close(day) {
    deleteOpeningHours(day);
}

function edit(day) {
    editStyles(day);
}

function post(day) {
    postOpeningHours(day);
}

function save(day) {
    editOpeningHours(day);
}

function discard(day) {
    getOpeningTimesDay(day);
}


function blankStyles(day) {
    const div = $(`#day-${day}`);
    div.find('.btn-open').css('display', 'inline-block');
    div.find('.btn-close').css('display', 'none');
    div.find('.btn-change').css('display', 'none');
    div.find('.btn-save').css('display', 'none');
    div.find('.btn-discard').css('display', 'none');
    div.find('.btn-create').css('display', 'none');

    div.find('.open-label').html('N/A');
    div.find('.close-label').html('N/A');

    M.updateTextFields();
}

function fullStyles(day) {
    const div = $(`#day-${day}`);
    div.find('.btn-open').css('display', 'none');
    div.find('.btn-close').css('display', 'inline-block');
    div.find('.btn-change').css('display', 'inline-block');
    div.find('.btn-save').css('display', 'none');
    div.find('.btn-discard').css('display', 'none');
    div.find('.btn-create').css('display', 'none');

    div.find('.open-label').html('Opening');
    div.find('.close-label').html('Closing');

    
    div.find('.open').attr('disabled', '');
    div.find('.close').attr('disabled', '');
    
    M.updateTextFields();
}

function editStyles(day) {
    const div = $(`#day-${day}`);
    div.find('.btn-open').css('display', 'none');
    div.find('.btn-close').css('display', 'none');
    div.find('.btn-change').css('display', 'none');
    div.find('.btn-save').css('display', 'inline-block');
    div.find('.btn-discard').css('display', 'inline-block');
    div.find('.btn-create').css('display', 'none');

    div.find('.open-label').html('Opening');
    div.find('.close-label').html('Closing');

    div.find('.open').removeAttr('disabled');
    div.find('.close').removeAttr('disabled');

    M.updateTextFields();
}

function createStyles(day) {
    const div = $(`#day-${day}`);
    div.find('.btn-open').css('display', 'none');
    div.find('.btn-close').css('display', 'none');
    div.find('.btn-change').css('display', 'none');
    div.find('.btn-save').css('display', 'none');
    div.find('.btn-discard').css('display', 'inline-block');
    div.find('.btn-create').css('display', 'inline-block');

    div.find('.open-label').html('Opening');
    div.find('.close-label').html('Closing');

    div.find('.open').removeAttr('disabled');
    div.find('.close').removeAttr('disabled');

    M.updateTextFields();
}