let cityVis;
let neighborhoodVis;
let histogram;

function btnClicked(){
  location.href = "/EvaluationCzar/ProcessBook.html"
}

$(".helptip").tooltip(); // Bootstrap documentation

$.getJSON("data/Neighborhood_Boundaries.json", function (geoFeatures) {
  const mapPosition = [38.636118, -90.250592];
  $.getJSON("data/transit/metro.json", function (geoFeaturesMetro) {
    $.getJSON("data/Neighborhood_Stats.json", function (nbhdStats) {
      neighborhoodVis = new NeighborhoodVis("neighborhood-vis-container", nbhdStats.features);

      cityVis = new CityMap(
        "city-vis-container",
        nbhdStats.features,
        geoFeatures.features,
        mapPosition,
        geoFeaturesMetro.features,
        neighborhoodVis
      );
      
      // Rest In Peace
      // histogram = new Histogram("hist-container", nbhdStats.features);
    });
  });
});
