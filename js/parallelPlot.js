/*
    Constructs parallel plot with neighborhoods as series
    With help from https://www.d3-graph-gallery.com/graph/parallel_basic.html
*/
ParallelPlot = function(_parentElement, _data, _neighborhood) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.neighborhood = _neighborhood;

    this.initVis();
}

ParallelPlot.prototype.initVis = function() {
    let vis = this;

    vis.margin = { left: 0, top: 0, right: 0, bottom: 0 };
    vis.height = 400 - vis.margin.top - vis.margin.bottom;
    vis.width = 800 - vis.margin.left - vis.margin.right;
    vis.padding = 5;

    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("height", vis.height)
        .attr("width", vis.width)
        .attr("id", "parallel-plot");

    const parkIds = [80, 81, 82, 83, 84, 85, 86, 87, 88];

    vis.data = vis.data.filter((d) => !parkIds.includes(d.nid));

    vis.axes = ["population", "walkscore", "transitscore", "bikescore", "zhvi"];

    vis.scales = {};

    vis.axes.forEach(function(axis) {
        vis.scales[axis] = d3.scaleLinear()
            .domain([
                d3.min(vis.data, (d) => d[axis]), 
                d3.max(vis.data, (d) => d[axis])
            ])
            .range([vis.height - vis.padding, vis.padding]);
    });

    vis.horizontal = d3.scalePoint()
        .range([0, vis.width])
        .padding(1)
        .domain(vis.axes);
    
    function path(d) {
        return d3.line()(vis.axes.map((axis) => [vis.horizontal(axis), vis.scales[axis](d[axis])]));
    }

    vis.series = vis.svg.selectAll(".parallel-path")
        .data(vis.data)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#24A0ED")
        .attr("stroke-width", 1)
        .attr("opacity", 0.6)
        .attr("class", "parallel-path")
        .attr("id", (d) => "parallel-path-" + d.nid);
    
    vis.axisGroups = vis.svg.selectAll("g")
        .data(vis.axes)
        .enter()
        .append("g")
        .attr("transform", (d) => "translate(" + vis.horizontal(d) + ", 0)")
        .each(function(d) {
            d3.select(this).call(d3.axisLeft().scale(vis.scales[d]));
        });

    vis.wrangleData();
}

ParallelPlot.prototype.wrangleData = function() {
    let vis = this;

    vis.updateVis({ nid: 0 })
}

ParallelPlot.prototype.updateVis = function(_neighborhood) {
    let vis = this;

    vis.neighborhood = _neighborhood;

    if (vis.neighborhood.nid != 0) {
        vis.data.forEach((d) => {
            if (vis.neighborhood.nid != d.nid) {
                $("#parallel-path-" + d.nid).css({
                    "stroke": "#24A0ED",
                    "stroke-width": 1,
                    "opacity": 0.2
                });
            } else {
                $("#parallel-path-" + d.nid).css({
                    "stroke": "red",
                    "stroke-width": 2,
                    "opacity": 1
                });
            }
        });
    }
}