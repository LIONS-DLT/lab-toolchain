import { AfterViewInit, Component, ViewChild } from '@angular/core';
import * as mqtt from 'mqtt';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'ng-visu';
  private yearOperations = 0;

  ngAfterViewInit() {

    // Create root element
    var root = am5.Root.new("chartdiv");
    console.log(root);
    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the map chart
    var chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoEqualEarth(),
        rotationX: -20,
        rotationY: -5
      })
    );

    var cont = chart.children.push(
      am5.Container.new(root, {
        layout: root.horizontalLayout,
        x: 20,
        y: 40
      })
    );

    // Create series for background fill
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
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
    var polygonSeries = chart.series.push(
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
    var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    lineSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get("alternativeBackground"),
      strokeOpacity: 0.8
    });

    // Create point series for markers
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
    var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

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
    client.subscribe('/clear');

    client.on('message', (topic, message) => {
      // message is Buffer
      console.log(topic.toString());
      if (topic.toString() == "/clear") {
        location.reload();
      }
      if (topic.toString() == "/path") {
        console.log(chart.children.values);
        //while(bullet = pointSeries.bullets.pop()) {}

        pointSeries.bullets.push(function () {
          var circle = am5.Circle.new(root, {
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

        var pathList = JSON.parse(message.toString());
        //console.log(pathList.path.length);
        let list = [];
        let n = 0;
        //creating a list of paths from the json
        while (n < pathList.path.length) {
          // console.log(pathList.path[n].lat);
          // console.log(pathList.path[n].long);
          // console.log(pathList.path[n].name);
          var entry = addLocation({ latitude: pathList.path[n].lat, longitude: pathList.path[n].long }, pathList.path[n].name);
          //var entry = addLocation({ latitude: getRandomArbitrary(0, 60), longitude: getRandomArbitrary(0, -100) }, "Paris");
          list.push(entry);
          n++;
        }
        //creating sub paths from the paths list
        /*   let o = 0;
           while(o < list.length){
           } */

        var lineDataItem = lineSeries.pushDataItem({
          pointsToConnect: list
        });

        var planeSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

        var plane = am5.Graphics.new(root, {
          svgPath:
            "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
          scale: 0.08,
          centerY: am5.p50,
          centerX: am5.p50,
          fill: am5.color(0x000000)
        });

        var ship = am5.Graphics.new(root, {
          svgPath:
            "M434.886,210.701c-1.42-2.506-4.079-4.056-6.96-4.056h-34.625v-16.208c0-4.418-3.582-8-8-8h-24.333V150.52 c0-4.418-3.582-8-8-8h-31.667v-32.281c0-4.418-3.582-8-8-8h-79.667c-4.418,0-8,3.582-8,8v32.281h-31.667c-4.418,0-8,3.582-8,8 v31.917h-24.333c-4.418,0-8,3.582-8,8v31.583h-32.333v-87.5c0-4.418-3.582-8-8-8h-96c-4.418,0-8,3.582-8,8v87.5H8 c-2.875,0-5.529,1.542-6.952,4.041c-1.423,2.498-1.396,5.568,0.071,8.04l48.63,81.985c6.023,10.034,19.391,17.601,31.093,17.601 H345.4c11.703,0,25.071-7.567,31.098-17.607l58.292-97.323C436.27,216.285,436.307,213.208,434.886,210.701z M377.301,206.645h-56 v-8.208h56V206.645z M305.301,198.437v8.314c-13.408,1.063-22.964,10.084-27.404,15.27h-36.262v-23.583H305.301z M344.968,182.437 h-64V158.52h64V182.437z M241.635,118.239h63.667v24.281h-63.667V118.239z M201.968,158.52h63v23.917h-63V158.52z M169.635,198.437 h56v23.583h-56V198.437z M25.301,142.52h80v15.417h-16c-4.418,0-8,3.582-8,8s3.582,8,8,8h16v16.25h-16c-4.418,0-8,3.582-8,8 s3.582,8,8,8h16v15.833h-80V142.52z M362.775,307.852c-3.09,5.147-11.371,9.835-17.375,9.835H80.843 c-6.003,0-14.285-4.688-17.354-9.8L22.047,238.02h91.254h168.5c2.663,0,5.176-1.361,6.662-3.571 c0.08-0.118,8.07-11.804,19.447-11.804h76.056c0.435,0.073,0.879,0.12,1.334,0.12s0.899-0.047,1.334-0.12h27.174L362.775,307.852z",
          scale: 0.08,
          centerY: am5.p50,
          centerX: am5.p50,
          fill: am5.color(0x000000)
        });

        var truck = am5.Graphics.new(root, {
          svgPath:
            "M511.981,222.492c-0.033-2.573-1.021-5.096-2.894-7.009l-96.095-98.118c-1.919-1.958-4.545-3.063-7.287-3.063H10.199 C4.567,114.302,0,118.868,0,124.501v228.606c0,5.633,4.567,10.199,10.199,10.199h26.395c4.626,19.686,22.322,34.392,43.4,34.392 c21.078,0,38.774-14.705,43.401-34.392h208.565c4.626,19.686,22.323,34.392,43.401,34.392s38.774-14.705,43.4-34.392h83.042 c5.632,0,10.199-4.566,10.199-10.199V222.62C512,222.575,511.988,222.535,511.981,222.492z M354.202,134.701h47.217l76.117,77.719 H354.202V134.701z M79.994,377.3c-13.34,0-24.193-10.853-24.193-24.193s10.853-24.193,24.193-24.193 c13.341,0,24.194,10.853,24.194,24.193S93.335,377.3,79.994,377.3z M298.4,342.908H123.395 c-4.626-19.687-22.323-34.392-43.401-34.392c-21.078,0-38.774,14.705-43.4,34.392H20.398v-68.616H298.4V342.908z M298.4,253.893 H20.398V134.701H298.4V253.893z M375.36,377.3c-13.341,0-24.193-10.853-24.193-24.193s10.853-24.193,24.193-24.193 c13.34,0,24.193,10.853,24.193,24.193S388.7,377.3,375.36,377.3z M491.602,253.894H435.04c-5.632,0-10.199,4.566-10.199,10.199 s4.567,10.199,10.199,10.199h56.562v68.616h-72.841c-4.626-19.687-22.322-34.392-43.4-34.392s-38.774,14.705-43.401,34.392H318.8 V134.701h15.004v87.919c0,5.633,4.567,10.199,10.199,10.199h147.599V253.894z",
          scale: 0.08,
          centerY: am5.p50,
          centerX: am5.p50,
          fill: am5.color(0x000000)
        });

        var coffee = am5.Graphics.new(root, {
          svgPath:
            "M31.96,0c14.08,0,26.03,12.61,30.29,30.11c-1.07,0.94-2.12,1.92-3.15,2.95c-9.36,9.36-15.11,20.63-16.82,31.26 c-1.2,7.41-0.44,14.53,2.38,20.54c-2.72,1.63-5.64,2.76-8.69,3.29c5.92-23.37,3.06-34.99-1.37-45.75 c-4.29-10.42-10.11-21.59-3.54-42.39C31.35,0.01,31.66,0,31.96,0L31.96,0z M115.57,26.95c12.48,12.48,8.59,36.61-8.69,53.89 c-15.95,15.95-37.73,20.49-50.8,11.29c20.71-12.34,26.9-22.58,31.38-33.32c4.33-10.4,8.12-22.42,27.47-32.47 C115.14,26.53,115.36,26.74,115.57,26.95L115.57,26.95z M53.98,90.46c-0.34-0.3-0.67-0.61-0.99-0.93 c-12.48-12.48-8.59-36.61,8.69-53.89c16.28-16.28,38.63-20.67,51.6-10.7C92.53,35.42,86.92,44.22,82.36,55.17 C78.08,65.43,73.45,78.58,53.98,90.46L53.98,90.46z M33.31,88.46c-0.45,0.03-0.9,0.04-1.35,0.04C14.31,88.5,0,68.69,0,44.25 C0,21.23,12.7,2.31,28.93,0.2c-7.27,22.08-5.01,32.27-0.5,43.23C32.66,53.72,38.68,66.29,33.31,88.46L33.31,88.46z",
          scale: 0.75,
          centerY: am5.p50,
          centerX: am5.p50,
          fill: am5.color(0x5E361C)
        });


        planeSeries.bullets.push(function () {
          var container = am5.Container.new(root, {});
          container.children.push(coffee);
          return am5.Bullet.new(root, { sprite: container });
        });

        var planeDataItem = planeSeries.pushDataItem({
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

        planeDataItem.on("positionOnLine", (value: any) => {
          if (value >= 0.9) {
            plane.set("rotation", 180);
          } else if (value <= 0.001) {
            plane.set("rotation", 0);
          }
       //   if (value < 0.5 && value > 0.48) {
            //console.log(plane);
            //console.log("changed svg...");
            plane.adapters.add("svgPath", (svgPath) => {
              if (value < 0.5 && value > 0){ 
                console.log("ship");
                svgPath = "M434.886,210.701c-1.42-2.506-4.079-4.056-6.96-4.056h-34.625v-16.208c0-4.418-3.582-8-8-8h-24.333V150.52 c0-4.418-3.582-8-8-8h-31.667v-32.281c0-4.418-3.582-8-8-8h-79.667c-4.418,0-8,3.582-8,8v32.281h-31.667c-4.418,0-8,3.582-8,8 v31.917h-24.333c-4.418,0-8,3.582-8,8v31.583h-32.333v-87.5c0-4.418-3.582-8-8-8h-96c-4.418,0-8,3.582-8,8v87.5H8 c-2.875,0-5.529,1.542-6.952,4.041c-1.423,2.498-1.396,5.568,0.071,8.04l48.63,81.985c6.023,10.034,19.391,17.601,31.093,17.601 H345.4c11.703,0,25.071-7.567,31.098-17.607l58.292-97.323C436.27,216.285,436.307,213.208,434.886,210.701z M377.301,206.645h-56 v-8.208h56V206.645z M305.301,198.437v8.314c-13.408,1.063-22.964,10.084-27.404,15.27h-36.262v-23.583H305.301z M344.968,182.437 h-64V158.52h64V182.437z M241.635,118.239h63.667v24.281h-63.667V118.239z M201.968,158.52h63v23.917h-63V158.52z M169.635,198.437 h56v23.583h-56V198.437z M25.301,142.52h80v15.417h-16c-4.418,0-8,3.582-8,8s3.582,8,8,8h16v16.25h-16c-4.418,0-8,3.582-8,8 s3.582,8,8,8h16v15.833h-80V142.52z M362.775,307.852c-3.09,5.147-11.371,9.835-17.375,9.835H80.843 c-6.003,0-14.285-4.688-17.354-9.8L22.047,238.02h91.254h168.5c2.663,0,5.176-1.361,6.662-3.571 c0.08-0.118,8.07-11.804,19.447-11.804h76.056c0.435,0.073,0.879,0.12,1.334,0.12s0.899-0.047,1.334-0.12h27.174L362.775,307.852z";
              }
              if(value < 0.8 && value > 0.5){
                console.log("plane");
                svgPath = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";
              }
              if(value < 1 && value > 0.8){
                console.log("truck");
                svgPath = "M511.981,222.492c-0.033-2.573-1.021-5.096-2.894-7.009l-96.095-98.118c-1.919-1.958-4.545-3.063-7.287-3.063H10.199 C4.567,114.302,0,118.868,0,124.501v228.606c0,5.633,4.567,10.199,10.199,10.199h26.395c4.626,19.686,22.322,34.392,43.4,34.392 c21.078,0,38.774-14.705,43.401-34.392h208.565c4.626,19.686,22.323,34.392,43.401,34.392s38.774-14.705,43.4-34.392h83.042 c5.632,0,10.199-4.566,10.199-10.199V222.62C512,222.575,511.988,222.535,511.981,222.492z M354.202,134.701h47.217l76.117,77.719 H354.202V134.701z M79.994,377.3c-13.34,0-24.193-10.853-24.193-24.193s10.853-24.193,24.193-24.193 c13.341,0,24.194,10.853,24.194,24.193S93.335,377.3,79.994,377.3z M298.4,342.908H123.395 c-4.626-19.687-22.323-34.392-43.401-34.392c-21.078,0-38.774,14.705-43.4,34.392H20.398v-68.616H298.4V342.908z M298.4,253.893 H20.398V134.701H298.4V253.893z M375.36,377.3c-13.341,0-24.193-10.853-24.193-24.193s10.853-24.193,24.193-24.193 c13.34,0,24.193,10.853,24.193,24.193S388.7,377.3,375.36,377.3z M491.602,253.894H435.04c-5.632,0-10.199,4.566-10.199,10.199 s4.567,10.199,10.199,10.199h56.562v68.616h-72.841c-4.626-19.687-22.322-34.392-43.4-34.392s-38.774,14.705-43.401,34.392H318.8 V134.701h15.004v87.919c0,5.633,4.567,10.199,10.199,10.199h147.599V253.894z";
              }
              return svgPath;
            });
          //  plane.set("svgPath", "M434.886,210.701c-1.42-2.506-4.079-4.056-6.96-4.056h-34.625v-16.208c0-4.418-3.582-8-8-8h-24.333V150.52 c0-4.418-3.582-8-8-8h-31.667v-32.281c0-4.418-3.582-8-8-8h-79.667c-4.418,0-8,3.582-8,8v32.281h-31.667c-4.418,0-8,3.582-8,8 v31.917h-24.333c-4.418,0-8,3.582-8,8v31.583h-32.333v-87.5c0-4.418-3.582-8-8-8h-96c-4.418,0-8,3.582-8,8v87.5H8 c-2.875,0-5.529,1.542-6.952,4.041c-1.423,2.498-1.396,5.568,0.071,8.04l48.63,81.985c6.023,10.034,19.391,17.601,31.093,17.601 H345.4c11.703,0,25.071-7.567,31.098-17.607l58.292-97.323C436.27,216.285,436.307,213.208,434.886,210.701z M377.301,206.645h-56 v-8.208h56V206.645z M305.301,198.437v8.314c-13.408,1.063-22.964,10.084-27.404,15.27h-36.262v-23.583H305.301z M344.968,182.437 h-64V158.52h64V182.437z M241.635,118.239h63.667v24.281h-63.667V118.239z M201.968,158.52h63v23.917h-63V158.52z M169.635,198.437 h56v23.583h-56V198.437z M25.301,142.52h80v15.417h-16c-4.418,0-8,3.582-8,8s3.582,8,8,8h16v16.25h-16c-4.418,0-8,3.582-8,8 s3.582,8,8,8h16v15.833h-80V142.52z M362.775,307.852c-3.09,5.147-11.371,9.835-17.375,9.835H80.843 c-6.003,0-14.285-4.688-17.354-9.8L22.047,238.02h91.254h168.5c2.663,0,5.176-1.361,6.662-3.571 c0.08-0.118,8.07-11.804,19.447-11.804h76.056c0.435,0.073,0.879,0.12,1.334,0.12s0.899-0.047,1.334-0.12h27.174L362.775,307.852z");
         // }
        });
        /*if (this.yearOperations >= 5) {
          //clearing();
          this.yearOperations = 0;
          console.log("cleared to " + this.yearOperations);
        }*/


        console.log(root);
        // setInterval(clearing, 10000);
        var bulletIndex = this.yearOperations;
        this.yearOperations = this.yearOperations + 1;
        setTimeout(() => {
          console.log(bulletIndex);
          console.log(pointSeries.bullets.length);
          console.log(pointSeries.bullets.values);
          /* lineSeries.disposeDataItem(lineDataItem);
           pointSeries.bullets.removeIndex(0);
           planeSeries.dispose(); */
        }, pathList.duration + 1000);
      }
    })



    function clearing() {

      console.log("cleared...")

      // pointSeries.bullets.clear()
      // lineSeries.mapLines.clear();
      // lineSeries.mapLines.autoDispose

      //root.container.children.clear();
      // chart.series.removeIndex(0).dispose();

    }

  }

}
