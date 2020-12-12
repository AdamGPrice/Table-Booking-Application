$(() => {
   setup();
});

function setup() {
    $('#pub-search').bind("enterKey", nameSearch);
    $('#pub-search').keyup(function(e) {
        if(e.keyCode == 13) $(this).trigger("enterKey");
    });
    $('#search-btn').click(nameSearch);
}

function nameSearch() {
    const value = $('#pub-search').val();
    if (value) {
        window.location.href = `/search?q=${value}`
    }
    else {
        window.location.href = "/search"
    }
}