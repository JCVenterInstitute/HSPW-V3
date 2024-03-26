import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
import "./index.css";
// create the svg are

const Chord = (props) => {
  const chartRef = useRef(null);
  const [countWholeSaliva, setCountWholeSaliva] = useState(0);
  const [countWholeSalivaOnly, setCountWholeSalivaOnly] = useState(0);
  const [countSMSLGlands, setCountSMSLGlands] = useState(0);
  const [countSMSLGlandsOnly, setCountSMSLGlandsOnly] = useState(0);
  const [countBloodPlasma, setCountBloodPlasma] = useState(0);
  const [countBloodPlasmaOnly, setCountBloodPlasmaOnly] = useState(0);
  const [countParotidGlands, setCountParotidGlands] = useState(0);
  const [countParotidGlandsOnly, setCountParotidGlandsOnly] = useState(0);
  const [countWholeSalivaAndSMSLGlands, setCountWholeSalivaAndSMSLGlands] =
    useState(0);
  const [countWholeSalivaAndBloodPlasma, setCountWholeSalivaAndBloodPlasma] =
    useState(0);
  const [
    countWholeSalivaAndParotidGlands,
    setCountWholeSalivaAndParotidGlands,
  ] = useState(0);
  const [countSMSLGlandsAndBloodPlasma, setCountSMSLGlandsAndBloodPlasma] =
    useState(0);
  const [countSMSLGlandsAndParotidGlands, setCountSMSLGlandsAndParotidGlands] =
    useState(0);
  const [
    countBloodPlasmaAndParotidGlands,
    setCountBloodPlasmaAndParotidGlands,
  ] = useState(0);
  const [isLoading, setLoading] = useState(true);

  const fetchCount = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/getChordPlotCount`
    );
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      console.error(message);
      throw new Error(message);
    }
    const data = await response.json();
    setCountWholeSaliva(data.filter_whole_saliva.doc_count);
    setCountWholeSalivaOnly(data.filter_whole_saliva_only.doc_count);
    setCountSMSLGlands(data.filter_smsl_glands.doc_count);
    setCountSMSLGlandsOnly(data.filter_smsl_glands_only.doc_count);
    setCountBloodPlasma(data.filter_blood_plasma.doc_count);
    setCountBloodPlasmaOnly(data.filter_blood_plasma_only.doc_count);
    setCountParotidGlands(data.filter_parotid_glands.doc_count);
    setCountParotidGlandsOnly(data.filter_parotid_glands_only.doc_count);
    setCountWholeSalivaAndSMSLGlands(
      data.filter_whole_saliva_and_smsl_glands.doc_count
    );
    setCountWholeSalivaAndBloodPlasma(
      data.filter_whole_saliva_and_blood_plasma.doc_count
    );
    setCountWholeSalivaAndParotidGlands(
      data.filter_whole_saliva_and_parotid_glands.doc_count
    );
    setCountSMSLGlandsAndBloodPlasma(
      data.filter_smsl_glands_and_blood_plasma.doc_count
    );
    setCountSMSLGlandsAndParotidGlands(
      data.filter_smsl_glands_and_parotid_glands.doc_count
    );
    setCountBloodPlasmaAndParotidGlands(
      data.filter_blood_plasma_and_parotid_glands.doc_count
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCount()]);

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      renderChart(
        countWholeSaliva,
        countWholeSalivaOnly,
        countSMSLGlands,
        countSMSLGlandsOnly,
        countBloodPlasma,
        countBloodPlasmaOnly,
        countParotidGlands,
        countParotidGlandsOnly,
        countWholeSalivaAndSMSLGlands,
        countWholeSalivaAndBloodPlasma,
        countWholeSalivaAndParotidGlands,
        countSMSLGlandsAndBloodPlasma,
        countSMSLGlandsAndParotidGlands,
        countBloodPlasmaAndParotidGlands
      );
    }
  }, [isLoading]);

  const renderChart = (
    countWholeSaliva,
    countWholeSalivaOnly,
    countSMSLGlands,
    countSMSLGlandsOnly,
    countBloodPlasma,
    countBloodPlasmaOnly,
    countParotidGlands,
    countParotidGlandsOnly,
    countWholeSalivaAndSMSLGlands,
    countWholeSalivaAndBloodPlasma,
    countWholeSalivaAndParotidGlands,
    countSMSLGlandsAndBloodPlasma,
    countSMSLGlandsAndParotidGlands,
    countBloodPlasmaAndParotidGlands
  ) => {
    const windowWidth = 500;
    const windowHeight = 350;
    const innerRadius = Math.min(windowWidth, windowHeight) / 3;
    const outerRadius = innerRadius * 1.04;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", windowWidth)
      .attr("height", windowHeight)
      .append("g")
      .attr(
        "transform",
        "translate(" + windowWidth / 2 + "," + windowHeight / 2 + ")"
      );

    var labels = [
      "SM/SL glands",
      "Parotid glands",
      "Whole saliva",
      "Blood plasma",
    ];

    var matrix = [
      [
        countSMSLGlandsOnly,
        countSMSLGlandsAndParotidGlands,
        countWholeSalivaAndSMSLGlands,
        countSMSLGlandsAndBloodPlasma,
      ],
      [
        countSMSLGlandsAndParotidGlands,
        countParotidGlandsOnly,
        countWholeSalivaAndParotidGlands,
        countBloodPlasmaAndParotidGlands,
      ],
      [
        countWholeSalivaAndSMSLGlands,
        countWholeSalivaAndParotidGlands,
        countWholeSalivaOnly,
        countWholeSalivaAndBloodPlasma,
      ],
      [
        countSMSLGlandsAndBloodPlasma,
        countBloodPlasmaAndParotidGlands,
        countWholeSalivaAndBloodPlasma,
        countBloodPlasmaOnly,
      ],
    ];

    var sizes = [
      countSMSLGlands,
      countParotidGlands,
      countWholeSaliva,
      countBloodPlasma,
    ];

    var fill = d3
      .scaleOrdinal()
      .range([
        "#D2D0C6",
        "#ECD08D",
        "rgb(40, 134, 210)",
        "#DB704D",
        "steelblue",
        "khaki",
        "yellowgreen",
        "crimson",
        "darkslateblue",
        "gold",
        "green",
        "khaki",
        "darkorange",
        "mediumvioletred",
        "orange",
        "rosybrown",
        "seagreen",
        "sienna",
        "springgreen",
        "teal",
        "thistle",
        "violet",
        "wheat",
        "yellowgreen",
        "royalblue",
        "powderblue",
        "steelblue",
        "Lime",
        "green",
        "Blue",
        "black",
      ]);

    var names = d3.scaleOrdinal().range(labels);

    var counts = d3.scaleOrdinal().range(sizes);

    var chord = d3.chord().padAngle(0.08).sortSubgroups(d3.ascending)(matrix);

    function getGradID(d) {
      return "linkGrad-" + d.source.index + "-" + d.target.index;
    }

    var grads = svg
      .append("defs")
      .selectAll("linearGradient")
      .data(chord)
      .enter()
      .append("linearGradient")
      .attr("id", getGradID)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", function (d, i) {
        return (
          innerRadius *
          Math.cos(
            (d.source.endAngle - d.source.startAngle) / 2 +
              d.source.startAngle -
              Math.PI / 2
          )
        );
      })
      .attr("y1", function (d, i) {
        return (
          innerRadius *
          Math.sin(
            (d.source.endAngle - d.source.startAngle) / 2 +
              d.source.startAngle -
              Math.PI / 2
          )
        );
      })
      .attr("x2", function (d, i) {
        return (
          innerRadius *
          Math.cos(
            (d.target.endAngle - d.target.startAngle) / 2 +
              d.target.startAngle -
              Math.PI / 2
          )
        );
      })
      .attr("y2", function (d, i) {
        return (
          innerRadius *
          Math.sin(
            (d.target.endAngle - d.target.startAngle) / 2 +
              d.target.startAngle -
              Math.PI / 2
          )
        );
      });

    grads
      .append("stop")
      .attr("offset", "10%")
      .attr("stop-color", function (d) {
        return fill(d.source.index);
      });

    grads
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", function (d) {
        return fill(d.target.index);
      });

    svg
      .append("g")
      .selectAll("path")
      .data(chord.groups)
      .enter()
      .append("path")
      .style("fill", function (d) {
        return fill(d.index);
      })
      .attr("class", "group")
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(function (d) {
            return d.startAngle;
          })
          .endAngle(function (d) {
            return d.endAngle;
          })
      )
      .style("stroke-width", 0.75)
      .style("stroke", function (d) {
        return fill(d.index);
      })
      .on("mouseover", fade(0.06))
      .on("mouseout", showAll);

    svg
      .append("g")
      .attr("class", "chord")
      .selectAll("path")
      .data(chord)
      .enter()
      .append("path")
      .attr("d", d3.ribbon().radius(innerRadius - 2))
      .style("fill", function (d) {
        return "url(#" + getGradID(d) + ")";
      })
      // .style("fill", function (d) {
      //   return fill(d.source.index);
      // })
      .style("stroke-width", 0.5)
      .style("stoke", function (d) {
        return fill(d.index);
      })
      .style("opacity", 1)
      .on("mouseover", selectChord)
      .on("mouseout", showAll)
      .append("title")
      .text(tooltip);

    svg
      .append("g")
      .selectAll("origin_labels")
      .data(chord.groups)
      .enter()
      .append("text")
      .each(function (d) {
        d.angle = (d.startAngle + d.endAngle) / 2;
      })
      .attr("dy", function (d) {
        return (outerRadius + 15) * Math.sin(d.angle - Math.PI / 2);
      })
      .attr("dx", function (d) {
        return (outerRadius + 15) * Math.cos(d.angle - Math.PI / 2);
      })
      .attr("angle", function (d) {
        return d.angle;
      })
      .attr("text-anchor", function (d) {
        return d.angle >= Math.PI ? "end" : null;
      })
      .attr(
        "style",
        "font-size: 16; font-weight: bold; font-family: Helvetica, sans-serif; cursor:pointer; color:white;"
      )
      .style("fill", "white")
      .text(function (d) {
        return names(d.index);
      })
      .attr("class", "text1");

    svg
      .append("g")
      .selectAll("count_labels")
      .data(chord.groups)
      .enter()
      .append("text")
      .each(function (d) {
        d.angle = (d.startAngle + d.endAngle) / 2;
      })
      .attr("dy", "1.5em")
      .attr("text-anchor", function (d) {
        return d.angle > Math.PI ? "end" : null;
      })
      .attr("dy", function (d) {
        return (outerRadius + 15) * Math.sin(d.angle - Math.PI / 2) + 15;
      })
      .attr("dx", function (d) {
        return (outerRadius + 15) * Math.cos(d.angle - Math.PI / 2);
      })
      .attr("angle", function (d) {
        return d.angle;
      })
      .attr(
        "style",
        "font-size: 12; font-family: Helvetica, sans-serif; cursor:pointer; color:white;"
      )
      .style("fill", "white")
      .text(function (d) {
        return "(" + counts(d.index) + " proteins)";
      })
      .attr("class", "text2");

    svg.selectAll("g").on("click", function (d, i) {
      var linkBase = "/salivary-protein";

      document.location.href = linkBase;
    });

    function selectChord(d) {
      svg
        .selectAll(".chord path")
        .filter(function (c) {
          if (c.source) {
            return c !== d;
          }
        })
        .transition()
        .duration(500)
        .style("opacity", 0.06);
    }

    function showAll() {
      svg
        .selectAll(".chord path")
        .transition()
        .duration(500)
        .style("opacity", 1);
    }

    function fade(opacity) {
      return function (g, i) {
        svg
          .selectAll(".chord path")
          .filter(function (d) {
            if (d.source) {
              return d.source.index !== i && d.target.index !== i;
            }
          })
          .transition()
          .duration(500)
          .style("opacity", opacity);

        svg
          .selectAll(".text2 path")
          .filter(function (d) {
            return counts(d.index);
          })
          .transition()
          .duration(500)
          .attr("opacity", 1 - opacity)
          .style("fill", "white")
          .attr("style", "font-size: 12; font-family: Helvetica, sans-serif;");

        svg
          .selectAll(".text3")
          .filter(function (d) {
            return counts(d.index);
          })
          .transition()
          .duration(500)
          .style("fill", "white")
          .attr("opacity", 1 - opacity)
          .attr("style", "font-size: 13; font-family: Helvetica, sans-serif");
      };
    }

    function tooltip(d) {
      if (d.source.index === d.target.index)
        return (
          d.target.value +
          " proteins found in " +
          names(d.source.index).toLowerCase() +
          " only"
        );
      else
        return (
          d.target.value +
          " common proteins between " +
          names(d.source.index).toLowerCase() +
          " and " +
          names(d.target.index).toLowerCase()
        );
    }
  };
  return <div ref={chartRef}></div>;
};

export default Chord;
