/* 
    The visualization for the neighborhoods
*/

NeighborhoodMap = function(_parentElement, _data, _geoFeatures, _mapPosition) {

	this.parentElement = _parentElement;
	this.data = _data;
    this.geoFeatures = _geoFeatures;
    this.mapPosition = _mapPosition;

	this.initVis();
}


NeighborhoodMap.prototype.initVis = function() {
    let vis = this;
    vis.map = L.map(vis.parentElement).setView(vis.mapPosition, 12);
    L.geoJson(vis.geoFeatures, {
        color: "#3F7484",
        weight: 2,
        opacity: 0.7
    }).addTo(vis.map);
    L.Icon.Default.imagePath = 'img/';
    L.tileLayer('https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: 'abcd',
        accessToken: 'OL92SkQlTl9fHnhOmNS7AuDHe96QqXOSyikpwgcAP2vjWrP0hamS3SxZz9a73iLf'
    }).addTo(vis.map);
    L.layerGroup().addTo(vis.map);

    // vis.margin = { left: 0, top: 0, right: 0, bottom: 0 }
    // vis.width = 700 - vis.margin.left - vis.margin.right;
    // vis.height = 500 - vis.margin.top - vis.margin.bottom;
    // vis.svg = d3.select("#" + vis.parentElement)
    //     .append("svg")
    //     .attr("width", vis.width)
    //     .attr("height", vis.height)
    //     .attr("id", "neighborhood-map");

    vis.wrangleData();
};

NeighborhoodMap.prototype.wrangleData = function() {
    let vis = this;

    d3.csv('/data/transit/shapes.csv').then(function(data) {
        console.log(data);
        data.forEach(function(d){
            d.shape_pt_lat = +d.shape_pt_lat;
            d.shape_pt_lon = +d.shape_pt_lon;
        })
        
        L.geoJson(data, {
            color: "black",
            weight: 2,
            opacity: 0.8
        }).addTo(vis.map);
    });

    vis.updateVis();
};

NeighborhoodMap.prototype.updateVis = function() {
    let vis = this;

    // let projection = d3.geoMercator()
    //     .translate([vis.width / 2, vis.height / 2])
    //     .scale(200);
    // let path = d3.geoPath().projection(projection);
    // let city = vis.data.features;

    // let map = vis.svg.selectAll("path")
    //     .data(city)
    //     .enter()
    //     .append("path")
    //     .attr("d", path)
    //     .attr("fill", "white")
    //     .attr("stroke-width", 1)
    //     .attr("stroke", "black");

    // map.exit().remove();
};