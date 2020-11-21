d3.json("/data/Neighborhood_Boundaries.json").then(function(data) {
    let neighborhoodVis = new NeighborhoodMap("neighborhood-vis", data)
})