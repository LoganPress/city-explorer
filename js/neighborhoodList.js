/*
    Responsible for the list of currently-selected neighborhoods
*/
NeighborhoodList = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}

NeighborhoodList.prototype.initVis = function() {
    let vis = this;

    vis.margin = { left: 0, top: 0, right: 0, bottom: 0 }
    vis.height = 500 + vis.margin.top + vis.margin.bottom;
    vis.width = $(window).width() * 0.4 + vis.margin.left + vis.margin.right;

    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("height", vis.height)
        .attr("width", vis.width)
        .attr("id", "neighborhood-list");

    vis.wrangleData();
}

NeighborhoodList.prototype.wrangleData = function() {
    let vis = this;

    vis.updateVis({ nid: 0 });
}

NeighborhoodList.prototype.updateVis = function(neighborhood) {
    let vis = this;

    if (neighborhood.nid != 0) {
        if (vis.data.includes(neighborhood)) {
            let index = vis.data.indexOf(neighborhood);
            vis.data.splice(index, 1);
        } else {
            vis.data.push(neighborhood);
        }
    }

    vis.rects = vis.svg.selectAll("rect")
        .data(vis.data, (d) => d.nid)
        .enter()
        .append("rect")
        .attr("height", 20)
        .attr("width", 20)
        .attr("x", 5)
        .attr("y", (d, i) => 25 * i + 2)
        .attr("class", "selected-box")
        .attr("id", (d) => "selected-box-" + d.nid)
        .attr("fill", (d) => "rgb(" + d.color.join(",") + ")")
        .on("click", function(e, d) {
            console.log("Clicked");
        });

    vis.rects.exit().remove();
}