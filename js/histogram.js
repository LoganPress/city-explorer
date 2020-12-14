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

    vis.width = 600 - vis.margin.right - vis.margin.left;
    vis.height = 700 - vis.margin.top - vis.margin.bottom;
    vis.padding = 50;

    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.right + vis.margin.left)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g");

    vis.histogram = d3.histogram();
    
    vis.x = d3.scaleLinear()
        .range([vis.padding, vis.width - vis.padding]);   
        
            

    vis.y = d3.scaleLinear()
        .range([vis.height, vis.padding]);

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

    vis.tooltip = d3.select("#" + vis.parentElement)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("width", "200px")
        .style("position", "relative");

    vis.ranges = {
        "population": [0, 16000],
        "walkscore": [0, 100],
        "transitscore": [0, 100],
        "bikescore": [0, 100],
        "zhvi": [0, 450000]
    };

    vis.title = vis.svg
        .append("text")
        .attr("x", vis.width/2 - 100)
        .attr("y", 20)
        .attr("class", "hist-title")
        .style("font-size", 18);

    vis.xlabel = vis.svg
        .append("text")
        .attr("x", vis.width/2 - 20)
        .attr("y", vis.height + vis.padding - 5)
        .style("font-size", 14);

    vis.ylabel = vis.svg
        .append("text")
        .text("Count")
        .attr("transform", "translate(10, 350)rotate(-90)")
        .style("font-size", 14);

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

    vis.x
        .domain([vis.ranges[category][0], vis.ranges[category][1]]);

    vis.histogram.value((d) => +d[category])
        .domain(vis.x.domain())
        .thresholds(vis.x.ticks(14));

    let displayData = vis.wrangleData(category)

    vis.bins = vis.histogram(displayData);

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

    vis.showTooltip = function(e, d) {
        let x = +e.target.getAttribute("x");
        let y = +e.target.getAttribute("height");
        vis.tooltip
            .style("z-index", "1")
            .transition()
            .duration(100)
            .style("opacity", 1);
        vis.tooltip
            .html("Range: " + d.x0 + " - " + d.x1 + " <br> " + "Count: " + d.length)
            .style("left", (x+50) + "px")
            .style("bottom", (y/2 + 100) + "px");
        }
    
    vis.hideTooltip = function(d) {
        vis.tooltip
            .style("opacity", 0)
            .style("z-index", "-1")
            .style("left", "10000px");
        }
        
    
    let rects = vis.svg.selectAll("rect").data(vis.bins);

    rects
        .enter()
        .append("rect")
        .merge(rects)
        .transition().duration(1000)
        .style("fill", function(){
            switch(category){
                case "population": return "#800080";
                case "walkscore": return "#0b759d";
                case "transitscore": return "#13d364"; 
                case "bikescore": return "#ef941b"; //#d37a06, #db902e, #c40801, #b0772c
                case "zhvi": return "#c40801";
            }
        })
        .attr("x", (d) => vis.x(d.x0) + 1)
        .attr("width", function(d){
           let width = vis.x(d["x1"]) - vis.x(d["x0"]) - 1;
           if (width > 0) {
               return width;
            }else{
                return 0;
            }
        })
        .attr("y", (d) => vis.y(d["length"]))
        .attr("height", (d) => vis.height - vis.y(d["length"]));

    rects.exit()
        .transition()
        .attr("y", vis.y(0))
        .attr("height", 0)
        .transition()
        .remove();

    rects = vis.svg.selectAll("rect").data(vis.bins)
        .on("mouseover", vis.showTooltip)
        .on("mouseleave", vis.hideTooltip);

    const catString = $("#mapCategory option:selected").text();

    vis.title.text("Histogram Showing Distribution of " + catString);
    
    let xlabels = {
        "population": "Number of people",
        "walkscore": "Score out of 100",
        "transitscore": "Score out of 100",
        "bikescore": "Score out of 100",
        "zhvi": "Dollars"
    }

    vis.xlabel.text(xlabels[category]);
}