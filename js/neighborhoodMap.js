/* 
    The visualization for the neighborhoods
*/

NeighborhoodMap = function(_parentElement, _data, _geoFeatures, _mapPosition, _geoFeaturesMetro) {

	this.parentElement = _parentElement;
	this.data = _data;
    this.geoFeatures = _geoFeatures;
    this.mapPosition = _mapPosition;
    this.geoFeaturesMetro = _geoFeaturesMetro;

	this.initVis();
}


NeighborhoodMap.prototype.initVis = function() {
    let vis = this;

    vis.map = L.map(vis.parentElement).setView(vis.mapPosition, 12);
    let neighborhoodLayer = L.geoJson(vis.geoFeatures, {
        color: "#3F7484",
        weight: 2,
        opacity: 0.7,
        onEachFeature: onEachNeighborhood
    });
    function onEachNeighborhood(n, layer) {
        const parkIds = [80, 81, 82, 83, 84, 85, 86, 87];
        const num = n.properties.NHD_NUM;
        const index = num - 1;
        const population = vis.data[index].population;
        layer.bindTooltip('<h2>' + n.properties.NHD_NAME + '</h2><strong>Population: ' + population + '</strong>', {
            sticky: true
        });
        if (!parkIds.includes(num)) {
            layer.on('click', function() {
                console.log(n.properties.NHD_NUM);
            });
        }
    }
    neighborhoodLayer.addTo(vis.map);
    // console.log(vis.geoFeaturesMetro);
    // L.geoJson(vis.geoFeaturesMetro, {
    //     color: "black",
    //     weight: 2,
    //     opacity: 0.8
    // }).addTo(vis.map);
    L.Icon.Default.imagePath = '/img/';
    L.tileLayer('https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 11,
        maxZoom: 13,
        subdomains: 'abcd',
        accessToken: 'OL92SkQlTl9fHnhOmNS7AuDHe96QqXOSyikpwgcAP2vjWrP0hamS3SxZz9a73iLf'
    }).addTo(vis.map);

    vis.wrangleData();
};

NeighborhoodMap.prototype.wrangleData = function() {
    let vis = this;

    // d3.csv('/data/transit/shapes.csv').then(function(data) {
    //     console.log(data);
    //     data.forEach(function(d){
    //         d.shape_pt_lat = +d.shape_pt_lat;
    //         d.shape_pt_lon = +d.shape_pt_lon;
    //     })
    // });

    vis.updateVis();
};

NeighborhoodMap.prototype.updateVis = function() {
    let vis = this;

};