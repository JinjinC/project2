$(function () {
    function pageLoad () {

        // Date Range Picker init
        $('#daterangepicker').daterangepicker({
        timePicker: true, 
        timePickerIncrement: 30, 
        format: 'MM/DD/YYYY h:mm A',
        ranges: {
            '30 min': [moment().subtract('minute', 30), moment()],
            '60 min': [moment().subtract('hour', 1), moment()],
            '3 hour': [moment().subtract('hour', 3), moment()],
            '6 hour': [moment().subtract('hour', 6), moment()],
            '12 hour': [moment().subtract('hour',12), moment()],
            '1 day': [moment().subtract('days', 1), moment()],
            '3 day': [moment().subtract('days', 3), moment()],
            '7 day': [moment().subtract('days', 7), moment()],
            '15 day': [moment().subtract('days', 15), moment()]
        },
        opens: 'right',
        startDate: moment().subtract('days', 29),
        endDate: moment()
        },
        function(start, end) {
            $('#daterangepicker span').html(start.format('MM/DD/YYYY h:mm A') + ' - ' + end.format('MM/DD/YYYY h:mm A'));
        }),
        function() {

        };

    }

    pageLoad();

    PjaxApp.onPageLoad(pageLoad);
}); 


