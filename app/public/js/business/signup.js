$(() => {
    $("#login").click(( event ) => {
        event.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        if (email && password) {
            credentials = { email, password }

            $.ajax({
                url: '/api/owners',
                type: 'POST',
                data: JSON.stringify(credentials),
                contentType: "application/json;charset=utf-8",
                success: (data) => {
                    // Authenticate the user once they have created an account
                    AuthenticateUser(email, password);
                },
                error: (response) => {
                    console.log(response);        
                }
            });
        }
    });
});

function AuthenticateUser(email, password) {
    credentials = { type: 'owner', email, password }
    $.ajax({
        url: '/api/auth',
        type: 'POST',
        data: JSON.stringify(credentials),
        contentType: "application/json;charset=utf-8",
        success: (data) => {
            console.log(data)
            localStorage.setItem('account', JSON.stringify(data));
            window.location.href = "/";
        },
        error: (response) => {
            console.log(response);        
        }
    });
}
