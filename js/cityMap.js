/* 
    The visualization for the neighborhoods
*/

CityMap = function (
  _parentElement,
  _data,
  _geoFeatures,
  _mapPosition,
  _geoFeaturesMetro
) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.geoFeatures = _geoFeatures;
  this.mapPosition = _mapPosition;
  this.geoFeaturesMetro = _geoFeaturesMetro;

  this.initVis();
};

CityMap.prototype.initVis = function () {
  let vis = this;

  vis.parallelPlot = new ParallelPlot("parallel-plot-container", vis.data);
  vis.neighborhoodList = new NeighborhoodList("neighborhood-list-container", []);

  vis.category = "population";

  vis.colorRanges = {
    "population": ["#e1b7fd", "#c370fc", "#a628fa", "#8d05e8", "#6e04b5", "#55038c", "#3c0263"],
    "walkscore": ["#d5ebff", "#8cc9ff", "#42a7ff", "#0079e3", "#0062b9", "#004c8f", "#003665"],
    "transitscore": ["#eafff1", "#b5ffcf", "#6bff9e", "#0cff60", "#00cb46", "#009634", "#006222"],
    "bikescore": ["#ffe8cf", "#ffd5a9", "#ffbe79", "#ffa240", "#e97800", "#c36400", "#8a4700"],
    "zhvi": ["#ffd9e1", "#ffa0b4", "#ff708f", "#ff3662", "#fc0037", "#d6002f", "#8a001e"]
  };
  vis.colorScales = {}
  vis.colorScale = d3.scaleQuantile();
  
  vis.legendSvg = d3.select("#city-vis-legend")
    .append("svg")
    .attr("height", 505)
    .attr("id", "legend-svg");

  vis.legendQuantile = d3.legendColor()
    .shapeHeight(70)
    .labelFormat(d3.format(".0f"))
    .cells(7)
    .orient('vertical');

  vis.legendGroup = vis.legendSvg.append("g");

  vis.ranges = {
    "population": [1000, 16000],
    "walkscore": [30, 90],
    "transitscore": [30, 70],
    "bikescore": [40, 85],
    "zhvi": [0, 450000]
  };

  vis.displayNames = {
    "population": "Population",
    "walkscore": "Walk Score",
    "transitscore": "Transit Score",
    "bikescore": "Bike Score",
    "zhvi": "Home Value Estimate"
  }

  vis.selectedNeighborhoods = new Array(79).fill(false);

  vis.map = L.map(vis.parentElement).setView(vis.mapPosition, 12);

  vis.onEachNeighborhood = function (n, layer) {
    const text = vis.displayNames[vis.category];
    const parkIds = [80, 81, 82, 83, 84, 85, 86, 87, 88];
    const nid = n.properties.NHD_NUM;
    const index = nid - 1;
    let targetValue = vis.data[index][vis.category];
    if (!parkIds.includes(nid)) {
      if (targetValue > 0){
        // Following regex from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
        targetValue = targetValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        layer.bindTooltip(
          "<h4>" +
            vis.data[index].name +
            "</h4><h5>" +
            targetValue +
            "</h5><strong id=\"" +
            nid +
            "-selected\">Click to compare me!</strong>",
          {
            sticky: true,
          }
        );
      } else{
        layer.bindTooltip(
          "<h4>" +
            vis.data[index].name +
            "</h4><strong>" +
            text +
            " unavailable </strong>",
          {
            sticky: true,
          }
        );
      }
      
      layer.on("click", function () {
        vis.selectedNeighborhoods[index] = !vis.selectedNeighborhoods[index];
        // if (vis.selectedNeighborhoods[index]) {
        //   $("#" + nid + "-selected").text("Click to stop comparing me!");
        // } else {
        //   $("#" + nid + "-selected").text("Click to compare me!");
        // }
        // console.log($("#" + nid + "-selected").text());
        vis.updateVis();
        vis.parallelPlot.updateVis(vis.data[index]);
        let newNeighborhood = {
          nid: nid,
          name: vis.data[index].name,
          color: vis.parallelPlot.selectedNeighborhoods[index].color
        }
        vis.neighborhoodList.updateVis(newNeighborhood);
      });
    }
  };

  vis.choroplethStyle = function (d) {

    vis.colorScale
      .domain([
        // d3.min(vis.data.filter((d) => d[vis.category] > 0), (d) => d[vis.category]),
        // d3.max(vis.data, (d) => d[vis.category])
        vis.ranges[vis.category][0],
        vis.ranges[vis.category][1]
      ])
      .range(vis.colorRanges[vis.category]);

    vis.legendQuantile.scale(vis.colorScale);

    vis.legendGroup.call(vis.legendQuantile);
    
    let style = {
      opacity: 0.5,
      color: vis.colorRanges[vis.category][vis.colorRanges[vis.category].length-1],
      fillOpacity: 0
    };
    const index = d.properties.NHD_NUM - 1;
    if (d.properties.NHD_NUM < 80) {
      if (vis.selectedNeighborhoods[index]) {
        style.fillColor = "#ffffff";
        style.fillOpacity = 1;
      } else {
        if (vis.data[index][vis.category] > 0) {
          const targetValue = vis.data[index][vis.category];
          style.fillColor = vis.colorScale(targetValue);
          style.fillOpacity = 0.8;
        } else {
          style.fillColor = "#686868";
          style.fillOpacity = 0.8;
        }
      }
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

  $('label').click(function(e) {
    vis.category = e.target.childNodes[1].defaultValue;
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

  let legCell = $(".cell").first().children('text').first()
  let bound = legCell.text().split(" ")[2];
  const categories = ["population", "walkscore", "bikescore", "transitscore"];
  if(categories.includes(vis.category)){
    legCell.text("< " + bound);
  }
};
