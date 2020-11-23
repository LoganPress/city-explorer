let cityVis;
let neighborhoodVis;

$.getJSON("/data/Neighborhood_Boundaries.json", function (geoFeatures) {
  const mapPosition = [38.636118, -90.250592];
  $.getJSON("/data/transit/metro.json", function (geoFeaturesMetro) {
    $.getJSON("/data/Neighborhood_Stats.json", function (nbhdStats) {
      neighborhoodVis = new NeighborhoodVis("neighborhood-vis-container", []);

      cityVis = new CityMap(
        "city-vis-container",
        nbhdStats.features,
        geoFeatures.features,
        mapPosition,
        geoFeaturesMetro.features,
        neighborhoodVis
      );

      const margin = { left: 0, top: 0, right: 0, bottom: 0 };
      const width = 700 - margin.left - margin.right;
      const height = 700 - margin.top - margin.bottom;
      let svg = d3
        .select("#neighborhood-vis")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "neighborhood-map");

      // let radarChart = RadarChart.chart();
      // let datum = nbhdStats.features[37];

      // svg.append("g")
      //     .attr("class", "neighborhood-radar")
      //     .datum([{
      //         axes: [
      //             { axis: "Population", value: datum.population },
      //             { axis: "Walkscore", value: datum.walkscore },
      //             { axis: "Bikescore", value: datum.bikescore },
      //             { axis: "Transitscore", value: datum.transitscore },
      //             { axis: "Home Value Index", value: datum.zhvi }
      //         ]
      //     }])
      //     .call(radarChart);

      // let projection = d3.geoMercator()
      //     .translate([width / 2, height / 2])
      //     .scale(200);
      // let path = d3.geoPath().projection(projection);
      // let city = geoFeatures.features;

      // let map = svg.selectAll("path")
      //     .data(city)
      //     .enter()
      //     .append("path")
      //     .attr("d", path)
      //     .attr("fill", "white")
      //     .attr("stroke-width", 1)
      //     .attr("stroke", "black");

      // map.exit().remove();
    });
  });
});
