<template>
  <div id="chart">
    <svg />
  </div>
</template>


<script>
import * as d3 from "d3";
export default {
  data() {
    return {};
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      d3.select("svg").html("");
      //   var n = 5, // number of samples
      //     m = 3; // number of series

      //   var data = d3.range(m).map(function() {
      //     return d3.range(n).map(Math.random);
      //   });
      //   console.log(data);

      let data = [
        [0.1, 0.2, 0.3, 0.4, 0.5],
        [0.6, 0.7, 0.8, 0.9, 0.1],
        [0.11, 0.12, 0.13, 0.14, 0.15]
      ];

    //   let data = [
    //     [1, 2, 3, 4, 5],
    //     [6, 7, 8, 9, 1],
    //     [11, 12, 13, 14, 15]
    //   ];

      var margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width = 350 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

      var y = d3
        .scaleLinear()
        //.domain([0, 1])
        .range([height, 0]);

      var x0 = d3
        .scaleBand()
        .domain(d3.range(data[0].length))
        .range([0, width], 0.2);

      var x1 = d3
        .scaleBand()
        .domain(d3.range(data.length))
        .range([0, x0.bandwidth() - 10]);

      let z = d3.scaleOrdinal(d3.schemeCategory10);

      var xScale = d3
        //.scaleTime()
        .scaleLinear()
        .domain([0, data[0].length])
        .range([0, width]);

      var yScale = d3
        .scaleLinear()
        .domain(d3.extent(data[1]))
        //.domain(d3.extent(data[0].values, d => d.price))
        .range([height, 0]);

      var xAxis = d3.axisBottom(xScale).ticks(5);
      var yAxis = d3.axisLeft(yScale).ticks(3);

      var svg = d3
        .select("svg")
        //.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg
        .append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .style("fill", function(d, i) {
          return z(i);
        })
        .attr("transform", function(d, i) {
          return "translate(" + x1(i) + ",0)";
        })
        .selectAll("rect")
        .data(function(d) {
          return d;
        })
        .enter()
        .append("rect")
        .attr("width", x1.bandwidth())
        .attr("height", y)
        .attr("x", function(d, i) {
          return x0(i);
        })
        .attr("y", function(d) {
          return height - y(d);
        });

      //x軸
      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      //y軸
      svg
        .append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("y", -5)
        .attr("x", -5)
        .attr("transform", "rotate(0)")
        .attr("fill", "#000")
        .text("單價");
    }
  }
};
</script>

<style scoped>
.axis text {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.x.axis path {
  display: none;
}
</style>