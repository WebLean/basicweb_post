//jQuery

$(function() {
    function get2digits (num) {
        return ('0' + num).slice(-2);
    }

    function getDate(dateObj) {
        if (dateObj instanceof Date)
            return dateObj.getFullYear() + '-' + get2digits(dateObj.getMonth()+1) + '-' + get2digits(dateObj.getDate());
    }

    function getTime(dateObj) {
        if (dateObj instanceof Date)
            return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes()) + ":" + get2digits(dateObj.getSeconds());
    }

    function convertDate() {
        $('[date-date]').each(function(index, element) {
            let dateString = $(element).date('date');
            if (dateString) {
                let date = new Date(dateString);
                $(element).html(getDate(date));
            }
        });
    }

    function convertDateTime() {
        $('[date-date-time]').each(function(index, element) {
            let dateString = $(element).date('date-time');
            if (dateString) {
                let date = new Date(dateString);
                $(element).html(getDate(date) + ' ' + getTime(date));
            }
        });
    }

    convertDate();
    convertDateTime();
})