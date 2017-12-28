$(document).ready(function () {

    $('#button-newest').click(function(e) {
        e.preventDefault();
        $.ajax({
            url: 'http://localhost:3000/copyNewest',
            type: 'POST'
        }).done(() => {

        });
        getProgress();
    });

    function getProgress() {
        const progressbar = $('.progress');
        var barwidth = progressbar.width();
        var parentwidth = progressbar.offsetParent().width();
        var percent = 100*barwidth/parentwidth;
        $('#button-newest').prop('disabled', true);
        $.ajax({
            url: "http://localhost:3000/progress",
            type: 'GET',
            crossDomain: true

        }).done((data) => {
            percent = data;
            barwidth = progressbar.width();
            parentwidth = progressbar.offsetParent().width();
            progressbar.width(percent * (parentwidth/100)-2);
            if(percent <= 95) {
                getProgress();
            } else {
                $('#button-newest').prop('disabled', false);
            }
        });

    }

});
