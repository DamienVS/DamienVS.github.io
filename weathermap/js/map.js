$(() => {

  const HTML_CONTAINER_ID = "map"

  const BASE_COORDS = [50.796, 4.357];

  const MIN_ZOOM = 5;
  const MAX_ZOOM = 12;
  const DEFAULT_ZOOM = 7;
  const MAX_ZOOM_CLUSTERING = 8;


  var map;

  //preload templatez
  var templates = {
    pointPopup: $('#template-point-popup').html(),
  };
  Mustache.parse(templates.PointPopup);


  // set the basic map configuration
  map = L.map(HTML_CONTAINER_ID, {
    zoomControl: false
  }).setView(BASE_COORDS, DEFAULT_ZOOM);

  //set the basic marker layer configuration
  /*
    var wow_markers = L.markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: false,
      removeOutsideVisibleBounds: true,
      disableClusteringAtZoom: MAX_ZOOM_CLUSTERING,
      maxClusterRadius: 20,
      chunkedLoading: true,
      iconCreateFunction: getClusterStyle
    });*/


  var rmiRadarLayer;
  var knmiRadarLayer;
  var locationMarker = null;

  var modalRatio;


  // basic openstreet map layer as baselayer
  let mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/';
  let token =
    'pk.eyJ1IjoiZGFtaWVudnMiLCJhIjoiY2pwaTFpbHZkMTJsMzNwcGdhZnY4ZnQ4dyJ9.ri44R5m-EPI_y7XkyrJ61g';

  //let mapId = null ;
  //if(lang.lang == 'fr')
  //	mapId = 'cj6or2wic1wxl2rqmcjljm0cg' ; // map with names in french
  //else if(lang.lang == 'nl')
  //	mapId = 'cj71wpzmq13qj2rtibjnokn0s' ; // map with names in local language
  //else // lang.lang == 'en'
  //	mapId = 'cj6oqr0td1wlg2snvqbfipvy1' ; // map with names in english

  mapId = 'streets-v10';

  var basemapUrl = mapboxUrl + mapId +
    '/tiles/256/{z}/{x}/{y}?access_token=' + token;

  var attribution =
    'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://mapbox.com">Mapbox</a>';


  L.tileLayer(basemapUrl, {
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    attribution: attribution,
  }).addTo(map);

  // Wallonia shapefile
  var shpfile = new L.Shapefile('assets/Contours_RW_L72.zip', {

    style: function(feature) {
      return {
        opacity: 1,
        fillOpacity: 0.2,
        dashArray: "20 10",
        radius: 60,
        lineCap: "butt",
        color: '#27d673',
        fillColor: '#52aeff',
        interactive: false,
      }
    },
  });
  shpfile.addTo(map);
  shpfile.once("data:loaded", function() {
    console.log("finished loaded shapefile");
  });

  //quality points
  var pointIcons = {
    level1: L.divIcon({
      className: 'point lvl1',
    }),
    level2: L.divIcon({
      className: 'point lvl2',
    }),
    level3: L.divIcon({
      className: 'point lvl3',
    }),
    level4: L.divIcon({
      className: 'point lvl4',
    }),
    level5: L.divIcon({
      className: 'point lvl5',
    }),
    level6: L.divIcon({
      className: 'point lvl6',
    }),
    level7: L.divIcon({
      className: 'point lvl7',
    }),
    level8: L.divIcon({
      className: 'point lvl8',
    }),
    level9: L.divIcon({
      className: 'point lvl9',
    }),
    level10: L.divIcon({
      className: 'point lvl10',
    }),
  };
  var marker = L.marker([50.580, 4.560], {
    icon: pointIcons.level1,
    bgPos: [5, 5]
  }).addTo(map);



  //Local API
  var addMarker = function(options) {
    let popup = L.popup({
      closeButton: false,
    }).setContent(Mustache.render(templates.pointPopup, options));

    let point = L.marker(options.coords, {
      icon: pointIcons["level" + options.level],
      bgPos: [5, 5]
    }).bindPopup(popup).addTo(map);
  }


  addMarker({
    coords: [50.580, 4.560],
    level: 1,
    stationName: "ISSEP, Li&egrave;ge - Ch&eacute;ra",
    indexes: {
      belaqi: {
        level: 5,
        value: 3
      },
      pm10: {
        level: 2,
        value: 12
      },
      pm25: {
        level: 3,
        value: 7
      },
      o3: {
        level: 7,
        value: 11
      },
      no2: {
        level: 9,
        value: 6
      },
      co: {
        level: 1,
        value: 20
      },
      so2: {
        level: 10,
        value: 10
      },
    }
  });



  /*
  //TO ADD
    var LocateControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      onAdd: function(map) {
        var container = L.DomUtil.create('div',
          'clickable leaflet-bar leaflet-control leaflet-control-location'
        );

        container.style.backgroundColor = 'white';
        container.style.backgroundImage = 'url(assets/locate.png)';
        container.style.backgroundSize = '26px 26px';
        container.style.width = '26px';
        container.style.height = '26px';

        container.onclick = function() {
          map.locate({
              setView: false,
              watch: false
            })
            .on('locationfound', function(e) {
              let location = [e.latitude, e.longitude];
              setLocationMarker(location);
              zoomOn(location);
            })
            .on('locationerror', function(e) {
              alert(e['message']);
            });
        }

        return container;
      }
    });
    map.addControl(new LocateControl());
  */

  /*

  //TO ADD ? Cluster Stuff ...

  let modalWindowId = 'station-details-modal';
  let elem = document.getElementById(modalWindowId);

  modalRatio = 0.4;


  generateClusterStyles();
    function centerMapToSiteView(location) {
      setLocationMarker(location);

      let bounds = map.getBounds();
      let modalWidthPercent = getModalWindowPercent();

      let latitude = location[0],
        longitude = location[1];
      let width = bounds.getEast() - bounds.getWest();

      // if location is already in the reduced size map
      // no need to center the map
      if ((latitude >= bounds.getSouth() && latitude <= bounds.getNorth()) &&
        (longitude >= (bounds.getWest() + modalWidthPercent * width) &&
          longitude <= bounds.getEast())
      ) {
        return;
      }

      let center = [latitude, longitude - ((1.0 - (1.0 - modalWidthPercent) /
        2.0) - 0.5) * width];
      zoomOn(center);
    }

    function getModalWindowPercent() {
      return modalRatio;
    }

    function zoomOn(location) {
      map.setView(location);
    }

    function setLocationMarker(location) {
      if (locationMarker != null) {
        locationMarker.removeFrom(map);
      }

      locationMarker = L.marker(location);
      locationMarker.addTo(map);
    }

    function getClusterStyle(cluster) {
      let param = getCurrentParameter();

      if (param != 'wind' && param != 'image') {
        // put the number of markers in cluster in the icon
        let childCount = cluster.getChildCount();
        let htmlContent = '<div><span>' + childCount '+' +
          '</span></div>';

        // color of the cluster = mode of the markers' color
        // 1. get the count of each color in the cluster
        let colorCount = {};
        let children = cluster.getAllChildMarkers();
        for (let i = 0; i < children.length; ++i) {
          color = children[i].options.color;
          if (!(color in colorCount)) {
            colorCount[color] = 1;
          } else {
            colorCount[color] = colorCount[color] + 1;
          }
        }

        // 2. select the color that appears the more often
        let mode = null,
          max_count = -1;
        for (let color in colorCount) {
          if (colorCount[color] > max_count) {
            max_count = colorCount[color];
            mode = color;
          }
        }

        // 3. retrieve the value associated to that color
        let modeValue = null;
        let thr = thresholds[param];
        for (let i = 0; i < thr.length; ++i) {
          if (thr[i][1] == mode) {
            modeValue = thr[i][0];
            break;
          }
        }

        // build style object
        // marker-cluster marker-cluster-small leaflet-zoom-animated leaflet-interactive
        let classes = 'marker-cluster marker-cluster-' + param + '-' + Math.round(
          modeValue);
        return new L.DivIcon({
          html: htmlContent,
          className: classes,

        });
      } else if (param == 'wind') {
        let children = cluster.getAllChildMarkers();

        let speedCount = {};
        //let directionCount = {} ;
        for (let i = 0; i < children.length; ++i) {
          //console.log(children[i].options.icon.options);

          let s = children[i].options.icon.options.color;
          //let d = children[i].options.icon.options.direction ;

          if (!(s in speedCount)) speedCount[s] = 0;
          //if(! (d in directionCount) ) directionCount[d] = 0 ;

          speedCount[s] += 1;
          //directionCount[d] += 1 ;
        }

        let maxSpeed = 0;
        let maxCount = -1;
        for (speed in speedCount) {
          if (speedCount[speed] > maxCount) {
            maxSpeed = speed;
            maxCount = speedCount[speed];
          }
        }

        let modeValue = null;
        let thr = thresholds[param];
        for (let i = 0; i < thr.length; ++i) {
          if (thr[i][1] == maxSpeed) {
            modeValue = thr[i][0];
            break;
          }
        }

        let htmlContent = '<div><span>' + '+' + '</span></div>';
        let classes = 'marker-cluster marker-cluster-' + param + '-' + Math.round(
          modeValue);
        return new L.DivIcon({
          html: htmlContent,
          className: classes,
          iconSize: new L.Point(20, 20)
        });

      } else if (param == 'image') {
        return new L.DivIcon({
          html: '+',
          className: 'marker-cluster',
          iconSize: new L.Point(20, 20)
        });
      }



    }

    function generateClusterStyles() {
      let css = '';

      for (let parameter in thresholds) {
        let thr = thresholds[parameter];
        for (let i = 0; i < thr.length; ++i) {
          let val = Math.round(thr[i][0]);
          let color = thr[i][1];

          let rgb = hexToRgb(color);
          let cssRule = '.marker-cluster-' + parameter + '-' + val +
            '{ background-color: rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b +
            ', 0.9);}';

          css += cssRule + "\n";
        }
      }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
      head.appendChild(style);
    }
  */
});
