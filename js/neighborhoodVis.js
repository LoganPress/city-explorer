

NeighborhoodVis = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}

NeighborhoodVis.prototype.initVis = function() {
    let vis = this;

    vis.margin = { left: 0, top: 0, right: 0, bottom: 0 };
    vis.width = 700 - vis.margin.left - vis.margin.right;
    vis.height = 700 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + parentElement)
        .append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .attr("id", "neighborhood-vis");

    vis.wrangleData();
}

NeighborhoodVis.prototype.wrangleData = function() {
    let vis = this;
    
    vis.updateVis();
}

NeighborhoodVis.prototype.updateVis = function() {
    let vis = this;
    
}