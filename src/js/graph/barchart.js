$(function(){
    function pageLoad(){
        var testData = window.testData(['', '', '', ''],
                25),// just 25 points, since there are lots of charts
            pieFooter = d3.select("#data-chart-footer"),
            stackedChart,
            lineChart,
            pieChart,
            barChart;


        // test Data.
        //use if needed
        function sinAndCos() {
            var sin = [],
                cos = [];

            for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) }); //the nulls are to show how defined works
                cos.push({x: i, y: .5 * Math.cos(i/10)});
            }
            return [
                {
                    area: true,
                    values: sin,
                    key: "Sine Wave"
                },
                {
                    values: cos,
                    key: "Cosine Wave"
                }
            ];
        }

        nv.addGraph(function(){
            var chart = nv.models.multiBarChart()
                .margin({left: 30, bottom: 20, right: 0})
                .color(keyColor)
                .controlsColor([$white, $white, $white])
                .showLegend(false);

            chart.yAxis
                .showMaxMin(false)
                .ticks(0)
                .tickFormat(d3.format(',.f'));

            chart.xAxis
                .showMaxMin(false)
                .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

            d3.select('#sources-chart-bar svg')
                .datum(testData)
                .transition().duration(500).call(chart);

            PjaxApp.onResize(chart.update);

            barChart = chart;

            return chart;
        });
        

        
        function getData() {
            var arr = [],
                theDate = new Date(2012, 1, 1, 0, 0, 0, 0),
                previous = Math.floor(Math.random() * 100);
            for (var x = 0; x < 30; x++) {
                var newY = previous + Math.floor(Math.random() * 5 - 2);
                previous = newY;
                arr.push({x: new Date(theDate.getTime()), y: newY});
                theDate.setDate(theDate.getDate() + 1);
            }
            return arr;
        }

    }

    pageLoad();

    PjaxApp.onPageLoad(pageLoad);

});