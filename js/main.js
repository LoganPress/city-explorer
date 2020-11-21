let neighborhoodVis;

$.getJSON("/data/Neighborhood_Boundaries.json", function(geoFeatures) {
    const mapPosition = [38.6270, -90.1994];
    neighborhoodVis = new NeighborhoodMap("neighborhood-vis", [], geoFeatures.features, mapPosition);
});