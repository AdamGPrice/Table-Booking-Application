$(() => {
    $('#details-confirm-btn').click(postPubDetails);
});

function postPubDetails() {
    const account = JSON.parse(localStorage.getItem('account'));

    const details = { 
        name: $('#form-name').val(), 
        description: $('#form-description').val(),
        email: $('#form-email').val(),
        phone: $('#form-number').val()
    };

    console.log(details);

    $.ajax({
        url: '/api/pubs',
        type: 'POST',
        data: JSON.stringify(details),
        contentType: "application/json;charset=utf-8",
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            window.location.href = '/business/dashboard';
        },
        error: (response) => {
            console.log(response);
        }
    });
}