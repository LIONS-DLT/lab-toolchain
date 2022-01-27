import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as mqtt from 'mqtt';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-cap-and-trade-widget',
  templateUrl: './cap-and-trade-widget.component.html',
  styleUrls: ['./cap-and-trade-widget.component.css']
})
export class CapAndTradeWidgetComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {


    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("barchartdiv");

    var init_legend = true;

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout
    }));

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));

    var data = [{
      "actor": "Farmer",
      "cap": 2.5,
      "offset": 2.5
    }, {
      "actor": "Logistics",
      "cap": 2.6,
      "offset": 2.7
    }, {
      "actor": "Production",
      "cap": 2.8,
      "offset": 2.9
    }, {
      "actor": "Retail",
      "cap": 2.8,
      "offset": 2.9
    }]


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "actor",
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    }));

    xAxis.data.setAll(data);
    let yRenderer = xAxis.get("renderer");
    yRenderer.labels.template.setAll({
      fill: am5.color(0x000000),
      fontSize: 24
    });

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));


    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    var legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }));

    var cap_series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "CO2 cap",
      stacked: true,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "cap",
      categoryXField: "actor"
    }));

    var offset_series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "CO2 offset",
      stacked: true,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "offset",
      categoryXField: "actor"
    }));

    cap_series.columns.template.setAll({
      tooltipText: "{name}, {categoryX}: {valueY}",
      tooltipY: am5.percent(10)
    });

    offset_series.columns.template.setAll({
      tooltipText: "{name}, {categoryX}: {valueY}",
      tooltipY: am5.percent(10)
    });

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(init_legend: boolean, name: any, message: JSON) {
   
      cap_series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true
          })
        });
      });
      offset_series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true
          })
        });
      });


      var json_string = JSON.stringify(message);
      var abc = JSON.parse(json_string);
      console.log(abc);
      cap_series.data.setAll(abc);
      offset_series.data.setAll(abc);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      cap_series.appear();
      offset_series.appear();


 if (init_legend == true) {
      
        legend.data.push(cap_series);
        legend.data.push(offset_series);
        legend.labels.template.setAll({
          fontSize: 26,
          fontWeight: "300"
        });
 }
     /* }else{

      console.log(cap_series.data);
        cap_series.data.setIndex(1, {
          category: "cap",
          value: 5
        });

        offset_series.data.setIndex(1, {
          category: "offset",
          value: 5
        });
      }*/
      
    }

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);

    // create a client
    let client = mqtt.connect('ws://127.0.0.1', {
      protocolId: 'MQIsdp',
      protocolVersion: 3,
      port: 1885,
      clean: true,
    })

    client.subscribe('/path');
    client.subscribe('/carbon');
    client.subscribe('/carbon/logistics');
    client.subscribe('/carbon/retail');
    client.subscribe('/carbon/production');
    client.subscribe('/carbon/compensation');

    client.on('message', (topic, message) => {
      console.log(topic);

      if (topic.toString() == "/carbon") {

        var data = [{
          "actor": "Farmer",
          "cap": 1,
          "offset": 2.5
        }, {
          "actor": "Logistics",
          "cap": 1,
          "offset": 2.7
        }, {
          "actor": "Production",
          "cap": 1,
          "offset": 2.9
        }, {
          "actor": "Retail",
          "cap": 1,
          "offset": 2.9
        }]

        var msg_json = JSON.parse(message.toString());
        makeSeries(init_legend, "farmer", msg_json);
        
        if (init_legend == false){

        }
        
        
        init_legend = false;

        /* makeSeries(init_legend, "Logistics", "Logistics",msg_json);
         makeSeries(init_legend, "Production", "Production",msg_json);
         makeSeries(init_legend, "Retail", "Retail",msg_json);*/

        /* makeSeries(init_legend, "Europe", "europe");
         makeSeries(init_legend, "North America", "namerica");
         makeSeries(init_legend, "Asia", "asia");
         makeSeries(init_legend, "Latin America", "lamerica");
         makeSeries(init_legend, "Middle East", "meast");
         makeSeries(init_legend, "Africa", "africa"); */

      }

    })



  }

}
