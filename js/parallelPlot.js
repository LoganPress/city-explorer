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

    /* 
        Thanks to rink.attendant.6 at 
        https://stackoverflow.com/questions/18387490/how-do-i-convert-a-height-of-an-element-given-in-vh-to-pixels
        for viewer height/width to pixel conversions
    */
    vis.margin = { left: 0, top: 15, right: 0, bottom: 20 };
    vis.height = $(window).height() * 0.5 + vis.margin.top + vis.margin.bottom;
    vis.width = $(window).width() * 0.5 + vis.margin.left + vis.margin.right;

    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("height", vis.height)
        .attr("width", vis.width)
        .attr("id", "parallel-plot");

    const parkIds = [80, 81, 82, 83, 84, 85, 86, 87, 88];

    vis.data = vis.data.filter((d) => !parkIds.includes(d.nid));

    vis.selectedNeighborhoods = new Array(79);
    for (let i=0; i<vis.selectedNeighborhoods.length; i++) {
        vis.selectedNeighborhoods[i] = {
            selected: false,
            color: [
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256)
            ]
        };
    }
    vis.numSelected = 0;

    vis.axes = [
        {
            id: "population",
            name: "Population",
            range: [0, 16000]
        },
        {
            id: "walkscore",
            name: "Walk Score",
            range: [0, 100]
        },
        {
            id: "transitscore",
            name: "Transit Score",
            range: [0, 100]
        },
        {
            id: "bikescore",
            name: "Bike Score",
            range: [0, 100]
        },
        {
            id: "zhvi",
            name: "Home Value Estimate",
            range: [0, 450000]
        }
    ];

    vis.scales = {};

    vis.axes.forEach(function(axis) {
        vis.scales[axis.id] = d3.scaleLinear()
            .domain([
                axis.range[0],
                axis.range[1]
            ])
            .range([vis.height - vis.margin.bottom, vis.margin.top]);
    });

    vis.horizontal = d3.scalePoint()
        .range([0, vis.width])
        .padding(0.7)
        .domain(vis.axes.map((d) => d.id));
    
    function path(d) {
        return d3.line()(vis.axes.map(function(axis) {
            return [
                vis.horizontal(axis.id),
                vis.scales[axis.id](d[axis.id]) + vis.margin.top
            ];
        }));
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
            .attr("transform", (d) => "translate(" + vis.horizontal(d.id) + "," + vis.margin.top + ")")
            .each(function(d) {
                d3.select(this).call(d3.axisLeft().scale(vis.scales[d.id]));
            })
        .append("text")
            .text((d) => d.name)
            .style("text-anchor", "center")
            .style("font-weight", "bold")
            .style("font-size", "12px")
            .attr("y", 0)
            .attr("fill", "black");

    vis.wrangleData();
}

ParallelPlot.prototype.wrangleData = function() {
    let vis = this;

    vis.updateVis({ nid: 0 })
}

ParallelPlot.prototype.updateVis = function(neighborhood) {
    let vis = this;

    if (neighborhood.nid != 0) {
        let newIndex = neighborhood.nid - 1;
        if (vis.selectedNeighborhoods[newIndex].selected) {
            vis.selectedNeighborhoods[newIndex].selected = false;
            vis.numSelected--;
        } else {
            vis.selectedNeighborhoods[newIndex].selected = true;
            vis.numSelected++;
        }

        vis.data.forEach((d) => {
            let index = d.nid - 1;
            if (vis.numSelected == 0) {
                d3.select("#parallel-path-" + d.nid)
                    .style("stroke", "#24A0ED")
                    .style("stroke-width", 1)
                    .style("opacity", 1);
            } else if (!vis.selectedNeighborhoods[index].selected) {
                d3.select("#parallel-path-" + d.nid)
                    .style("stroke", "#24A0ED")
                    .style("stroke-width", 1)
                    .style("opacity", 0.2);
            } else {
                d3.select("#parallel-path-" + d.nid)
                    .style("stroke", "rgb(" + vis.selectedNeighborhoods[index].color.join(",") + ")")
                    .style("stroke-width", 4)
                    .style("opacity", 1);
            }
        });
    }
}