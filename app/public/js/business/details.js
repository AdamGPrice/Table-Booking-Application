// Page Setup
$(async () => {
    hideNavFooter();
    getPubDetails();
    getAddressDetails();
    btnSetup();
});

function btnSetup() {
    // Pub details Buttons
    $('#details-changes-btn').click(() => {
        openDetailsForm();
    });

    $('#details-discard-btn').click(() => {
        closeDetailsForm();
        getPubDetails();
    });

    $('#details-save-btn').click(() => {
        changePubDetails();
    });

    // Address Buttons
    $('#address-changes-btn').click(() => {
        openAddressForm();
    });

    $('#address-discard-btn').click(() => {
        closeAddressForm();
        getAddressDetails();
    });

    $('#address-save-btn').click(() => {
        changeAddressDetails();
    });
}

function hideNavFooter() {
    $('nav').css('display', 'none');
    $('footer').css('display', 'none');
}

// Pub Details Functions /////////////////////////////////////////////////////////////////////

function getPubDetails() {
    const pubId = localStorage.getItem('pubId');
    $.ajax({
        url: '/api/pubs/' + pubId,
        type: 'GET',
        success: (data) => {
            fillOutDetailsForm(data);
        },
        error: (response) => {
            // If no pub exists redirect the user to register their business
            if (response.status == 404) {
                window.location.href = '/business/register';
            }        
        }
    });
}

function changePubDetails() {
    const account = JSON.parse(localStorage.getItem('account'));
    const pubId = localStorage.getItem('pubId');
    // get the pub data from form and put 
    const pub = {
        name: $('#form-name').val(),
        description: $('#form-description').val(),
        email: $('#form-email').val(),
        phone: $('#form-number').val()
    };

    $.ajax({
        url: '/api/pubs/' + pubId,
        type: 'PUT',
        data: JSON.stringify(pub),
        contentType: "application/json;charset=utf-8",
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            closeDetailsForm();
        },
        error: (response) => {
            console.log(response);
        }
    });
}

function fillOutDetailsForm(pub) {
    $('#form-name').val(pub.name);
    $('#form-description').val(pub.description);
    $('#form-email').val(pub.email);
    $('#form-number').val(pub.phone);
    M.textareaAutoResize($('#form-description'));
    M.updateTextFields();
}

function openDetailsForm() {
    $('#form-name').removeAttr('disabled');
    $('#form-description').removeAttr('disabled');
    $('#form-email').removeAttr('disabled');
    $('#form-number').removeAttr('disabled');
    $('#details-changes-btn').css('display', 'none');
    $('#details-discard-btn').css('display', 'inline-block');
    $('#details-save-btn').css('display', 'inline-block');
}

function closeDetailsForm() {
    $('#form-name').attr('disabled', '');
    $('#form-description').attr('disabled', '');
    $('#form-email').attr('disabled', '');
    $('#form-number').attr('disabled', '');
    $('#details-changes-btn').css('display', 'inline-block');
    $('#details-discard-btn').css('display', 'none');
    $('#details-save-btn').css('display', 'none');
}

// Address Functions /////////////////////////////////////////////////////////////////////////

function getAddressDetails() {
    const pubId = localStorage.getItem('pubId');
    $.ajax({
        url: '/api/addresses/pub/' + pubId,
        type: 'GET',
        success: (data) => {
            fillOutAddressForm(data);
        },
        error: (response) => {
            // If no pub exists redirect the user to register their business
            if (response.status == 404) {
                window.location.href = '/business/register';
            }        
        }
    });
}

function changeAddressDetails() {
    const account = JSON.parse(localStorage.getItem('account'));
    const pubId = localStorage.getItem('pubId');
    // get the pub data from form and put 
    const pub = {
        pub_id: pubId,
        line_1: $('#form-line_1').val(),
        line_2: $('#form-line_2').val(),
        town: $('#form-town').val(),
        country: $('#form-country').val(),
        postcode: $('#form-postcode').val()
    };

    const call = $.ajax({
        url: '/api/addresses',
        type: 'PUT',
        data: JSON.stringify(pub),
        contentType: "application/json;charset=utf-8",
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            closeAddressForm();
        },
        error: (response) => {
            console.log(response);
        }
    });
}

function fillOutAddressForm(address) {
    $('#form-line_1').val(address.line_1);
    $('#form-line_2').val(address.line_2);
    $('#form-town').val(address.town);
    $('#form-country').val(address.country);
    $('#form-postcode').val(address.postcode);
    M.updateTextFields();
}


function openAddressForm() {
    $('#form-line_1').removeAttr('disabled');
    $('#form-line_2').removeAttr('disabled');
    $('#form-town').removeAttr('disabled');
    $('#form-country').removeAttr('disabled');
    $('#form-postcode').removeAttr('disabled');
    $('#address-changes-btn').css('display', 'none');
    $('#address-discard-btn').css('display', 'inline-block');
    $('#address-save-btn').css('display', 'inline-block');
}

function closeAddressForm() {
    $('#form-line_1').attr('disabled', '');
    $('#form-line_2').attr('disabled', '');
    $('#form-town').attr('disabled', '');
    $('#form-country').attr('disabled', '');
    $('#form-postcode').attr('disabled', '');
    $('#address-changes-btn').css('display', 'inline-block');
    $('#address-discard-btn').css('display', 'none');
    $('#address-save-btn').css('display', 'none');
}
