let neighborhoodVis;

$.getJSON("/data/Neighborhood_Boundaries.json", function(geoFeatures) {
    const mapPosition = [38.636118, -90.250592];
    neighborhoodVis = new NeighborhoodMap("neighborhood-vis", [], geoFeatures.features, mapPosition);
});