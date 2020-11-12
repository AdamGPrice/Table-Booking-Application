$(() => {
    const account = JSON.parse(localStorage.getItem('account'));
    if (account != null) {
        // Check if the token is still valid

        // if token is still valid then do this
        console.log(account);
        setupNavBar(account);
        
    } else {
        // Unathenticated
    }

    $("#signoutBtn").click(( event ) => {
        signoutAccount();
    });
});

function signoutAccount() {
    const account = JSON.parse(localStorage.getItem('account'));
    localStorage.removeItem('account');
    if (account.type == "user") {
        window.location.href = "/";
    } else {
        window.location.href = "/business/login";
    }
}

function setupNavBar(account) {
    // If the user is logged in configure the nav bar
    const accountBtn = $("#accountBtn");
    const signoutBtn = $("#signoutBtn");
    const signinBtn = $("#signinBtn");

    accountBtn.css('display', 'block');
    signoutBtn.css('display', 'block');
    signinBtn.css('display', 'none');

    if (account.type == "owner") {
        accountBtn.html("Dashboard");
        accountBtn.attr("href", "/business/dashboard");

        const logoBtn = $("#logoBtn");
        logoBtn.html("Dashboard");
        logoBtn.attr("href", "/business/dashboard");
    }
}