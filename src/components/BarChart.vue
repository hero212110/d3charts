<template>
  <div>
    <svg :ref="id" style="background-color:mintcream" />
  </div>
</template>

<script>
import * as d3 from "d3";
import Axis from "@/js/Axis";
import date_CNtoEN from "@/js/date_CNtoEN";
export default {
  data: () => ({ id: "" }),
  props: ["data", "dateType"],

  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      // let data = {
      //   name: ["a", "b", "c"],
      //   date: [2013, 2014, 2015, 2016, 2017, 2018, 2019],
      //   value: [
      //     [1, 2, 3, 4, 5, 6, 7],
      //     [6, 7, 8, 9, 1, 6, 7],
      //     [11, 12, 13, 14, 15, 7, 8]
      //   ]
      // };
      //data.date = [2019, 2018, 2017, 2016, 2015, 2014, 2013];
      d3.select(this.$refs[this.id]).html("");
      let data = Object.assign({}, this.data);
  
      let tmp = date_CNtoEN(this.dateType);
      var formatDate = d3.timeFormat(tmp);
      for (let i in data.date) {
        for (let j in data.date[i]) {
          let date = new Date(data.date[i][j]);
          //data.date[i][j] = parseInt(formatDate(date));
          data.date[i][j] = formatDate(date);
        }
        if (data.date[i][0] > data.date[i][1]) {
          data.date[i].reverse();
          data.value[i].reverse();
        }
      }
      let tmpDate = [].concat(...data.date);
      //去除陣列中重複元素
      let flatDate = tmpDate.filter(function(element, index, arr) {
        return arr.indexOf(element) === index;
      });
      flatDate = flatDate.sort();

      //date補上 , value補0
      for (let i in flatDate) {
        for (let j in data.date) {
          if (flatDate[i] != data.date[j][i]) {
            data.date[j].splice(i, 0, flatDate[i]);
            data.value[j].splice(i, 0, 0);
          }
        }
      }
      //console.log(data)

      //將陣列扁平化
      let flatValue = [].concat(...data.value);
      var margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width = 350 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
      var y = d3
        .scaleLinear()
        .domain([d3.min(flatValue) * 0.9, d3.max(flatValue)])
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
        .scaleBand()
        .domain(flatDate)
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
        .attr("transform", function() {
          return "translate(5,0)";
        })
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