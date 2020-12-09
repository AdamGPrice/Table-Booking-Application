$(() => {
    getUserInfo();
    $('#make-changes-btn').click(updateUserInfo);
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
        },
        error: (response) => {
            console.log(response);
        }
    });
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