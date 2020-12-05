NeighborhoodVis = function (_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;

  this.initVis();
};

NeighborhoodVis.prototype.initVis = function () {
  let vis = this;

  // vis.margin = { left: 0, top: 0, right: 0, bottom: 0 };
  // vis.width = 700 - vis.margin.left - vis.margin.right;
  // vis.height = 700 - vis.margin.top - vis.margin.bottom;

  // vis.svg = d3
  //   .select("#" + vis.parentElement)
  //   .append("svg")
  //   .attr("width", vis.width)
  //   .attr("height", vis.height)
  //   .attr("id", "neighborhood-vis");

  vis.parallelPlot = new ParallelPlot("parallel-plot-container", vis.data);

  vis.wrangleData();
};

NeighborhoodVis.prototype.wrangleData = function () {
  let vis = this;

  const mockObject = {
    nid: 0,
    name: "",
    population: 0,
    walkscore: 0,
    transitscore: 0,
    bikescore: 0,
    zhvi: 0,
  };

  vis.updateVis(mockObject);
};

NeighborhoodVis.prototype.updateVis = function (neighborhood) {
  let vis = this;

  $("#neighborhood-title").text(neighborhood.name);
  vis.parallelPlot.updateVis(neighborhood);
};
