$(() => {
    setup();
});

function setup() {
    $('#pub-search').bind("enterKey", nameSearch);
    $('#pub-search').keyup(function(e) {
        if(e.keyCode == 13) $(this).trigger("enterKey");
    });
    $('#search-btn').click(nameSearch);
    $('#clear-btn').click(clearSearch);
    
    const params = new URLSearchParams(window.location.search);
    for (let i = 1; i <= 8; i++) {
        $(`#day-btn-${i}`).click(() => {
            if (params.get('d') != i) {
                params.set('d', i);
            } else {
                params.delete('d');
            }
            window.location.href = window.location.origin + window.location.pathname + "?" + params.toString();
        });
    }

}

function nameSearch() {
    const value = $('#pub-search').val();
    
    const params = new URLSearchParams(window.location.search);
    if (value) {
        params.set('q', value);
        window.location.href = window.location.origin + window.location.pathname + "?" + params.toString();
    } else {
        clearSearch();
    }
}

function clearSearch() {
    const params = new URLSearchParams(window.location.search);
    params.delete('q');
    window.location.href = window.location.origin + window.location.pathname + "?" + params.toString();
}