import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
import "./index.css";
// create the svg are

const Chord = (props) => {
  const chartRef = useRef(null);
  const [countSaliva, setCountSaliva] = useState("");
  const [countPlasma, setCountPlasma] = useState("");
  const [countSMSL, setCountSMSL] = useState("");
  const [countParotid, setCountParotid] = useState("");
  const [countSalivaParotid, setSalivaParotid] = useState("");
  const [countSalivaPlasma, setSalivaPlasma] = useState("");
  const [countSalivaSS, setSalivaSS] = useState("");
  const [countSSPlasma, setSSPlasma] = useState("");
  const [countSSParotid, setSSParotid] = useState("");
  const [countPlasmaParotid, setPlasmaParotid] = useState("");
  const [isLoading, setLoading] = useState(true);

  const fetchSaliva = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/countProteinS`
    );
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      console.error(message);
      throw new Error(message);
    }
    const data = await response.json();
    setCountSaliva(data.filter_ws.doc_count);
  };

  const fetchSMSL = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/countProteinSS`
    );
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      console.error(message);
      throw new Error(message);
    }
    const data = await response.json();
    setCountSMSL(data.filter_ss.doc_count);
  };

  const fetchParotid = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/countProteinPa`
    );
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      console.error(message);
      throw new Error(message);
    }
    const data = await response.json();
    setCountParotid(data.filter_par.doc_count);
  };

  const fetchPlasma = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/countProteinPl`
    );
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      console.error(message);
      throw new Error(message);
    }
    const data = await response.json();
    setCountPlasma(data.filter_p.doc_count);
  };

  const fetchSalivaParotid = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/countSPa`
    );
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      console.error(message);
      throw new Error(message);
    }
    const data = await response.json();
    setSalivaParotid(data.filter_ws_par.doc_count);
  };

  const fetchSalivaPlasma = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/countSPl`
    );
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      console.error(message);
      throw new Error(message);
    }
    const data = await response.json();

    setSalivaPlasma(data.filter_ws_p.doc_count);
  };

  const fetchSalivaSMSL = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/countSSS`
    );
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      console.error(message);
      throw new Error(message);
    }
    const data = await response.json();

    setSalivaSS(data.filter_ss_ws.doc_count);
  };

  const fetchSMSLPlasma = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/countSSP`
    );
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      console.error(message);
      throw new Error(message);
    }
    const data = await response.json();

    setSSPlasma(data.filter_ss_p.doc_count);
  };

  const fetchSMSLParotid = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/countSSPa`
    );
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      console.error(message);
      throw new Error(message);
    }
    const data = await response.json();

    setSSParotid(data.filter_ss_par.doc_count);
  };

  const fetchParotidPlasma = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/api/countPPa`
    );
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      console.error(message);
      throw new Error(message);
    }
    const data = await response.json();

    setPlasmaParotid(data.filter_p_par.doc_count);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchSaliva(),
        fetchSMSL(),
        fetchParotid(),
        fetchPlasma(),
        fetchSalivaParotid(),
        fetchSalivaPlasma(),
        fetchSalivaSMSL(),
        fetchSMSLPlasma(),
        fetchSMSLParotid(),
        fetchParotidPlasma(),
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      renderChart(
        countSaliva,
        countPlasma,
        countSMSL,
        countParotid,
        countSalivaParotid,
        countSalivaPlasma,
        countSalivaSS,
        countSSPlasma,
        countSSParotid,
        countPlasmaParotid
      );
    }
  }, [
    isLoading,
    countSaliva,
    countPlasma,
    countSMSL,
    countParotid,
    countSalivaParotid,
    countSalivaPlasma,
    countSalivaSS,
    countSSPlasma,
    countSSParotid,
    countPlasmaParotid,
  ]);

  const renderChart = (
    countSaliva,
    countPlasma,
    countSMSL,
    countParotid,
    countSalivaParotid,
    countSalivaPlasma,
    countSalivaSS,
    countSSPlasma,
    countSSParotid,
    countPlasmaParotid
  ) => {
    const windowWidth = 600;
    const windowHeight = 400;
    const innerRadius = Math.min(windowWidth, windowHeight) / 2.5;
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
      [0, countSSParotid, countSalivaSS, countSSPlasma],
      [countSSParotid, 0, countSalivaParotid, countPlasmaParotid],
      [countSalivaSS, countSalivaParotid, 1750, countSalivaPlasma],
      [countSSPlasma, countPlasmaParotid, countSalivaPlasma, 1431],
    ];

    var sizes = [countSMSL, countParotid, countSaliva, countPlasma];

    var fill = d3
      .scaleOrdinal()
      .range([
        "#D2D0C6",
        "#ECD08D",
        "steelblue",
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
      .data(chord)
      .enter()
      .append("path")
      .style("fill", function (d) {
        return fill(d.index);
      })
      .attr("class", "group")
      .attr("d", d3.arc().innerRadius(innerRadius).outerRadius(outerRadius))
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
      //.style("fill", function(d) { return fill(d.source.index); })
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
        "font-size: 12; font -family: Helvetica, sans-serif; cursor:pointer;color:white;"
      )
      .style("fill", "white")
      .text(function (d) {
        return "(" + counts(d.index) + " proteins)";
      })
      .attr("class", "text2");

    svg.selectAll("g").on("click", function (d, i) {
      var linkBase =
        "https://salivaryproteome.org/public/index.php/Category:Salivary_Proteins";

      document.location.href = linkBase;
    });

    function selectChord(d) {
      svg
        .selectAll(".chord path")
        .filter(function (c) {
          return c !== d;
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
            return d.source.index !== i && d.target.index !== i;
          })
          .transition()
          .duration(500)
          .style("opacity", opacity);

        svg
          .selectAll(".text2")
          .filter(function (d) {
            return counts(d.index);
          })
          .transition()
          .duration(500)
          .attr("opacity", 1 - opacity)
          .style("fill", "white")
          .attr("style", "font-size: 12; font-family: Helvetica, sans-serif");

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
