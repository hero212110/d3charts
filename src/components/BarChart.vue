<template>
  <div id="barchart">
    <svg id="bar" style="background-color:azure" />
  </div>
</template>


<script>
import * as d3 from "d3";
export default {
  data() {
    return {};
  },
  props: ["data", "dateType"],
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      //   let data = {
      //     name: ["a", "b", "c"],
      //     date: [2013, 2014, 2015, 2016, 2017, 2018, 2019],
      //     value: [
      //       [1, 2, 3, 4, 5, 6, 7],
      //       [6, 7, 8, 9, 1, 6, 7],
      //       [11, 12, 13, 14, 15, 7, 8]
      //     ]
      //   };
      d3.select("svg#bar").html("");
      let data = this.data;

      let tmp = this.dateFormat(this.dateType);
      var formatDate = d3.timeFormat(tmp);
      for (let i in data.date) {
        //console.log(data.date[i]);
        let date = new Date(data.date[i]);
        data.date[i] = formatDate(date);
      }

      //如果日期是由大到小 就reverse 變成 由小到大
      if (data.date[0] > data.date[1]) {
        data.date.reverse();
        for (let i in data.value) {
          data.value[i].reverse();
        }
      }

      //console.log(data);
      //將陣列扁平化
      let flatValue = [].concat(...data.value);
      var margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width = 350 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
      var y = d3
        .scaleLinear()
        .domain([d3.min(flatValue)*0.9, d3.max(flatValue)])
        .range([0, height]);
      var x0 = d3
        .scaleBand()
        .domain(d3.range(data.value[0].length))
        .range([0, width], 0.2);
      var x1 = d3
        .scaleBand()
        .domain(d3.range(data.value.length))
        .range([0, x0.bandwidth() - 10]);
      let z = d3.scaleOrdinal(d3.schemeCategory10);
      var xScale = d3
        //.scaleTime()
        .scaleLinear()
        .domain([d3.min(data.date), d3.max(data.date)])
        .range([0, width]);
      var yScale = d3
        .scaleLinear()
        .domain([d3.min(flatValue)*0.9, d3.max(flatValue)])
        .range([height, 0]);
      var xAxis = d3.axisBottom(xScale).ticks(5);
      var yAxis = d3.axisLeft(yScale).ticks(3);
      var svg = d3
        .select("svg#bar")
        //.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      svg
        .append("g")
        .selectAll("g")
        .data(data.value)
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
    },
    dateFormat(value) {
      let cn = ["日", "月", "年"];
      let en = ["%d", "%m", "%Y"];
      let tmp = "";
      for (let i in cn) {
        value == cn[i] ? (tmp = en[i]) : "";
        //tmp = (value == cn[i]) ? en[i] : tmp;
      }
      return tmp;
    }
  },
  watch: {
    data: "drawChart"
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