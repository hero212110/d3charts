<template>
  <div>
    <svg :ref="id" style="background-color:azure" />
  </div>
</template>


<script>
import * as d3 from "d3";
import Axis from "@/js/Axis";
import date_CNtoEN from "@/js/date_CNtoEN";
export default {
  data() {
    return {
      id: ""
    };
  },
  props: ["data", "dateType"],
  mounted() {
    //console.log(this.data.date)
    this.drawChart();
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
      d3.select(this.$refs[this.id]).html("");
      let data = this.data;

      let tmp = date_CNtoEN(this.dateType);
      var formatDate = d3.timeFormat(tmp);
      for (let i in data.date) {
        //console.log(data.date[i]);
        let date = new Date(data.date[i]);
        // data.date[i] = parseInt(formatDate(date));
        data.date[i] = formatDate(date);
      }

      //如果日期是由大到小 就reverse 變成 由小到大
      if (parseInt(data.date[0]) > parseInt(data.date[1])) {
        data.date.reverse();
        for (let i in data.value) {
          data.value[i].reverse();
        }
      }
      //console.log(data.date)

      //檢查date 是否為連續 , 如果不連續date就補上對應日期 , value就補0
      for (let i = 0; i < data.date.length - 1; i++) {
        if (parseInt(data.date[i]) - parseInt(data.date[i + 1]) < -1) {
          data.date.splice(i + 1, 0, (parseInt(data.date[i]) + 1).toString());
          data.value[0].splice(i + 1, 0, 0);
        }
      }

      // console.log((parseInt(d3.max(data.date))+1).toString())
      // console.log(data.date);
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
        .domain([
          d3.min(data.date),
          (parseInt(d3.max(data.date)) + 1).toString()
        ])
        // .scaleBand()
        // .domain(data.date)
        .range([0, width]);
      var yScale = d3
        .scaleLinear()
        .domain([d3.min(flatValue) * 0.9, d3.max(flatValue)])
        .range([height, 0]);
    
      var svg = d3
        .select(this.$refs[this.id])
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

      //用import進來的Axis函數 畫出x,y軸
      Axis(xScale, yScale, svg, height, 0);

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