$(async () => {
    // Check if a pub is registered to this account
    const account = JSON.parse(localStorage.getItem('account'));
    const pub = await hasPub(account);
    if (pub) {
        // Save the pub id
        localStorage.setItem('pubId', pub.id);
        window.location.href = "/business/dashboard/details"
    }
});

async function hasPub(account) {
    const { id } = account;
    let pub;
    await $.ajax({
        url: '/api/pubs/byowner/' + id,
        type: 'GET',
        success: (data) => {
            console.log(data)
            pub = data;
        },
        error: (response) => {
            // If no pub exists redirect the user to register their business
            if (response.status == 404) {
                window.location.href = "/business/register";
            }        
        }
    });
    return pub;
}