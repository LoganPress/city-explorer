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
    vis.map = L.map(vis.parentElement).setView(vis.mapPosition, 13);
    L.geoJson(vis.geoFeatures, {
        style: {
            fill: "ADD8E6",
            color: "blue"
        },
        weight: 5,
        opacity: 0.7
    }).addTo(vis.map);
    L.Icon.Default.imagePath = '/img/';
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
   		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(vis.map);

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