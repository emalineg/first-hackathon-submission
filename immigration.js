const canvas = d3.select(".canva");

const svg = canvas.append("svg")
            .attr("width", 900)
            .attr("height", 900);

            var padding = 1.5,
            clusterPadding = 16,
            maxRadius = 15;

const margin = {top: 20, right: 20, bottom: 70, left: 70};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const mColors = d3.scaleOrdinal(d3['schemeSet2']);
const mainCanvas = svg.append("g")
                .attr("width", graphWidth / 2)
                .attr("height",  graphHeight / 2)
                .attr("transform", `translate(${margin.left},
                    ${margin.top + 160 })`);

var formatComma = d3.format(",");

var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([0, -3])
            .direction("e")
            .html(function(d) {
                console.log(d);                
                console.log(d.form_type);

                var mainHtml = "<div id='thumbnail'><h3> Form: " + d.form_type + "</h3></div>"
                +"Pending" + ": <span style='color:orange'>" + formatComma(d.pending) + "</span>"
                +"<p>Denied: " + "<span style='color:orangered'>" + formatComma(d.denied)+"</span> </p>"
                +"<p>Approved: " + "<span style='color:orange'>" + formatComma(d.approved)+"</span> </p>"
                +"<p>Total Received: " + "<span style='color:orange'>" + formatComma(d.received)+"</span> </p>"
                +"<p>Description: " + "<span style='color:orange'>" + d.form_description+"</span> </p>"
                +"<p>Base Type: " + "<span style='color:orange'>" +d.base_type+"</span> </p>"; 

                return mainHtml;
            });

const legendGroup = svg.append("g")
            .attr("transform", `translate(${graphWidth-40}, 30)`)
            .attr("class", "colorLegend");

const legend = d3.legendColor()
                .shape("circle")
                .shapePadding(4)
                .title("Color Legend")
                .scale(mColors);

const scaleLegendGroup = svg.append("g")
                            .attr("class", "scale-legend")
                            .attr("transform", `translate(${graphWidth / 2 -100}, 30)`);

const scaleLegend = d3.scaleLinear();

const legendSize = d3.legendSize()
                        .scale(scaleLegend)
                        .shape("circle")
                        .title("Size Legend")
                        .shapePadding(12)
                        .labelOffset(20)
                        .orient("horizontal")
                        .labels(["Fewer Applications Received",
                              "", "", "", "More Applications Received"
                        ])
                        .labelWrap(30)
                        .shapeWidth(40)
                        .labelAlign("start")

mainCanvas.call(tip);

function getCSVData(){
   d3.csv("uscis-forms-new.csv", function(d){
     
      return d;

   }).then(function(data){

    var radiusScale = d3.scaleLinear()
                        .domain(d3.extent(data, function(d) {
                        return +d.received;
                        }))
                        .range([10, maxRadius + 80]);

    var numberOfBaseTypesScale = d3.scaleOrdinal()
                                    .domain(data.map( d => d.category_code));

    var distinctTypesScale = numberOfBaseTypesScale.domain().length;
      
    var clusters = new Array(distinctTypesScale)
       
    var legendColorsArray = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854"]

    scaleLegend.domain(d3.extent(data, function(d){return +d.received}))
                .range([10, maxRadius])
     
      mColors.domain(data.map( d => d.base_type))
            .range(legendColorsArray);

      //Add Legend
     legendGroup.call(legend);
     
     legendGroup.selectAll("text")
                  .attr("fill", "white")

      

      scaleLegendGroup.call(legendSize);
      scaleLegendGroup.selectAll("text")
                      .attr("fill", "white")

     scaleLegendGroup.select("g")
     .attr("fill", "#8da0cb")

    var nodes = d3.range(data.length)
                    .map(function(d) {
                       
                       let i = +data[d].category_code,
                           r = radiusScale(data[d].received);


                        d = {
                            cluster: i,
                            radius: r,
                            base_type: data[d].base_type,
                            form_type: data[d].form_type,
                            form_description: data[d].form_description,
                            received: data[d].received,
                            denied: data[d].denied,
                            approved: data[d].approved,
                            pending: data[d].pending,
                            x: Math.cos(d / data.length * 2 * Math.PI) * 200 + graphWidth / 2 + Math.random(),
                            y: Math.sin(d / data.length * 2 * Math.PI) * 200 + graphHeight / 2 + Math.random()
                        };
                        
                        if (!clusters[i] || (r > clusters[i].radius)) {
                            clusters[i] = d;
                        } 
                            return d;    
                    });

                    

                    var force = d3.forceSimulation()
                        .force("center", d3.forceCenter(graphWidth/2, graphHeight/2))
                        .force("cluster", cluster()
                            .strength(0.7)) 
                        .force("collide", d3.forceCollide(d => d.radius + padding )
                            .strength(0.9))
                            .velocityDecay(0.4)
                            .on("tick", layoutTick)
                            .nodes(nodes);

                  
            var node = mainCanvas.selectAll("circle")
                .data(nodes)
                .enter()
                .append("circle")
                .style("fill", function(d) {
                    return mColors(d.cluster / distinctTypesScale)
                })

            node.transition()
                        .duration(700)
                        .delay(function(d, i) {
                            return i * 5
                        })
                        .attrTween("r", function(d){
                             var i = d3.interpolate(0, d.radius);

                             return function(t) { return d.radius = i(t)}
                        });


            function layoutTick(e) {
                
                node.attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .attr("r", d => d.radius)
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide)
            }




            //Cluster function
            // Move d to be adjacent to the cluster node.
           // from: https://bl.ocks.org/mbostock/7881887
                             
    function cluster() {
                
            var nodes,
                strength = 0.1;

            function force (alpha) {

                // scale + curve alpha value
                alpha *= strength * alpha;

                nodes.forEach(function(d) {
                        var cluster = clusters[d.cluster];
                    if (cluster === d) return;
                
                  let x = d.x - cluster.x,
                      y = d.y - cluster.y,
                      l = Math.sqrt(x * x + y * y),
                      r = d.radius + cluster.radius;

                if (l != r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    cluster.x += x;
                    cluster.y += y;
                }
                });

            }

            force.initialize = function (_) {
                nodes = _;
            }

            force.strength = _ => {
                strength = _ == null ? strength : _;
                return force;
            };

            return force;

            }
                    

                    
                    
                    
      
   })
}


getCSVData();


