$(() => {
    getPictures();
    setupUploadButton();
});

function getPictures() {
    const pubId = localStorage.getItem('pubId');
    $.ajax({
        url: '/api/pictures/pub/' + pubId,
        type: 'GET',
        success: (data) => {
            displayPictures(data);
        },
        error: (response) => {
            
        }
    });
}

function displayPictures(pics) {
    const box = $('#pictures-box');
    box.html('');
    pics.forEach(pic => {
        const img = $(`<div class="col s3">
                            <div class="image-box">
                                <img class="materialboxed" width="100%" src="/uploads/${pic.name}"></img>
                            </div>
                            <a class="waves-effect waves-light btn red darken-2" id="${pic.name}">Delete</a>
                        </div>`); 
        box.append(img);
        const fixedName = pic.name.split('.').join('\\.');
        $(`#${fixedName}`).click(() => {
            deletePicture(pic.name);
        });
    });
    $('.materialboxed').materialbox();
}

function deletePicture(name) {
    const account = JSON.parse(localStorage.getItem('account'));
    const pubId = localStorage.getItem('pubId');

    $.ajax({
        url: '/api/pictures/pub/' + pubId + '/image/' + name,
        type: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + account.token
        },
        success: (data) => {
            getPictures()
        },
        error: (response) => {
      
        }
    });
}

function setupUploadButton() {
    $('#upload-btn').on('click', function () {
        const account = JSON.parse(localStorage.getItem('account'));
        const pubId = localStorage.getItem('pubId');
    
        $.ajax({
            // Your server script to process the upload
            url: '/api/pictures/pub/' + pubId,
            type: 'POST',
        
            // Form data
            data: new FormData($('form')[0]),
            headers: {
                Authorization: 'Bearer ' + account.token
            },
            success: (data) => {
                $('#file').val('');
                $('#file-text').val('');
                getPictures();
            },
            error: (response) => {
                alert(response.responseText);
            },
        
            // Tell jQuery not to process data or worry about content-type
            // You *must* include these options!
            cache: false,
            contentType: false,
            processData: false,
        
            // Custom XMLHttpRequest
            xhr: function () {
                const myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    // For handling the progress of the upload
                    myXhr.upload.addEventListener('progress', function (e) {
                        if (e.lengthComputable) {
                            $('progress').attr({
                                value: e.loaded,
                                max: e.total,
                            });
                        }
                    }, false);
                }
                return myXhr;
            }
        });
    });
}
