<template>
  <div id="chart"></div>
</template>


<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      models: [
        {
          model_name: "f1",
          field1: 19,
          field2: 83,
          field3: 33
        },
        {
          model_name: "f2",
          field1: 67,
          field2: 93,
          field3: 43
        },
        {
          model_name: "f3",
          field1: 10,
          field2: 56,
          field3: 53
        },
        {
          model_name: "f4",
          field1: 98,
          field2: 43,
          field2: 63
        }
      ]
    };
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      let models = this.models;
      // console.log(models);
      // models = models.map(i => {
      //   i.model_name = i.model_name;
      //   return i;
      // });
      console.log(models);
      var container = d3.select("#chart"),
        width = 500,
        height = 300,
        margin = { top: 30, right: 20, bottom: 30, left: 50 },
        barPadding = 0.2,
        axisTicks = { qty: 5, outerSize: 0, dateFormat: "%m-%d" };

      var svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      var xScale0 = d3
        .scaleBand()
        .range([0, width - margin.left - margin.right])
        .padding(barPadding);
      var xScale1 = d3.scaleBand();
      var yScale = d3
        .scaleLinear()
        .range([height - margin.top - margin.bottom, 0]);

      var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
      var yAxis = d3
        .axisLeft(yScale)
        .ticks(axisTicks.qty)
        .tickSizeOuter(axisTicks.outerSize);

      xScale0.domain(models.map(d => d.model_name));
      xScale1.domain(["field1", "field2"]).range([0, xScale0.bandwidth()]);
      yScale.domain([
        0,
        d3.max(models, d => (d.field1 > d.field2 ? d.field1 : d.field2))
      ]);

      var model_name = svg
        .selectAll(".model_name")
        .data(models)
        .enter()
        .append("g")
        .attr("class", "model_name")
        .attr("transform", d => `translate(${xScale0(d.model_name)},0)`);

      /* Add field1 bars */
      model_name
        .selectAll(".bar.field1")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar field1")
        .style("fill", "blue")
        .attr("x", d => xScale1("field1"))
        .attr("y", d => yScale(d.field1))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
          return height - margin.top - margin.bottom - yScale(d.field1);
        });

      /* Add field2 bars */
      model_name
        .selectAll(".bar.field2")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar field2")
        .style("fill", "red")
        .attr("x", d => xScale1("field2"))
        .attr("y", d => yScale(d.field2))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
          return height - margin.top - margin.bottom - yScale(d.field2);
        });

      // Add the X Axis
      svg
        .append("g")
        .attr("class", "x axis")
        .attr(
          "transform",
          `translate(0,${height - margin.top - margin.bottom})`
        )
        .call(xAxis);

      // Add the Y Axis
      svg
        .append("g")
        .attr("class", "y axis")
        .call(yAxis);
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