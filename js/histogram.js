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

    vis.width = 700 - vis.margin.right - vis.margin.left;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;
    vis.padding = 20;

    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.right + vis.margin.left)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g");

    vis.x = d3.scaleLinear()        
        .domain([0, d3.max(vis.data, (d) => d.population)])
        .range([vis.padding, vis.width - vis.padding]);
    
    vis.histogram = d3.histogram()
        .value((d) => +d.population)
        .domain(vis.x.domain())
        .thresholds(vis.x.ticks(10));

    vis.bins = vis.histogram(vis.data);

    vis.y = d3.scaleLinear()        
        .domain([0, d3.max(vis.bins, (d) => d.length)])
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y)
        .ticks(10);

    vis.xGroup = vis.svg
        .append("g")
        .attr("transform", "translate(0, " + (vis.height) + ")")
        .attr("class", "axis x-axis")
        .call(vis.xAxis);

    vis.yGroup = vis.svg
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + vis.padding + ", 0)")
        .call(vis.yAxis);

    vis.svg.selectAll("rect")
        .data(vis.bins)
        .enter()
        .append("rect")
        .attr("x", (d, i) => vis.x(d.x0) + 1)
        .attr("y", (d) => vis.y(d["length"]))
        .attr("width", (d) => vis.x(d["x1"]) - vis.x(d["x0"]) - 1)
        .attr("height", (d) => vis.height - vis.y(d["length"])) 
        .style("fill", "purple");

    vis.wrangleData();
}

Histogram.prototype.wrangleData = function() {
    let vis = this;

    vis.updateVis();
}

Histogram.prototype.updateVis = function() {
    let vis = this;
}