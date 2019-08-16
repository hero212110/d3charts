import * as d3 from 'd3';
//繪製x,y軸的函數
function Axis(xScale, yScale,svg, height, margin ) {
    let xAxis = d3.axisBottom(xScale).ticks(5);
    let yAxis = d3.axisLeft(yScale).ticks(3);

    //x軸
    svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height - margin})`)
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

export default Axis;