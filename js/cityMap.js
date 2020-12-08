/* 
    The visualization for the neighborhoods
*/

CityMap = function (
  _parentElement,
  _data,
  _geoFeatures,
  _mapPosition,
  _geoFeaturesMetro,
  _neighborhoodVis
) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.geoFeatures = _geoFeatures;
  this.mapPosition = _mapPosition;
  this.geoFeaturesMetro = _geoFeaturesMetro;
  this.neighborhoodVis = _neighborhoodVis;

  this.initVis();
};

CityMap.prototype.initVis = function () {
  let vis = this;

  vis.colorRanges = {
    "population": ["#bd87bd", "#ad73ad", "#9d5f9c", "#8d4b8d", "#7d367d", "#6e216d", "#5e035e"],
    "walkscore": ["#d6f1fd", "#b3d2e0", "#92b4c5", "#7197aa", "#507a90", "#2f5f76", "#01455e"],
    "transitscore": ["#c3ebd3", "#a6d8b9", "#8ac59f", "#6eb286", "#539f6c", "#358d53", "#0b7a3a"],
    "bikescore": ["#ffc577", "#f4b061", "#e99c4d", "#dd8739", "#d27127", "#c65b14", "#ba4400"],
    "zhvi": ["#c17775", "#c56965", "#c85b55", "#c94c43", "#c93c31", "#c7281c", "#c40801"]
  };
  vis.colorScales = {}
  vis.colorScale = d3.scaleQuantile();
  
  vis.legendSvg = d3.select("#city-vis-legend")
    .append("svg")
    .attr("height", 505)
    .attr("width", "10vw")
    .attr("id", "legend-svg");

  vis.legendQuantile = d3.legendColor()
    .shapeHeight(70)
    .labelFormat(d3.format(".0f"))
    .cells(7)
    .orient('vertical');

  vis.legendGroup = vis.legendSvg.append("g");

  vis.ranges = {
    "population": [0, 16000],
    "walkscore": [0, 100],
    "transitscore": [0, 100],
    "bikescore": [0, 100],
    "zhvi": [0, 450000]
  };

  vis.map = L.map(vis.parentElement).setView(vis.mapPosition, 12);

  vis.onEachNeighborhood = function (n, layer) {
    const category = $("#mapCategory").val();
    const text = $("#mapCategory option:selected").text();
    const parkIds = [80, 81, 82, 83, 84, 85, 86, 87, 88];
    const nid = n.properties.NHD_NUM;
    const index = nid - 1;
    const targetValue = vis.data[index][category];
    if (!parkIds.includes(nid)) {
      if (targetValue > 0){
        layer.bindTooltip(
          "<h2>" +
            vis.data[index].name +
            "</h2><strong>" +
            text +
            ": " +
            targetValue +
            "</strong>",
          {
            sticky: true,
          }
        );
      } else{
        layer.bindTooltip(
          "<h2>" +
            vis.data[index].name +
            "</h2><strong>" +
            text +
            ": Data unavailable </strong>",
          {
            sticky: true,
          }
        );
      }
      
      layer.on("click", function () {
        neighborhoodVis.updateVis(vis.data[index]);
      });
    }
  };

  vis.choroplethStyle = function (d) {
    const category = $("#mapCategory").val();

    vis.colorScale
      .domain([
        d3.min(vis.data.filter((d) => d[category] > 0), (d) => d[category]),
        d3.max(vis.data, (d) => d[category])
        // vis.ranges[category][0],
        // vis.ranges[category][1]
      ])
      .range(vis.colorRanges[category]);

    vis.legendQuantile.scale(vis.colorScale);

    vis.legendGroup.call(vis.legendQuantile);
    
    let style = {
      opacity: 0.5,
      color: vis.colorRanges[category][vis.colorRanges[category].length-1]
    };
    const index = d.properties.NHD_NUM - 1;
    if ((d.properties.NHD_NUM < 80) && (vis.data[index][category] > 0)) {
      const targetValue = vis.data[index][category];
      style.fillColor = vis.colorScale(targetValue);
      style.fillOpacity = 0.8;
    } else {
      style.fillOpacity = 0;
    }
    return style;
  };

  vis.neighborhoodLayer = L.geoJson(vis.geoFeatures, {
    weight: 2,
    style: vis.choroplethStyle,
    onEachFeature: vis.onEachNeighborhood,
  });

  vis.neighborhoodLayer.addTo(vis.map);
  // console.log(vis.geoFeaturesMetro);
  // L.geoJson(vis.geoFeaturesMetro, {
  //     color: "black",
  //     weight: 2,
  //     opacity: 0.8
  // }).addTo(vis.map);
  L.Icon.Default.imagePath = "/img/";
  L.tileLayer(
    "https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}",
    {
      attribution:
        '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 11,
      maxZoom: 13,
      subdomains: "abcd",
      accessToken:
        "OL92SkQlTl9fHnhOmNS7AuDHe96QqXOSyikpwgcAP2vjWrP0hamS3SxZz9a73iLf",
    }
  ).addTo(vis.map);

  $("#mapCategory").change(function () {
    vis.updateVis();
  });

  vis.wrangleData();
};

CityMap.prototype.wrangleData = function () {
  let vis = this;

  // d3.csv('/data/transit/shapes.csv').then(function(data) {
  //     console.log(data);
  //     data.forEach(function(d){
  //         d.shape_pt_lat = +d.shape_pt_lat;
  //         d.shape_pt_lon = +d.shape_pt_lon;
  //     })
  // });

  vis.updateVis();
};

CityMap.prototype.updateVis = function () {
  let vis = this;
  vis.map.removeLayer(vis.neighborhoodLayer);
  vis.neighborhoodLayer = L.geoJson(vis.geoFeatures, {
    weight: 2,
    style: vis.choroplethStyle,
    onEachFeature: vis.onEachNeighborhood,
  });
  vis.neighborhoodLayer.addTo(vis.map);
};
