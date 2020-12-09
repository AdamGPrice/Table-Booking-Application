$(() => {
    $("#submit-info").click(( event ) => {
        event.preventDefault();
        const first_name = $('#first-name').val();
        const last_name = $('#last-name').val();
        const phone = $('#phone').val();

        const account = JSON.parse(localStorage.getItem('account'));

        if (first_name && phone) {
            user_info = { first_name, last_name, phone };

            $.ajax({
                url: '/api/user_info',
                type: 'POST',
                data: JSON.stringify(user_info),
                contentType: "application/json;charset=utf-8",
                headers: {
                    Authorization: 'Bearer ' + account.token
                },
                success: (data) => {
                    window.location.href = "/";
                },
                error: (response) => {
                    console.log(response);        
                }
            });
        }
    });
});