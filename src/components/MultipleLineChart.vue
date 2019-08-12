<template>
  <div id="chart">
    <svg id="line" style="background-color:whitesmoke" />
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  //props: ["data", "dateType"],

  data() {
    return {};
  },

  mounted() {
    //console.log(this.data);
    this.drawChart();
  },
  methods: {
    drawChart() {
      var margin = { top: 30, right: 20, bottom: 70, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

      // Parse the date / time
      var parseDate = d3.timeParse("%Y");

      // Set the ranges
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

      // Define the line
      var priceline = d3
        .line()
        .x(function(d) {
          return x(d.date);
        })
        .y(function(d) {
          return y(d.price);
        });

      // Adds the svg canvas
      var svg = d3
        .select("svg#line")
        //.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Get the data

      let data = [
        { symbol: "測試一", date: "2019", price: 5.285 },
        { symbol: "測試一", date: "2018", price: 5.7505 },
        { symbol: "測試一", date: "2017", price: 5.026 },
        { symbol: "測試一", date: "2016", price: 4.1685 },
        { symbol: "測試一", date: "2015", price: 4.6795 },
        { symbol: "測試一", date: "2014", price: 4.109 },
        { symbol: "測試一", date: "2013", price: 3.8395 },
        { symbol: "測試二", date: 2019, price: 6.888 },
        { symbol: "測試二", date: 2018, price: 6.916 },
        { symbol: "測試二", date: 2017, price: 7.0 },
        { symbol: "測試二", date: 2016, price: 7.43 },
        { symbol: "測試二", date: 2015, price: 7.665 },
        { symbol: "測試二", date: 2014, price: 7.875 },
        { symbol: "測試二", date: 2013, price: 8.155 }
      ];

      data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.price = +d.price;
      });

      // Scale the range of the data
      x.domain(
        d3.extent(data, function(d) {
          return d.date;
        })
      );
      y.domain([
        0,
        d3.max(data, function(d) {
          return d.price;
        })
      ]);

      // Nest the entries by symbol
      var dataNest = d3
        .nest()
        .key(function(d) {
          return d.symbol;
        })
        .entries(data);

      // set the colour scale
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      let legendSpace = width / dataNest.length; // spacing for the legend

      // Loop through each symbol / key
      dataNest.forEach(function(d, i) {
        svg
          .append("path")
          .attr("class", "line")
          .style("stroke", function() {
            // Add the colours dynamically
            return (d.color = color(d.key));
          })
          .attr("d", priceline(d.values));

        // Add the Legend
        svg
          .append("text")
          .attr("x", legendSpace / 2 + i * legendSpace) // space legend
          .attr("y", height + margin.bottom / 2 + 5)
          .attr("class", "legend") // style the legend
          .style("fill", function() {
            // Add the colours dynamically
            return (d.color = color(d.key));
          })
          .text(d.key);
      });

      // Add the X Axis
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add the Y Axis
      svg
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
    }
  }
};
</script>

<style scoped>
body {
  font: 12px Arial;
}

path {
  stroke: steelblue;
  stroke-width: 2;
  fill: none;
}

.axis path,
.axis line {
  fill: none;
  stroke: grey;
  stroke-width: 1;
  shape-rendering: crispEdges;
}

.legend {
  font-size: 16px;
  font-weight: bold;
  text-anchor: middle;
}
</style>