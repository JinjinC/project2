$(function(){
    function pageLoad(){
        var testData = window.testData(['Search', 'Referral', 'Direct', 'Organic'],
                25),// just 25 points, since there are lots of charts
            pieSelect = d3.select("#sources-chart-pie"),
            pieFooter = d3.select("#data-chart-footer"),
            stackedChart,
            lineChart,
            pieChart,
            barChart;

        function pieChartUpdate(d){
            d.disabled = !d.disabled;
            d3.select(this)
                .classed("disabled", d.disabled);
            if (!pieChart.pie.values()(testData).filter(function(d) { return !d.disabled }).length) {
                pieChart.pie.values()(testData).map(function(d) {
                    d.disabled = false;
                    return d;
                });
                pieFooter.selectAll('.control').classed('disabled', false);
            }
            d3.select("#sources-chart-pie svg").transition().call(pieChart);
        }

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

        nv.addGraph(function() {
            var chart = nv.models.lineChart()
                .margin({top: 0, bottom: 25, left: 30, right: 0})
                .showLegend(false)
                .color(keyColor);

            chart.yAxis
                .showMaxMin(false)
                .tickFormat(d3.format(',.f'));

            chart.xAxis
                .showMaxMin(false)
                .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

            //just to make it look different
            testData[0].area = true;
            testData[3].area = true;

            d3.select('#sources-chart-line svg')
                //.datum(sinAndCos())
                .datum(testData)
                .transition().duration(500)
                .call(chart);

            PjaxApp.onResize(chart.update);
            lineChart = chart;

            return chart;
        });

        nv.addGraph(function() {
            var chart = nv.models.lineChart()
                .margin({top: 0, bottom: 25, left: 30, right: 0})
                .showLegend(false)
                .color(keyColor);

            chart.yAxis
                .showMaxMin(false)
                .tickFormat(d3.format(',.f'));

            chart.xAxis
                .showMaxMin(false)
                .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

            //just to make it look different
            testData[0].area = true;
            testData[3].area = true;

            d3.select('#sources-chart-line1 svg')
                //.datum(sinAndCos())
                .datum(testData)
                .transition().duration(500)
                .call(chart);

            PjaxApp.onResize(chart.update);
            lineChart = chart;

            return chart;
        });

        nv.addGraph(function() {
            var chart = nv.models.lineChart()
                .margin({top: 0, bottom: 25, left: 30, right: 0})
                .showLegend(false)
                .color(keyColor);

            chart.yAxis
                .showMaxMin(false)
                .tickFormat(d3.format(',.f'));

            chart.xAxis
                .showMaxMin(false)
                .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

            //just to make it look different
            testData[0].area = true;
            testData[3].area = true;

            d3.select('#sources-chart-line2 svg')
                //.datum(sinAndCos())
                .datum(testData)
                .transition().duration(500)
                .call(chart);

            PjaxApp.onResize(chart.update);
            lineChart = chart;

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