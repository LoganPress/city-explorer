/* 
    Histogram showing distribution of selected feature
*/
Histogram = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}

Histogram.prototype.initVis = function() {
    let vis = this;
    
    vis.margin = { top: 20, right: 10, bottom: 60, left: 50 };

    vis.width = 900 - vis.margin.right - vis.margin.left;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;
    vis.padding = 20;

    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.right + vis.margin.left)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g");

    vis.histogram = d3.histogram();
    
    vis.x = d3.scaleLinear()
        .range([vis.padding, vis.width - vis.padding]);   
        
            

    vis.y = d3.scaleLinear()        
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom();

    vis.yAxis = d3.axisLeft();

    vis.xGroup = vis.svg
        .append("g")
        .attr("transform", "translate(0, " + (vis.height) + ")")
        .attr("class", "axis x-axis");

    vis.yGroup = vis.svg
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + vis.padding + ", 0)");

    $("#mapCategory").change(function () {
        vis.updateVis();
    });

    vis.tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("padding", "10px")

    vis.updateVis();
}

Histogram.prototype.wrangleData = function(category) {
    let vis = this;

    return vis.data.filter(function(d){
        return (+d[category] != 0);
    });
    
}

Histogram.prototype.updateVis = function(feature) {
    let vis = this;

    const category = $("#mapCategory").val();
    console.log(category);

    vis.x
        .domain([0, d3.max(vis.data, (d) => d[category])]);
    
    vis.histogram.value((d) => +d[category])
        .domain(vis.x.domain())
        .thresholds(vis.x.ticks(14));

    let displayData = vis.wrangleData(category)

    vis.bins = vis.histogram(displayData);
    console.log(vis.bins);
    vis.xAxis.scale(vis.x);

    vis.y.domain([0, d3.max(vis.bins, (d) => d.length)]);

    vis.yAxis
        .scale(vis.y)
        .ticks(8);

    vis.xGroup
        .transition()
        .duration(1500)
        .call(vis.xAxis);

    vis.yGroup
        .transition()
        .duration(1500)
        .call(vis.yAxis);

    let showTooltip = function(d) {
        vis.tooltip
            .transition()
            .duration(100)
            .style("opacity", 1)
        vis.tooltip
            .html("Range: " + d.x0 + " - " + d.x1 + " <br> " + "Count: " + d.length)
            .style("left", (d3.mouse(this)[0]+20) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
        }
    
    let moveTooltip = function(d) {
        vis.tooltip
        .style("left", (d3.mouse(this)[0]+20) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
        }
        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    
    let hideTooltip = function(d) {
        tooltip
            .transition()
            .duration(100)
            .style("opacity", 0)
        }
        
    
    let rects = vis.svg.selectAll("rect").data(vis.bins);

    rects
        .enter()
        .append("rect")
        .merge(rects)
        .transition()
        .style("fill", function(){
            switch(category){
                case "population": return "purple";
                case "walkscore": return "#084d60";
                case "transitscore": return "#00a5a5"; 
                case "bikescore": return "#b0772c"; //#d37a06, #db902e, #c40801
                case "zhvi": return "#c40801";
            }
        })
        .transition()
        .attr("x", (d) => vis.x(d.x0) + 1)
        .attr("y", vis.y(0))
        .attr("height", 0)
        .attr("width", (d) => vis.x(d["x1"]) - vis.x(d["x0"]) - 1)
        .transition()
        .attr("y", (d) => vis.y(d["length"]))
        .attr("height", (d) => vis.height - vis.y(d["length"]));
        

    rects.exit()
        .transition()
        .attr("y", vis.y(0))
        .attr("height", 0)
        .transition()
        .remove();
}