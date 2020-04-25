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
    Confirmed.innerText = data.Confirmed;
    Active.innerText = data.Active;
    Recovered.innerText = data.Recovered;
    Deceased.innerText = data.Deceased;
    ConfirmedToday.innerText = data.ConfirmedToday;
    RecoveredToday.innerText = data.RecoveredToday;
    DeceasedToday.innerText = data.DeceasedToday;
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
            confirmed = "<span id='confirmed-"+statecode+"'>"+confirmed+"</span> <i class='fa fa-caret-up color-red'></i>  <span id='newconfirmed-"+statecode+"' class='rowsmalltxt'> "+newconfirmed+"</span>";
            } else {
              $("#confirmed-"+statecode+"").html(""+confirmed+"");
              $("#newconfirmed-"+statecode+"").html(""+newconfirmed+"");
            }
        }
        if(prop == "deaths") { var deaths = obj[prop];
          var newdeaths = obj.deltadeaths;
            if(upType == 1) {
            deaths = "<span id='deaths-"+statecode+"'>"+deaths+"</span> <i class='fa fa-caret-up color-red'></i>  <span id='newdeaths-"+statecode+"' class='rowsmalltxt'> "+newdeaths+"</span>";
            } else {
              $("#deaths-"+statecode+"").html(""+deaths+"");
              $("#newdeaths-"+statecode+"").html(""+newdeaths+"");
            }
        }
        if(prop == "recovered") { var recovered = obj[prop]; 
          var newrecovered = obj.deltarecovered;
            if(upType == 1) {
            recovered = "<span id='recovered-"+statecode+"'>"+recovered+"</span> <i class='fa fa-caret-up color-green'></i>  <span id='newrecovered-"+statecode+"' class='rowsmalltxt'> "+newrecovered+"</span>";
            } else {
              $("#recovered-"+statecode+"").html(""+recovered+"");
              $("#newrecovered-"+statecode+"").html(""+newrecovered+"");
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
                    var confirmeddist = "<span id='confirmeddist-"+statecode+"'>"+objch[propch]+"</span> <i class='fa fa-caret-up color-red'></i>  <span id='confirmeddisttoday-"+statecode+"' class='rowsmalltxt'> "+objch.delta.confirmed+"</span>";
                  } else {
                    $("#confirmeddist-"+statecode+"").html(""+objch[propch]+"");
                    $("#confirmeddisttoday-"+statecode+"").html(""+objch.delta.confirmed+"");
                  }
                } else {
                  if(upType == 1) {
                    var confirmeddist = objch[propch];
                  } else {
                    $("#confirmeddist-"+statecode+"").html(""+objch[propch]+"");
                  }
                }
                if(upType == 1) {
                  var districtmarkuptd = "<tr><td></td><td>"+ keych +"</td><td>"+ confirmeddist +"</td></tr>";
                  distarr.push(districtmarkuptd);
                }
              }
            }
          }
        }
    }
    if(upType == 1) {
      var markup = "<tr class='header'><td></td><td>" + state + "</td><td class='color-orange'>" + confirmed +"<td>"+ active +"<td class='color-lime'>"+ deaths +"<td class='color-green'>"+ recovered +"<td>"+ updated +"</td></tr>"+distarr.join('');
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
        Confirmed.innerText = data.data.total_values.confirmed;
        ConfirmedToday.innerText = data.data.total_values.deltaconfirmed;
        Active.innerText = data.data.total_values.active;
        //ActiveToday.innerText = data.data.total_values.deltaconfirmed;
        Recovered.innerText = data.data.total_values.recovered;
        RecoveredToday.innerText = data.data.total_values.deltarecovered;
        Deceased.innerText = data.data.total_values.deaths;
        DeceasedToday.innerText = data.data.total_values.deltadeaths;
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
          if(data.action == 'death') { var cicon = "fa fa-bolt color-red"; var posfix = "."; } else { if(data.val > 1) { var posfix = "cases."; } else { var posfix = "case."; } }
          if(data.action == 'confirmed') { var cicon = "fa fa-bed color-orange";  }
          if(data.action == 'recovered') { var cicon = "fa fa-check color-green"; }
            var txt = "("+data.state+") "+prefix+" has reported "+data.val+" "+data.action+" "+posfix;
            var newHTML = "<section class='feed-item'><div class='icon pull-left'><i class='"+cicon+"'></i></div><div class='feed-item-body'><div class='text'>"+txt+"</div><div class='time pull-left timeago' title='"+data.time+"'></div></div></section>";
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
        day1mo.setDate(day1mo.getDate()-30);
        nv.addGraph(function() {
          var maxf = data.daily[Object.keys(data.daily)[Object.keys(data.daily).length-1]];
          var maxy = Math.ceil(maxf.totalconfirmed/1000)*1000;
          var chart = nv.models.lineWithFocusChart().yDomain([0,maxy]).rightAlignYAxis(true)
              .useInteractiveGuideline(true)
              .margin({top: 0, bottom: 25, left: 0, right: 25})
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
      });
    });
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