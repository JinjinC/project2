$(function(){
    function pageLoad(){
        
        nv.addGraph(function() {

            var chart = nv.models.lineChart()
                .useInteractiveGuideline(true)
                .margin({top: 0, bottom: 25, left: 25, right: 0})
                //.showLegend(false)
                .color([
                    $blue, $red, $orange
                ]);

            chart.legend.margin({top: 3});

            chart.yAxis
                .showMaxMin(false)
                .tickFormat(d3.format(',.f'));

            chart.xAxis
                .showMaxMin(false)
                .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });
            var data = testData(['A ', 'B ','C'], 30);
            data[0].area = true;

            d3.select('#visits-chart6 svg')
                .datum(data)
                .transition().duration(500)
                .call(chart);

            PjaxApp.onResize(chart.update);

            return chart;
        });

        // Notification link click handler.
        // JUST FOR DEMO.
        // Can be removed.

        function close(e){
            var $settings = $("#settings"),
                $popover = $settings.siblings(".popover");
            if(!$.contains($popover[0], e.target)){
                $settings.popover('hide');
                $(document).off("click", close);
            }
        }
        $("#notification-link").click(function(){
            if ( $(window).width() > 767){
                $("#settings").popover('show');
                $(document).on("click", close);
                return false;
            }
        });

        $("#feed").slimscroll({
            height: 'auto',
            size: '5px',
            alwaysVisible: true,
            railVisible: true
        });

        $("#chat-messages").slimscroll({
            height: '240px',
            size: '5px',
            alwaysVisible: true,
            railVisible: true
        });

        $('.widget').widgster();
    }

    pageLoad();

    PjaxApp.onPageLoad(pageLoad);

    $('.card-header>ul>li').click(function  () {
        setTimeout(function  () {
                           pageLoad();
                       },500);
    });

    $('.dd-handle,.trans-name,.trace-name,.tab_link,.trace-name-in-transaction,.type-link-chart').click(function () {
        
        setTimeout(function  () {
                    pageLoad();
                },100);
    });


});

