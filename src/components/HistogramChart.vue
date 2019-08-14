<template>
  <div id="histogramchart">
    <svg id="histogram" style="background-color:azure" />
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
    //console.log(this.data);
  },
  methods: {
    drawChart() {
      // let data = {
      //   name: ["a", "b", "c"],
      //   date: [2019, 2018, 2017, 2016, 2015, 2014, 2013],
      //   value: [
      //     [4, 5, 6, 7, 6, 4, 6]
      //   ]
      // };
      d3.select("svg#histogram").html("");
      let data = this.data;

      console.log(data);

      let tmp = this.dateFormat(this.dateType);
      var formatDate = d3.timeFormat(tmp);
      for (let i in data.date) {
        //console.log(data.date[i]);
        let date = new Date(data.date[i]);
        data.date[i] = parseInt(formatDate(date));
      }

      //如果日期是由大到小 就reverse 變成 由小到大
      if (data.date[0] > data.date[1]) {
        data.date.reverse();
        for (let i in data.value) {
          data.value[i].reverse();
        }
      }
      //console.log((parseInt(data.date[data.date.length - 1]) + 1).toString());

      //檢查date 是否為連續 , 如果不連續date就補上對應日期 , value就補0
      for (let i = 0; i < data.date.length - 1; i++) {
        if (data.date[i] - data.date[i + 1] < -1) {
          data.date.splice(i + 1, 0, data.date[i] + 1);
          data.value[0].splice(i + 1, 0, 0);
        }
      }

      //histogram 包左不包右 所以要補一個右邊的刻度
      data.date.push(
        // (parseInt(data.date[data.date.length - 1]) + 1).toString()
        parseInt(data.date[data.date.length - 1]) + 1
      );

      // console.log(data);
      //將陣列扁平化
      let flatValue = [].concat(...data.value);
      //console.log(flatValue);
      var margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width = 350 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
      var y = d3
        .scaleLinear()
        .domain([d3.min(flatValue) * 0.9, d3.max(flatValue)])
        .range([0, height]);
      var x0 = d3
        .scaleBand()
        // .domain(d3.range(data.value[0].length))
        .domain(d3.range(data.value[0].length))
        .range([0, width], 0.2);
      var x1 = d3
        .scaleBand()
        .domain(d3.range(data.value.length))
        .range([0, x0.bandwidth() - 0.1]);
      let z = d3.scaleOrdinal(d3.schemeCategory10);
      var xScale = d3
        //.scaleTime()
        .scaleLinear()
        .domain([d3.min(data.date), d3.max(data.date)])
        // .scaleBand()
        // .domain(data.date)
        .range([0, width]);
      var yScale = d3
        .scaleLinear()
        .domain([d3.min(flatValue) * 0.9, d3.max(flatValue)])
        .range([height, 0]);
      var xAxis = d3.axisBottom(xScale).ticks(data.date.length);
      var yAxis = d3.axisLeft(yScale).ticks(3);
      var svg = d3
        .select("svg#histogram")
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