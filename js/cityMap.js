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
  vis.opacityScale = d3
    .scaleLinear()
    .domain([0, d3.max(vis.data, (d) => d.population)])
    .range([0.2, 0.8]);

  vis.map = L.map(vis.parentElement).setView(vis.mapPosition, 12);

  let neighborhoodLayer = L.geoJson(vis.geoFeatures, {
    color: "#3F7484",
    weight: 2,
    style: choroplethStyle,
    onEachFeature: onEachNeighborhood,
  });

  function onEachNeighborhood(n, layer) {
    const parkIds = [80, 81, 82, 83, 84, 85, 86, 87];
    const num = n.properties.NHD_NUM;
    const index = num - 1;
    const population = vis.data[index].population;
    if (!parkIds.includes(num)) {
      layer.bindTooltip(
        "<h2>" +
          vis.data[index].name +
          "</h2><strong>Population: " +
          population +
          "</strong>",
        {
          sticky: true,
        }
      );
      layer.on("click", function () {
        console.log(n.properties.NHD_NUM);
      });
    }
  }

  function choroplethStyle(d) {
    const index = d.properties.NHD_NUM - 1;
    const population = vis.data[index].population;
    return { fillOpacity: vis.opacityScale(population) };
  }

  neighborhoodLayer.addTo(vis.map);
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
};
