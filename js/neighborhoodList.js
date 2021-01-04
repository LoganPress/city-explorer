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
        if (vis.data.map((d) => d.nid).includes(neighborhood.nid)) {
            let index = vis.data.indexOf(vis.data.find((d) => d.nid == neighborhood.nid));
            vis.data.splice(index, 1);
        } else {
            vis.data.push(neighborhood);
        }
    }
    
    console.log(vis.data);

    vis.rects = vis.svg.selectAll(".selected-box")
        .data(vis.data, (d) => d.nid)
        .enter()
        .append("rect")
            .attr("height", 20)
            .attr("width", 20)
            .attr("x", vis.svg.attr("width") / 2 - 100)
            .attr("y", (d, i) => 30 * i + 5)
            .attr("class", "selected-box")
            .attr("id", (d) => "selected-box-" + d.nid)
            .attr("fill", (d) => "rgb(" + d.color.join(",") + ")")
            .on("click", function(e, d) {
                cityVis.selectedNeighborhoods[d.nid-1] = !cityVis.selectedNeighborhoods[d.nid-1];
                cityVis.updateVis();
                cityVis.parallelPlot.updateVis(cityVis.data[d.nid-1]);
                vis.updateVis(d);
            });

    vis.rects.exit().remove();

    vis.names = vis.svg.selectAll(".selected-name")
        .data(vis.data, (d) => d.nid)
        .enter()
        .append("text")
            .text((d) => d.name)
            .attr("x", vis.svg.attr("width") / 2 - 50)
            .attr("y", (d, i) => 30 * i + 20)
            .attr("class", "selected-name")
            .style("text-anchor", "start")
            .style("font-weight", "bold")
            .style("font-size", 18)
            .attr("fill", "black");

    vis.names.exit().remove();

}