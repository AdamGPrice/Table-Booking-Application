$(() => {
    $("#login").click(( event ) => {
        event.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        if (password.length < 7) {
            $('#error-msg').css('display', 'block');
            $('#error-msg').html('Password needs to be 7 characters long.');
        } else {
            if (email && password) {
                credentials = { email, password };
    
                $.ajax({
                    url: '/api/users',
                    type: 'POST',
                    data: JSON.stringify(credentials),
                    contentType: "application/json;charset=utf-8",
                    success: (data) => {
                        // Authenticate the user once they have created an account
                        AuthenticateUser(email, password);
                    },
                    error: (response) => {
                        if (response.status == 409) {
                            $('#error-msg').css('display', 'block');
                            $('#error-msg').html('That email is already taken.');
                        }
                        console.log(response);        
                    }
                });
            }
        }
    });
});

function AuthenticateUser(email, password) {
    credentials = { type: 'user', email, password };
    $.ajax({
        url: '/api/auth',
        type: 'POST',
        data: JSON.stringify(credentials),
        contentType: "application/json;charset=utf-8",
        success: (data) => {
            console.log(data)
            localStorage.setItem('account', JSON.stringify(data));
            window.location.href = "/user_info";
        },
        error: (response) => {
            console.log(response);        
        }
    });
}
