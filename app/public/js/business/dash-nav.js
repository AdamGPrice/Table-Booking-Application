$(() => {
    $('#signout-btn').click(() => {
        localStorage.removeItem('account');
        localStorage.removeItem('pubId');
        window.location.href = "/";
    });
});