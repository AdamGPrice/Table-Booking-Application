$(() => {
    $('#address-confirm-btn').click(postAddress);
});

function postAddress() {
    console.log('hello');
    const account = JSON.parse(localStorage.getItem('account'));
    const pubId = localStorage.getItem('pubId');

    const address = { 
        pub_id: pubId,
        line_1: $('#form-line_1').val(), 
        line_2: $('#form-line_2').val(),
        town: $('#form-town').val(),
        country: $('#form-country').val(),
        postcode: $('#form-postcode').val()
    };

    $.ajax({
        url: '/api/addresses',
        type: 'POST',
        data: JSON.stringify(address),
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