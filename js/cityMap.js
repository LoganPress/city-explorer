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

  vis.opacityScale = d3.scaleLinear().range([0.1, 0.9]);

  vis.map = L.map(vis.parentElement).setView(vis.mapPosition, 12);

  vis.onEachNeighborhood = function (n, layer) {
    const category = $("#mapCategory").val();
    const text = $("#mapCategory option:selected").text();
    const parkIds = [80, 81, 82, 83, 84, 85, 86, 87, 88];
    const nid = n.properties.NHD_NUM;
    const index = nid - 1;
    const targetValue = vis.data[index][category];
    if (!parkIds.includes(nid)) {
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
      layer.on("click", function () {
        neighborhoodVis.updateVis(vis.data[index]);
      });
    }
  };

  vis.choroplethStyle = function (d) {
    const category = $("#mapCategory").val();
    vis.opacityScale.domain([
      d3.min(vis.data, (d) => d[category]),
      d3.max(vis.data, (d) => d[category]),
    ]);
    let style = {};
    const colors = {
      population: "purple",
      walkscore: "#084d60",
      transitscore: "#00a5a5", 
      bikescore: "#b0772c", //#d37a06, #db902e, #c40801
      zhvi: "#c40801",
    };
    const index = d.properties.NHD_NUM - 1;
    if (d.properties.NHD_NUM < 80) {
      const targetValue = vis.data[index][category];
      style = {
        color: colors[category],
        fillOpacity: vis.opacityScale(targetValue),
      };
    } else {
      style = {
        color: colors[category],
        fillOpacity: 0,
      };
    }
    return style;
  };

  vis.neighborhoodLayer = L.geoJson(vis.geoFeatures, {
    color: "#3F7484",
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
    color: "#3F7484",
    weight: 2,
    style: vis.choroplethStyle,
    onEachFeature: vis.onEachNeighborhood,
  });
  vis.neighborhoodLayer.addTo(vis.map);
};
