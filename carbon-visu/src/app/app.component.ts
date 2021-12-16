import { AfterViewInit, Component, ViewChild } from '@angular/core';
import * as mqtt from 'mqtt';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { prototype } from 'events';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'ng-visu';

  ngAfterViewInit() {

    // Create root element
    const root = am5.Root.new("chartdiv");
    console.log(root);
    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the map chart
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoEqualEarth()
      })
    );

    const cont = chart.children.push(
      am5.Container.new(root, {
        layout: root.horizontalLayout,
        x: 20,
        y: 40
      })
    );

    // Create series for background fill
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
      fill: root.interfaceColors.get("alternativeBackground"),
      fillOpacity: 0,
      strokeOpacity: 0
    });

    // Add background polygon
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });

    // Create main polygon series for countries
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow
      })
    );

    // graticule series
    var graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
    graticuleSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get("alternativeBackground"),
      strokeOpacity: 0.0
    });


    // Create line series for trajectory lines
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
    const lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    lineSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get("alternativeBackground"),
      strokeOpacity: 0.8
    });

    // Create point series for markers
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    function addLocation(location: any, name: any) {
      return pointSeries.pushDataItem({
        latitude: location.latitude,
        longitude: location.longitude
      });
    }

    // Make stuff animate on load
    chart.appear(1000, 100);


    // create a client
    let client = mqtt.connect('ws://127.0.0.1', {
      protocolId: 'MQIsdp',
      protocolVersion: 3,
      port: 1885,
      clean: true,
    })

    client.subscribe('/path');

    client.on('message', (topic, message) => {
      // message is Buffer


      //while(bullet = pointSeries.bullets.pop()) {}

      pointSeries.bullets.push(function () {
        const circle = am5.Circle.new(root, {
          radius: 7,
          tooltipText: "Drag me!",
          cursorOverStyle: "pointer",
          tooltipY: 0,
          fill: am5.color(0xffba00),
          stroke: root.interfaceColors.get("background"),
          strokeWidth: 2,
          draggable: false
        });
  
        return am5.Bullet.new(root, {
          sprite: circle
        });
      });


      function getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
      }
      function getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      var pathList = JSON.parse(message.toString());
      console.log(pathList.path.length); 
      let list = [];
      let n = 0;
      while (n < pathList.path.length) {
        console.log(pathList.path[n].latitude);
        console.log(pathList.path[n].longitude);
        console.log(pathList.path[n].name);
        var entry = addLocation({ latitude: pathList.path[n].lat, longitude: pathList.path[n].long }, pathList.path[n].name);
        //var entry = addLocation({ latitude: getRandomArbitrary(0, 60), longitude: getRandomArbitrary(0, -100) }, "Paris");
        list.push(entry);
        n++;
      }

      const lineDataItem = lineSeries.pushDataItem({
        pointsToConnect: list
      });


      const planeSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

      const plane = am5.Graphics.new(root, {
        svgPath:
          "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
        scale: 0.08,
        centerY: am5.p50,
        centerX: am5.p50,
        fill: am5.color(0x000000)
      });
  
      planeSeries.bullets.push(function () {
        const container = am5.Container.new(root, {});
        container.children.push(plane);
        return am5.Bullet.new(root, { sprite: container });
      });

      const planeDataItem = planeSeries.pushDataItem({
        lineDataItem: lineDataItem,
        positionOnLine: 0,
        autoRotate: true
      });


      planeDataItem.animate({
        key: "positionOnLine",
        to: 1,
        duration: pathList.duration,
        loops: 1,
        easing: am5.ease.linear
      });

      planeDataItem.on("positionOnLine", function (value: any) {
        if (value >= 0.9999) {
          plane.set("rotation", 180);
        } else if (value <= 0.0001) {
          plane.set("rotation", 0);
        }
      });

    })

  //  setInterval(test, 10000);

      function test(){

          console.log("cleared...")
          pointSeries.bullets.clear()
          lineSeries.mapLines.clear();
          //plane;
          lineSeries.mapLines.autoDispose

      }

  }

}
