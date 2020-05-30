import React from "react";
import * as d3 from "d3";

const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

//get XML data
const req = new XMLHttpRequest();
req.open("GET", dataUrl, true);
req.send();
req.onload = () => {
  const json = JSON.parse(req.responseText);
  const dataset = json.data;

  // make svg space
  const chartPad = 50;
  const chartW = dataset.length * 2 + chartPad * 2;
  const chartH = 500;
  const gdpGraph = d3
    .select("#graph")
    .append("svg")
    .attr("width", chartW)
    .attr("height", chartH);

  //make separate space for tooltip, default styles
  const tipW = 100;
  const tipH = 50;
  const tipColor = "seagreen";
  const tipX = 300;
  const tipY = 300;
  const tip = d3
    .select("#graph")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  //separate dates from money
  const dates = dataset.map((d) => d[0]);
  const gdp = dataset.map((d) => d[1]);
  const years = dates.map((date) => new Date(date).getFullYear());

  //scales
  const gdpMin = d3.min(dataset, (d) => d[1]);
  const gdpMax = d3.max(dataset, (d) => d[1]);
  const yearMin = d3.min(dataset, (d) => new Date(d[0]));
  const yearMax = d3.max(dataset, (d) => new Date(d[0]));
  const timeScale = d3
    .scaleTime()
    .domain([yearMin, yearMax])
    .range([chartPad, chartW - chartPad]);
  const gdpScale = d3
    .scaleLinear()
    .domain([0, gdpMax])
    .range([chartH - chartPad, chartPad]);

  //axes
  const yearAxis = d3.axisBottom(timeScale).tickFormat(d3.timeFormat("%Y"));
  const gdpAxis = d3.axisLeft(gdpScale);
  const xAxe = gdpGraph
    .append("g")
    .attr("transform", "translate(0, " + (chartH - chartPad) + ")")
    .attr("id", "x-axis")
    .attr("class", "tick")
    .call(yearAxis);
  const yAxe = gdpGraph
    .append("g")
    .attr("transform", "translate(" + chartPad + ", 0)")
    .attr("id", "y-axis")
    .attr("class", "tick")
    .call(gdpAxis);

  //test rect shapes
  const dataW = 2;
  const dataPoints = gdpGraph
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("fill", "seagreen")
    .attr("x", (d, i) => i * dataW + chartPad)
    .attr("y", (d) => gdpScale(d[1]))
    .attr("width", (chartW / dataset.length) * dataW)
    .attr("height", (d, i) => chartH - gdpScale(d[1]) - chartPad)
    .on("mouseover", (d) => {
      tip
        .transition()
        .duration(0)
        .style("opacity", 1)
        .style("width", tipW + "px")
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", chartH - 50 + "px");
      const tipDate = new Date(d[0]);
      tip
        .html("&#36;" + d[1] + "B<br />" + tipDate.getFullYear())
        .attr("data-date", d[0]);
    })
    .on("mouseout", (d) => {
      tip.transition().duration(200).style("opacity", 0);
    });
};
