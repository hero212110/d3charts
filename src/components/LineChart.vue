<template>
  <div>
    <svg :ref="id" style="background-color:whitesmoke" />
  </div>
</template>

<script>
import * as d3 from "d3";
import Axis from "@/js/Axis";
import date_CNtoEN from "@/js/date_CNtoEN";
export default {
  props: ["data", "dateType"],

  data() {
    return {
      id: ""
    };
  },

  mounted() {
    //console.log(this.data);
    this.drawChart();
  },

  methods: {
    drawChart() {
      d3.select(this.$refs[this.id]).html("");
      var width = 350;
      var height = 300;
      var margin = 50;
      var duration = 250;

      var lineOpacity = "0.25";
      var lineOpacityHover = "0.85";
      var otherLinesOpacityHover = "0.1";
      var lineStroke = "1.5px";
      var lineStrokeHover = "2.5px";

      var circleOpacity = "0.85";
      var circleOpacityOnLineHover = "0.25";
      var circleRadius = 3;
      var circleRadiusHover = 6;

      let data = this.data;
      //console.log(data);
      /* Format Data */

      let tmp = date_CNtoEN(this.dateType);
      var formatDate = d3.timeFormat(tmp);
      //var parseDate = d3.timeParse(tmp);

      let tmpDate = [];

      data.forEach(function(d) {
        d.values.forEach(function(d) {
          let date = new Date(d.date);
          d.date = formatDate(date);
          //d.date = parseDate(d.date);
          //console.log(d.date)
          tmpDate.push(d.date);
        });
      });

      //去除陣列中重複元素
      let flatDate = tmpDate.filter(function(element, index, arr) {
        return arr.indexOf(element) === index;
      });
      flatDate = flatDate.sort();
      //console.log(flatDate)

      let tmpPrice = [];
      for (let i in data) {
        for (let j in data[i].values) {
          //console.log(data[i].values[j].price);
          tmpPrice.push(data[i].values[j].price);
        }
      }
      //console.log(data);
      /* Scale */
      var xScale = d3
        //.scaleTime()
        // .scaleLinear()
        // .domain(d3.extent(data[0].values, d => d.date))
        .scaleBand()
        // .domain([2013,2014,2015,2016,2017,2018,2019])
        .domain(flatDate)
        .range([0, width - margin]);

      var yScale = d3
        .scaleLinear()
        //.domain(d3.extent(data[0].values, d => d.price))
        //yScale的domain必須完全涵蓋多組資料的值, 所以必須取得data的最大最小值
        .domain(d3.extent(tmpPrice))
        .range([height - margin, 0]);

      var color = d3.scaleOrdinal(d3.schemeCategory10);

      /* Add SVG */
      var svg = d3
        .select(this.$refs[this.id])
        //.append("svg")
        // .select("svg#line")
        .attr("width", width + margin + "px")
        .attr("height", height + margin + "px")
        .append("g")
        .attr("transform", `translate(${margin}, ${margin})`);

      /* Add line into SVG */
      var line = d3
        .line()
        //用defined 傳回非null的值 ****這邊不用做也沒差 , 直接在父組件那邊skip掉null值就好
        .defined(function(d) {
          return d.price != null;
        })
        .x(d => xScale(d.date) + (width - margin) / 10 - 10)
        .y(d => yScale(d.price));

      let lines = svg.append("g").attr("class", "lines");

      let lineGroup = lines.selectAll(".line-group").data(data);

      lineGroup
        .enter()
        .append("g")
        .attr("class", "line-group")
        .on("mouseover", function(d, i) {
          svg
            .append("text")
            .attr("class", "title-text")
            .style("fill", color(i))
            .text(d.name)
            .attr("text-anchor", "middle")
            .attr("x", (width - margin) / 2)
            .attr("y", 5);
        })
        .on("mouseout", function() {
          svg.select(".title-text").remove();
        })
        .append("path")
        .attr("class", "line")
        .attr("d", d => line(d.values))
        .style("stroke", (d, i) => color(i))
        .style("opacity", lineOpacity)
        .on("mouseover", function() {
          d3.selectAll(".line").style("opacity", otherLinesOpacityHover);
          d3.selectAll(".circle").style("opacity", circleOpacityOnLineHover);
          d3.select(this)
            .style("opacity", lineOpacityHover)
            .style("stroke-width", lineStrokeHover)
            .style("cursor", "pointer");
        })
        .on("mouseout", function() {
          d3.selectAll(".line").style("opacity", lineOpacity);
          d3.selectAll(".circle").style("opacity", circleOpacity);
          d3.select(this)
            .style("stroke-width", lineStroke)
            .style("cursor", "none");
        });

      /* Add circles in the line */
      lines
        .selectAll("circle-group")
        .data(data)
        .enter()
        .append("g")
        .style("fill", (d, i) => color(i))
        .selectAll("circle")
        .data(d => d.values)
        .enter()
        .append("g")
        .attr("class", "circle")
        .on("mouseover", function(d) {
          d3.select(this)
            .style("cursor", "pointer")
            .append("text")
            .attr("class", "text")
            .text(`${d.price}`)
            .attr("x", d => xScale(d.date) + 5)
            .attr("y", d => yScale(d.price) - 10);
        })
        .on("mouseout", function() {
          d3.select(this)
            .style("cursor", "none")
            .transition()
            .duration(duration)
            .selectAll(".text")
            .remove();
        })
        .append("circle")
        .attr("cx", d => xScale(d.date) + (width - margin) / 10 - 10)
        .attr("cy", d => yScale(d.price))
        .attr("r", circleRadius)
        .style("opacity", circleOpacity)
        .on("mouseover", function() {
          d3.select(this)
            .transition()
            .duration(duration)
            .attr("r", circleRadiusHover);
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(duration)
            .attr("r", circleRadius);
        });

      //用import進來的Axis函數 畫出x,y軸
      Axis(xScale, yScale, svg, height, margin);

      //x軸標籤
      svg
        .append("text")
        .attr("transform", `translate(${width / 2},${height - 10})`)
        .style("text-anchor", "middle")
        .text(`最高標借單價${this.dateType}統計圖`);

      //標題
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline");
      //.text(`${this.data[0].name}`);
    }

    // date_CNtoEN(value) {
    //   let cn = ["日", "月", "年"];
    //   let en = ["%d", "%m", "%Y"];
    //   let tmp = "";
    //   for (let i in cn) {
    //     value == cn[i] ? (tmp = en[i]) : "";
    //     //tmp = (value == cn[i]) ? en[i] : tmp;
    //   }
    //   return tmp;
    // }
  },
  watch: {
    data: "drawChart"
  }
};
</script>

<style>
svg {
  font-family: Sans-Serif, Arial;
}
.line {
  stroke-width: 2;
  fill: none;
}

.axis path {
  stroke: black;
}

.text {
  font-size: 12px;
}

.title-text {
  font-size: 12px;
}
</style>