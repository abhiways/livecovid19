var socket = io();
var messages = document.getElementById("messages");

(function() {
  $("form").submit(function(e) {
    let li = document.createElement("li");
    e.preventDefault(); // prevents page reloading
    socket.emit("chat message", $("#message").val());

    messages.appendChild(li).append($("#message").val());
    let span = document.createElement("span");
    messages.appendChild(span).append("by " + "Anonymous" + ": " + "just now");

    $("#message").val("");

    return false;
  });

  socket.on("received", data => {
    $("#Confirmed").html(""+data.Confirmed.toLocaleString()+"");
    $("#Active").html(""+data.Active.toLocaleString()+"");
    $("#Recovered").html(""+data.Recovered.toLocaleString()+"");
    $("#Deceased").html(""+data.Deceased.toLocaleString()+"");
    $("#ConfirmedToday").html(""+data.ConfirmedToday.toLocaleString()+"");
    $("#RecoveredToday").html(""+data.RecoveredToday.toLocaleString()+"");
    $("#DeceasedToday").html(""+data.DeceasedToday.toLocaleString()+"");
    /* State Updates */
        statesDataUpdate(data.jsonData, 2);
    /* State Updates Ends */
});

})();


// get Size of JSON Object
Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

function statesDataUpdate(data, upType) {
   /* Add States Data */
   for (var key in data.data.state_wise) {
    // skip loop if the property is from prototype
    if (!data.data.state_wise.hasOwnProperty(key)) continue;

    var obj = data.data.state_wise[key];
    for (var prop in obj) {
        // skip loop if the property is from prototype
        if (!obj.hasOwnProperty(prop)) continue;
        // your code
        if(prop == "state") { var state = obj[prop]; }
        if(prop == "active") { var active = obj[prop]; }
        var statecode = obj.statecode;
        if(prop == "confirmed") { var confirmed = obj[prop];
        if(prop == "deltaconfirmed") { var newconfirmed = obj[prop]; }
          var newconfirmed = obj.deltaconfirmed; 
            if(upType == 1) {
            confirmed = "<span id='confirmed-"+statecode+"'>"+confirmed.toLocaleString()+"</span> <i class='fa fa-caret-up color-red'></i>  <span id='newconfirmed-"+statecode+"' class='rowsmalltxt'> "+newconfirmed.toLocaleString()+"</span>";
            } else {
              $("#confirmed-"+statecode+"").html(""+confirmed.toLocaleString()+"");
              $("#newconfirmed-"+statecode+"").html(""+newconfirmed.toLocaleString()+"");
            }
        }
        if(prop == "deaths") { var deaths = obj[prop];
          var newdeaths = obj.deltadeaths;
            if(upType == 1) {
            deaths = "<span id='deaths-"+statecode+"'>"+deaths.toLocaleString()+"</span> <i class='fa fa-caret-up color-red'></i>  <span id='newdeaths-"+statecode+"' class='rowsmalltxt'> "+newdeaths.toLocaleString()+"</span>";
            } else {
              $("#deaths-"+statecode+"").html(""+deaths.toLocaleString()+"");
              $("#newdeaths-"+statecode+"").html(""+newdeaths.toLocaleString()+"");
            }
        }
        if(prop == "recovered") { var recovered = obj[prop]; 
          var newrecovered = obj.deltarecovered;
            if(upType == 1) {
            recovered = "<span id='recovered-"+statecode+"'>"+recovered.toLocaleString()+"</span> <i class='fa fa-caret-up color-green'></i>  <span id='newrecovered-"+statecode+"' class='rowsmalltxt'> "+newrecovered.toLocaleString()+"</span>";
            } else {
              $("#recovered-"+statecode+"").html(""+recovered.toLocaleString()+"");
              $("#newrecovered-"+statecode+"").html(""+newrecovered.toLocaleString()+"");
          }
        }
        if(prop == "lastupdatedtime") { 
          if(upType == 1) {
          var updated = "<span id='updated-"+statecode+"'>"+obj[prop]+"<span>"; 
          } else {
            $("#updated-"+statecode+"").html(""+obj[prop]+"");
          }
        }
        if(prop == "district") {
          var distarr = new Array();
          for (var keych in obj[prop]) {
            // skip loop if the property is from prototype
            if (!obj[prop].hasOwnProperty(keych)) continue;
            var objch = obj[prop][keych];
            for (var propch in objch) {
              if(propch == "confirmed") { 
                if(objch.delta.confirmed > 0) {
                  if(upType == 1) {
                    var confirmeddist = "<span id='confirmeddist-"+statecode+"'>"+objch[propch]+"</span> <i class='fa fa-caret-up color-red'></i>  <span id='confirmeddisttoday-"+statecode+"' class='rowsmalltxt'> "+objch.delta.confirmed.toLocaleString()+"</span>";
                  } else {
                    $("#confirmeddist-"+statecode+"").html(""+objch[propch]+"");
                    $("#confirmeddisttoday-"+statecode+"").html(""+objch.delta.confirmed.toLocaleString()+"");
                  }
                } else {
                  if(upType == 1) {
                    var confirmeddist = objch[propch];
                  } else {
                    $("#confirmeddist-"+statecode+"").html(""+objch[propch]+"");
                  }
                }
                if(upType == 1) {
                  var districtmarkuptd = "<tr><td></td><td>"+ keych +"</td><td>"+ confirmeddist.toLocaleString() +"</td></tr>";
                  distarr.push(districtmarkuptd);
                }
              }
            }
          }
        }
    }
    if(upType == 1) {
      var markup = "<tr class='header'><td></td><td onclick='MapChange(\"" + state + "\")'>" + state + "</td><td class='color-orange'>" + confirmed +"<td>"+ active.toLocaleString() +"<td class='color-lime'>"+ deaths +"<td class='color-green'>"+ recovered +"<td style='display:none;'>"+ updated +"</td></tr>"+distarr.join('');
      $("#StateData tbody").append(markup);
      $("#cover").fadeOut(1750);
    }
    distarr.length=0;
  }
  var ua = navigator.userAgent,
  event = (ua.match(/iPad/i)) ? "touchstart" : "click";
if ($('.table').length > 0) {
  $('.table .header').on(event, function() {
    $(this).toggleClass("active", "").nextUntil('.header').css('display', function(i, v) {
      return this.style.display === 'table-row' ? 'none' : 'table-row';
    });
  });
}
/******** */
 }

 // fetching iniatial basic stats from the database
(function() {
  fetch("https://www.livecovid19.org/api/stats")
    .then(data => {
      return data.json();
    })
    .then(json => {
      json.map(data => {
        Confirmed.innerText = data.data.total_values.confirmed.toLocaleString();
        ConfirmedToday.innerText = data.data.total_values.deltaconfirmed.toLocaleString();
        Active.innerText = data.data.total_values.active.toLocaleString();
        //ActiveToday.innerText = data.data.total_values.deltaconfirmed;
        Recovered.innerText = data.data.total_values.recovered.toLocaleString();
        RecoveredToday.innerText = data.data.total_values.deltarecovered.toLocaleString();
        Deceased.innerText = data.data.total_values.deaths.toLocaleString();
        DeceasedToday.innerText = data.data.total_values.deltadeaths.toLocaleString();
        statesDataUpdate(data, 1);
      });
    });
})();

 // fetching feeds from the database
 (function() {
  fetch("https://www.livecovid19.org/api/feeds")
    .then(data => {
      return data.json();
    })
    .then(json => {
      json.map(data => {
          if(data.district != 'Unknown') { if(data.district != "Italians") { var prefix = data.district+" district ";} else { var prefix = data.district; } } else { var prefix = ""; }
          if(data.action == 'death') { var cicon = "fa fa-bolt color-red";
           if(data.val > 1) { var act = "deaths."; } else { var act = "death."; }  var posfix = "";
          } else { if(data.val > 1) { var posfix = "cases."; } else { var posfix = "case."; } }
          if(data.action == 'confirmed') { var act = "confirmed"; var cicon = "fa fa-bed color-orange";  }
          if(data.action == 'recovered') { var act = "recovered"; var cicon = "fa fa-check color-green"; }
            var txt = "[ "+data.state+" ] "+prefix+" has reported "+data.val+" "+act+" "+posfix;
            var updt = new Date(data.time*1000);
            var newHTML = "<section class='feed-item'><div class='icon pull-left'><i class='"+cicon+"'></i></div><div class='feed-item-body'><div class='text'>"+txt+"</div><div class='time pull-left timeago' title='"+data.time+"'>"+updt.toLocaleString()+"</div></div></section>";
            $('#prepFeeds').prepend(newHTML);
      });
    });
})();

// fetching iniatial daily stats from the database
(function() {
  fetch("https://www.livecovid19.org/api/dailystats")
    .then(data => {
      return data.json();
    })
    .then(json => {
      json.map(data => {
        var pointlength = data.daily.length;
        var day1mo = new Date();
        // Line CHart //
        day1mo.setDate(day1mo.getDate()-30);
        nv.addGraph(function() {
          var maxf = data.daily[Object.keys(data.daily)[Object.keys(data.daily).length-1]];
          var maxy = Math.ceil(maxf.totalconfirmed/1000)*1000;
          var chart = nv.models.lineWithFocusChart().yDomain([0,maxy]).rightAlignYAxis(true)
          //var chart = nv.models.lineWithFocusChart().rightAlignYAxis(true)
              .useInteractiveGuideline(true)
              .margin({top: 0, bottom: 25, left: 0, right: 30})
              //.showLegend(false)
              .color([
                  '#6294c9', '#fc9803', '#48f702', '#fc030b'
              ]);

          chart.legend.margin({top: 3});

          chart.yAxis
              .showMaxMin(false)
              .tickFormat(d3.format("s"));

          chart.xAxis
              .showMaxMin(false)
              .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

          chart.x2Axis
              .showMaxMin(false)
              .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });
          
         // chart.yScale(d3.scale.log());
         //chart.forceY([1,50000]);
         // chart.yScale( d3.scale.log().base(4) );

        chart.brushExtent([new Date(day1mo.getTime()), new Date()])

          var data1 = ApiData(['Confirmed', 'Active', 'Recovered', 'Deceased'], pointlength, data.daily);
          data1[0].area = true;
          d3.select('#visits-chart svg')
              .datum(data1)
              .transition().duration(500)
              .call(chart);

          PjaxApp.onResize(chart.update);

          return chart;
        });
        // Line CHart Ends //
        // Bar Charts //
        nv.addGraph(function() {
          var maxf = data.daily[Object.keys(data.daily)[Object.keys(data.daily).length-1]];
          var maxy = Math.ceil(maxf.dailyconfirmed/1000)*1000;
          var chart = nv.models.multiBarChart()
            .yDomain([0,maxy])
            .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
            .rotateLabels(0)      //Angle to rotate x-axis labels.
            .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
            .groupSpacing(0.1)    //Distance between each group of bars.
            .margin({top: 0, bottom: 25, left: 25, right: 0})
            .color([
              '#6294c9', '#fc9803', '#48f702', '#fc030b'
          ]);
      
          chart.xAxis
             // .tickFormat(d3.format(',f'));
             .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });
      
          chart.yAxis
              .showMaxMin(false)
              .tickFormat(d3.format('s'));
      
          d3.select('#prediction-chart svg')
              .datum(dailytrends(['Confirmed', 'Active', 'Recovered', 'Deceased'], pointlength, data.daily))
              .call(chart);
      
          nv.utils.windowResize(chart.update);
      
          return chart;
      });
        // Bar Chart Ends
        // Prediction Chart
        am4core.ready(function() {

          // Themes begin
          am4core.useTheme(am4themes_animated);
          // Themes end
          
          // Create chart instance
          var chart = am4core.create("chartdiv", am4charts.XYChart);
          
          // Data for both series
          var data = [ {
            "year": "Jan",
            "Active": 0,
            "Confirmed": 1
          }, {
            "year": "Feb",
            "Active": 0,
            "Confirmed": 3
          }, {
            "year": "Mar",
            "Active": 1438,
            "Confirmed": 1635
          }, {
            "year": "Apr",
            "Active": 23557,
            "Confirmed": 33065
          }, {
            "year": "May",
            "Active": 93381,
            "Confirmed": 190649,
          }, {
            "year": "June",
            "Active": 195301,
            "Confirmed": 495372,
            "strokeWidth": 1,
            "columnDash": "5,5",
            "fillOpacity": 0.2,
            "additional": "(projection)"
          } ];
          
          /* Create axes */
          var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "year";
          categoryAxis.renderer.minGridDistance = 30;
          
          /* Create value axis */
          var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          
          /* Create series */
          var columnSeries = chart.series.push(new am4charts.ColumnSeries());
          columnSeries.name = "Active";
          columnSeries.dataFields.valueY = "Active";
          columnSeries.dataFields.categoryX = "year";
          
          columnSeries.columns.template.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
          columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
          columnSeries.columns.template.propertyFields.stroke = "stroke";
          columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
          columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
          columnSeries.tooltip.label.textAlign = "middle";
          
          var lineSeries = chart.series.push(new am4charts.LineSeries());
          lineSeries.name = "Confirmed";
          lineSeries.dataFields.valueY = "Confirmed";
          lineSeries.dataFields.categoryX = "year";
          
          lineSeries.stroke = am4core.color("#fdd400");
          lineSeries.strokeWidth = 3;
          lineSeries.propertyFields.strokeDasharray = "lineDash";
          lineSeries.tooltip.label.textAlign = "middle";
          
          var bullet = lineSeries.bullets.push(new am4charts.Bullet());
          bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
          bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
          var circle = bullet.createChild(am4core.Circle);
          circle.radius = 4;
          circle.fill = am4core.color("#fff");
          circle.strokeWidth = 3;
          
          chart.data = data;
          
          }); // end am4core.ready()
        // Prediction Chart Ends
      });
    });
    MapChange('Maharashtra');
})();

function ApiData(stream_names, points_count, apidata) {
  var now = new Date().getTime(),
      day = 1000 * 60 * 60 * 24, //milliseconds
      days_ago_count = 60,
      days_ago = points_count * day,
      days_ago_date = now - days_ago,
      points_count = points_count || 45, //less for better performance
      day_per_point = points_count / points_count;
      //alert(JSON.stringify(apidata[0]));
  return stream_layers(stream_names.length, points_count, .1).map(function(data, i) {
      return {
          key: stream_names[i],
          values: data.map(function(d,j){ 
            var currentline = stream_names[i];
            if(stream_names[i] == "Confirmed") { var plot = apidata[j]["totalconfirmed"] }
            if(stream_names[i] == "Active") { var plot = apidata[j]["totalconfirmed"] - apidata[j]["totalrecovered"] - apidata[j]["totaldeceased"] }
            if(stream_names[i] == "Recovered") { var plot = apidata[j]["totalrecovered"] }
            if(stream_names[i] == "Deceased") { var plot = apidata[j]["totaldeceased"] }
              return {
                  x: days_ago_date + d.x * day * day_per_point,
                  y: plot //just a coefficientß
              }
          })
      };
  });
}

function dailytrends(stream_names, points_count, apidata) {
  var now = new Date().getTime(),
  day = 1000 * 60 * 60 * 24, //milliseconds
  days_ago_count = 60,
  days_ago = points_count * day,
  days_ago_date = now - days_ago,
  points_count = points_count || 45, //less for better performance
  day_per_point = points_count / points_count;
  //alert(JSON.stringify(apidata[0]));
return stream_layers(stream_names.length, points_count, .1).map(function(data, i) {
  return {
      key: stream_names[i],
      values: data.map(function(d,j){ 
        var currentline = stream_names[i];
        if(stream_names[i] == "Confirmed") { var plot = apidata[j]["dailyconfirmed"] }
        if(stream_names[i] == "Active") { var plot = apidata[j]["dailyconfirmed"] - apidata[j]["dailyrecovered"] - apidata[j]["dailydeceased"] }
        if(stream_names[i] == "Recovered") { var plot = apidata[j]["dailyrecovered"] }
        if(stream_names[i] == "Deceased") { var plot = apidata[j]["dailydeceased"] }
          return {
              x: days_ago_date + d.x * day * day_per_point,
              y: plot //just a coefficientß
          }
      })
  };
});
}
// Map Functions
function MapChange(state) {
  $('#stateMap').html(state);
  $('#stateMapDB').attr('href', 'https://www.livecovid19.org/apic/datamap.php?s='+state.toLowerCase());
  var urlstate = state.replace(/ /g,'');
const _app = {
  map: {
    init: {
      container: 'map',
      style: 'https://cdn.jsdelivr.net/gh/osm-in/mapbox-gl-styles@latest/osm-mapnik-india-v8.json',
      fadeDuration: 100
    },
    'data-layer': {
      id: 'india-constituencies',
      type: 'fill',
      paint: {
        'fill-color': [
          'match', ['get', 'Risk'],
          'HIGH', 'red',
          'MEDIUM', 'orange',
          'LOW', 'green',
          /* default */
          '#ccc'
        ],
        "fill-outline-color": ["case", ["boolean", ["feature-state", "active"], false],
          'blue',
          '#555'
        ],
        "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false],
          0.2,
          0.5
        ]
      },
      layout: {
        'text-field': '{AC_NAME}'
      },
      interactivity: {
        popup: true,
        hover: true
      }
    }
  },
  table: {
    layout: {
      zone_name: 'ZONE',
      ac_name: 'Constituency',
      risk: 'RISK'
    }
  },
  data: {
    /* URL to GeoJSON */
    'shape-source':'https://www.livecovid19.org/apic/shape/'+urlstate.toLowerCase()+'/district/'+urlstate.toLowerCase()+'_district.json',
  
    'table-source': 'https://www.livecovid19.org/apic/datamap.php?s='+state.toLowerCase()+'',
    /* Matching function will match the shape feature to the table row if it returns true */
    'match-function': function(shapeFeature, tableRow) {
      return +tableRow.district == +shapeFeature.properties.district
    }
  }
}
// Initialize GL map
var map = new mapboxgl.Map(_app.map.init);

map.on('load', function() {

  /* Add Map UI controls */
  mapboxgl.addMapControls(map);

  // Add empty map data source and paint layers

  map.addSource(_app.map['data-layer'].id, {
    type: 'geojson',
    data: null,
    generateId: true
  });

  map.addLayer({
    id: _app.map['data-layer'].id,
    type: _app.map['data-layer'].type,
    source: _app.map['data-layer'].id,
    paint: _app.map['data-layer'].paint
  })

  // Fetch a CSV and convert to JSON using csvtojson https://www.npmjs.com/package/csvtojson
  const fetchTable = fetch(_app.data['table-source'])
    .then(response => response.text())
    .then(tableCSV => {
      return csv()
        .fromString(tableCSV)
        .then((tableJSON) => {
          let table_HTML = (new TableBuilder({
              'class': 'popup-table'
            }))
            .setHeaders(_app.table.layout)
            .setData(tableJSON)
            .render();

          // Populate the feature table with the spreadsheet values
          document.getElementById("feature-table").innerHTML = table_HTML;

          // Filter map data layer using values hovered on
          document.querySelectorAll('#feature-table td')
            .forEach(e => {
            
                                  const filter = {
                layer: _app.map['data-layer'].id,
key : e.className.split('-td')[0].replace('-', '_'),
value : e.innerText
}
let originalStyle;
              // Highlight features with matching data as the table
              e.addEventListener("mouseover", function() {

                // Extract the field and value hovered on from the table
        originalStyle = map.getPaintProperty(filter.layer, 'fill-opacity')
                map.setPaintProperty(filter.layer, 'fill-opacity', [ 'match', ['get', filter.key],
                  filter.value, 1,
                  /* other */
                  0.2
                ])
// Center the map to the centroid of selected features               
map.flyTo({ center: turf.centroid(turf.featureCollection(map.querySourceFeatures(filter.layer, {filter:['==',filter.key,filter.value]}))).geometry.coordinates});
                
              })
              
               // Highlight features with matching data as the table
              e.addEventListener("mouseout", function() {
              map.setPaintProperty(filter.layer, 'fill-opacity',originalStyle)
              })
              
              map.resize()

              // Reset the style on mouseout

            });

          return tableJSON;
        })
    })

  // Fetch  a geojson shape and add it to the map data layer
  const fetchShape = fetch(_app.data['shape-source'])
    .then(response => response.json())
    .then(shapeJSON => {
      map.getSource(_app.map['data-layer'].id).setData(shapeJSON);
      return shapeJSON;
    })

  /* Join shape and table data after it is fetched */
  Promise.all([fetchShape, fetchTable]).then(([shape, table]) => {

    joinSourceWithTable(map, _app.map['data-layer'].id, table);

    function joinSourceWithTable(map, source, table, {
      fields = null
    } = {}) {

      const addedPaintProperties = updateLayerStyleWithTable(map, source, table);
      const shape = map.getSource(source)._data;

      // Use the provided matching function else attempt to match using identical column names
      let joinCb = {};
      //joinCb = _app.data['match-function'];
      if ('match-function' in _app) {

        joinCb = _app.data['match-function'];
      } else {

        // Find fields that are common between the shape and table
        const matchingFields = Object.keys(shape.features[0].properties).filter(value => -1 !== Object.keys(table[0]).indexOf(value));
        if (matchingFields.length) {
          if (isNaN(table[0][matchingFields[0]])) {
            joinCb = function(feature, row) {
              return feature.properties[matchingFields[0]] === row['district']//+row[matchingFields[0]]
            };
          } else {
            joinCb = function(feature, row) {
              return feature.properties[matchingFields[0]] === row['district'] //row[matchingFields[0]]
            };
          }


        } else {
          console.warn('No matching fields found between shape and table')
        }
      }

      // Join matching fields from the table for each feature
      shape.features = shape.features.map((feature) => {

        // Find matching table row with a unique lookup
        const matchingRow = table.filter((row) => {
          return joinCb(feature, row);
        })

        // Join new attributes to the shape from matched table row only if there is a matching row in the table
        if (matchingRow.length) {

          // Define the list of table fields to add to the shape
          if (fields) {
            fields.push(addedPaintProperties);
          } else {
            fields = Object.keys(matchingRow[0]);
          }

          // Append extra fields from table to the shape
          fields.forEach(field => {
            try {
              feature.properties[field] = matchingRow[0][field]
            } catch (e) {
              feature.properties[field] = null
              console.warn("Missing property value", field, feature.properties)
            }
          })
        } else {
          console.warn('Unable to find matching record for feature', feature);
        }
        return feature;
      })

      //Update geojson data
      map.getSource(_app.map['data-layer'].id).setData(shape);

    }

  })

  /*Define layer interactivity*/
  setFeatureStateOn(map, 'mousemove', _app.map['data-layer'].id, 'hover');
  setFeatureStateOn(map, 'mousedown', _app.map['data-layer'].id, 'active')
  labelFeatureOn(map, 'mousemove', _app.map['data-layer'].id, _app.map['data-layer'].layout['text-field'])
  addPopupOn(map, 'click', _app.map['data-layer'].id);

});

function updateLayerStyleWithTable(map, layer, table) {

  const supportedPaintProperties = ['fill-color', 'fill-outline-color'];
  let tablePaintProperties = [];
  let layerStyle = {};

  // Find supported paint properties available in the table
  supportedPaintProperties.forEach(property => {
    if (property in table[0]) {
      tablePaintProperties.push(property);
    }
  })

  // Use styles defined in the table if available
  if (supportedPaintProperties.length) {
    tablePaintProperties.forEach(property => {
      map.setPaintProperty(layer, property, ["get", property])
    })
  }

  return tablePaintProperties;

}

function setFeatureStateOn(map, event, layer, property) {
  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  var targetStateId = null;
  map.on(event, layer, function(e) {

    if (e.features.length > 0) {
      if (targetStateId) {
        map.setFeatureState({
          source: map.getLayer(layer).source,
          id: targetStateId
        }, {
          [property]: false
        });
      }
      targetStateId = e.features[0].id;
      map.setFeatureState({
        source: map.getLayer(layer).source,
        id: targetStateId
      }, {
        [property]: true
      });
    }
  });
}

function addPopupOn(map, event, layer) {

  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on(event, layer, function(e) {
    var coordinates = turf.centroid(e.features[0]).geometry.coordinates.slice();
    var description = JSON2HTMLList(e.features[0].properties, {
      formatProperty: function(prop) {
        var strong = document.createElement('strong');
        if(prop.textContent == "district" || prop.textContent == "Confirmed" || prop.textContent == "Active" || prop.textContent == "Recovered" || prop.textContent == "Deaths" || prop.textContent == "Risk" || prop.textContent == "Confirmed Today" || prop.textContent == "Recovered Today" || prop.textContent == "Deaths Today") {
        strong.appendChild(prop);
        strong.appendChild(document.createTextNode(': '));
        }
        return strong;
      },
      formatValue: function(value, prop) {
        var elm;
        elm = document.createElement('span');
        if(prop == "district" || prop == "Confirmed" || prop == "Active" || prop == "Recovered" || prop == "Deaths" || prop == "Risk" || prop == "Confirmed Today" || prop == "Recovered Today" || prop == "Deaths Today") {
        elm.className = 'txt-kbd';
        elm.appendChild(value);
        } else {
        elm.className = 'txt-none';
        elm.appendChild(value);
        }
        return elm;
      }
    });


    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setDOMContent(description)
      .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', layer, function() {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', layer, function() {
    map.getCanvas().style.cursor = '';
  });

}

function labelFeatureOn(map, event, layer, textField) {

  // Layers for feature info popup
  map.addSource('label-feature', {
    type: 'geojson',
    data: null
  })


  map.addLayer({
    id: 'label-feature symbol',
    type: 'symbol',
    source: 'label-feature',
    layout: {
      "text-field": textField,
      "text-offset": [0, -0.4],
      "text-anchor": "bottom",
      'text-font': ['Open Sans Bold'],
      'text-size': 14,
    },
    paint: {
      'text-halo-color': 'rgba(255,255,255,1)',
      'text-halo-width': 2
    }
  });


  map.on(event, layer, function(e) {
    map.getSource('label-feature').setData(turf.featureCollection(e.features))
  });
}
}