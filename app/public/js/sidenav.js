$(() => {
    $('.sidenav').sidenav();

    const account = JSON.parse(localStorage.getItem('account'));
    if (account != null) {
        console.log(account);
        configureSideNav(account);
    } else {
        // Unathenticated
    }

    $("#logout-btn").click(( event ) => {
        signoutAccount();
    });
});

function signoutAccount() {
    const account = JSON.parse(localStorage.getItem('account'));
    localStorage.removeItem('account');
    window.location.href = "/";
}

function configureSideNav(account) {
    $('#business-links').css('display', 'none');
    $('#signin-btn').css('display', 'none');

    $('#loggedin-div').css('display', 'block');
}