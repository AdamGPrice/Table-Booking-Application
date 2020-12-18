$(() => {
    $("#login").click(( event ) => {
        event.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        if (email && password) {
            credentials = { type: 'user', email, password }

            $.ajax({
                url: '/api/auth',
                type: 'POST',
                data: JSON.stringify(credentials),
                contentType: "application/json;charset=utf-8",
                success: (data) => {
                    console.log(data)
                    localStorage.setItem('account', JSON.stringify(data));
                    //const store = localStorage.getItem('user');
                    //console.log(JSON.parse(store));
                    window.location.href = "/";
                },
                error: (response) => {
                    if (response.status == 401) {
                        $('#error-msg').css('display', 'block');
                        $('#error-msg').html('Email and/or password is incorrect.');
                    }
                    console.log(response);      
                }
            });
        }
    });
});
