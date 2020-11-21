/* 
    The visualization for the neighborhoods
*/

NeighborhoodMap = function(_parentElement, _data, _geoFeatures) {

	this.parentElement = _parentElement;
	this.data = _data;
	this.geoFeatures = _geoFeatures;

	this.initVis();
}


NeighborhoodMap.prototype.initVis = function() {
    let vis = this;
    vis.margin = { left: 0, top: 0, right: 0, bottom: 0 }
    vis.width = 700 - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;
    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .attr("id", "neighborhood-map");
    vis.wrangleData();
};

NeighborhoodMap.prototype.wrangleData = function() {
    let vis = this;

    vis.updateVis();
};

NeighborhoodMap.prototype.updateVis = function() {
    let vis = this;

    let projection = d3.geoMercator()
        .translate([vis.width / 2, vis.height / 2])
        .scale(200);
    let path = d3.geoPath().projection(projection);
    let city = vis.data.features;

    let map = vis.svg.selectAll("path")
        .data(city)
        .enter()
        .append("path")
        .attr("d", path);

    map.exit().remove();
};