$(() => {
    getAllTables();
    // enable select css
    $('select').formSelect();
    $('.modal').modal();
    $('#new-table-btn').click(postTable);
});

function getAllTables() {
    const pubId = localStorage.getItem('pubId');
    $.ajax({
        url: '/api/tables/pub/' + pubId,
        type: 'GET',
        success: (data) => {
            populateData(data)
        },
        error: (response) => {
            console.log(response);
        }
    });
}

function postTable() {
    const account = JSON.parse(localStorage.getItem('account'));
    const pubId = localStorage.getItem('pubId');

    const opening_hours = { 
        pub_id: pubId, 
        table_num: $('#form-number').val(),
        seats: $('#form-capacity').val(),
        is_outside: $('#form-is_oustide').val()
    };

    $.ajax({
        url: '/api/tables',
        type: 'POST',
        data: JSON.stringify(opening_hours),
        contentType: "application/json;charset=utf-8",
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            getAllTables();
        },
        error: (response) => {
            if (response.status == 409) 
            {
                alert('Error: Table number is already in use.')
            }
        }
    });
}

function deleteTable(number) {
    const account = JSON.parse(localStorage.getItem('account'));
    const pubId = localStorage.getItem('pubId');

    $.ajax({
        url: '/api/tables/pub/' + pubId + '/table/' + number,
        type: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            getAllTables()
        },
        error: (response) => {
      
        }
    });
}

function populateData(tables) {
    const tableBody = $('#table-body');
    tableBody.html('');
    if (tables.length != 0) {
        tables.forEach(table => {
            const row = $('<tr>');
            row.append($('<td>').append(`<p>${table.table_num}</p>`));
            row.append($('<td>').append(`<p>${table.seats}</p>`));
            row.append($('<td>').append(`<p>${table.is_outside ? "Outside" : "Inside"}</p>`));
            // Button
            row.append($('<td>').append(`<a class="waves-effect waves-light btn red darken-2" id="delete-btn-${table.table_num}">Delete</a>`));
            tableBody.append(row);
            $(`#delete-btn-${table.table_num}`).click(() => {
                deleteTable(table.table_num);
            });
        });
        const nextTable = tables[tables.length - 1].table_num + 1;
        $('#form-number').val(nextTable);
    } else {
        $('#form-number').val(1);
    }
}