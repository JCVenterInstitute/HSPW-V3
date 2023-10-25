import "./filter.css";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { rgb } from "d3";
import "./table.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomHeaderGroup from "./customHeaderGroup.jsx";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";

import { ICellRendererParams } from "ag-grid-community";
import { ReactComponent as Download_Logo } from "./table_icon/download.svg";
import { ReactComponent as Left_Arrow } from "./table_icon/left_arrow.svg";
import { ReactComponent as Right_Arrow } from "./table_icon/right_arrow.svg";
import { ReactComponent as Search } from "./table_icon/search.svg";

const styles = {
  transform: "translate(0, 0)",
};

const styles1 = {
  transform: "translate(2, 0)",
};
function WSComponent(props: ICellRendererParams) {
  const d = props.value;
  if (d < 10 || d === "low") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(180,250,180)",
            color: "black",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "22%",
          }}
        >
          {Number(d).toFixed(2)}
        </div>
      </>
    );
  } else if (d < 100 || d === "medium") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(70,170,70)",
            color: "#FFF",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "22%",
          }}
        >
          {Number(d).toFixed(2)}
        </div>
      </>
    );
  } else if (d > 100 || d === "high") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(0,100,0)",
            color: "#FFF",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "22%",
          }}
        >
          {Number(d).toFixed(2)}
        </div>
      </>
    );
  } else if (d === "not detected" || d === 0) {
    return (
      <svg
        width={18}
        height={18}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <rect width={18} height={18} fill="rgb(255,255,255)">
          <title>Not uniquely observed</title>
        </rect>
      </svg>
    );
  } else {
    return (
      <svg
        width={18}
        height={18}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <defs>
          <pattern
            id="stripe2"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
            x="0"
            y="0"
            width="4"
            height="4"
            viewBox="0 0 10 10"
          >
            <rect
              width={2}
              height={4}
              fill={rgb(220, 220, 220)}
              style={styles}
            ></rect>
            <rect
              width={2}
              height={4}
              fill={rgb(255, 255, 255)}
              style={styles1}
            ></rect>
          </pattern>
        </defs>
        <rect width={18} height={18} style={{ fill: "url(#stripe2)" }}>
          <title>Data not available</title>
        </rect>
      </svg>
    );
  }
}

function opinionComponent(props: ICellRendererParams) {
  const d = props.value;
  if (d === "Confirmed") {
    return <span>C</span>;
  } else if (d === "Unsubstantiated") {
    return <span>US</span>;
  }
}

function IHCComponent(props: ICellRendererParams) {
  const d = props.value;
  if (d === "low") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(180,250,180)",
            color: "black",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "22%",
          }}
        >
          <span style={{ textAlign: "center" }}>{d}</span>
        </div>
      </>
    );
  } else if (d === "medium") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(70,170,70)",
            color: "#FFF",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "22%",
          }}
        >
          <span style={{ textAlign: "center" }}>{d}</span>
        </div>
      </>
    );
  } else if (d === "high") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(0,100,0)",
            color: "#FFF",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "22%",
          }}
        >
          <span style={{ textAlign: "center" }}>{d}</span>
        </div>
      </>
    );
  } else if (d === "not detected") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(250,250,250)",
            color: "black",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "25%",
          }}
        >
          N/A
        </div>
      </>
    );
  } else {
    return (
      <svg
        style={{
          stroke: "black",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          <pattern
            id="stripe2"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
            x="0"
            y="0"
            width="4"
            height="4"
            viewBox="0 0 10 10"
          >
            <rect
              width={2}
              height={4}
              fill={rgb(220, 220, 220)}
              style={styles}
            ></rect>
            <rect
              width={2}
              height={4}
              fill={rgb(255, 255, 255)}
              style={styles1}
            ></rect>
          </pattern>
        </defs>
        <rect style={{ fill: "url(#stripe2)", width: "100%", height: "100%" }}>
          <title>Data not available</title>
        </rect>
      </svg>
    );
  }
}

function LinkComponent(props: ICellRendererParams) {
  const d = props.value;

  if (d < 10 || d === "low") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(250,180,180)",
            color: "black",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "22%",
          }}
        >
          {Number(d).toFixed(2)}
        </div>
      </>
    );
  } else if (d < 100 || d === "medium") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(190,70,70)",
            color: "black",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "22%",
          }}
        >
          {Number(d).toFixed(2)}
        </div>
      </>
    );
  } else if (d > 100 || d === "high") {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(100,0,0)",
            color: "black",
            fontFamily: "Lato",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "center",
            paddingTop: "22%",
          }}
        >
          {Number(d).toFixed(2)}
        </div>
      </>
    );
  } else if (d === "not detected" || d === 0) {
    return (
      <svg
        width={18}
        height={18}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <rect width={18} height={18} fill="rgb(255,255,255)">
          <title>Not uniquely observed</title>
        </rect>
      </svg>
    );
  } else {
    return (
      <svg
        width={18}
        height={18}
        style={{ stroke: "black", alignItems: "center" }}
      >
        <defs>
          <pattern
            id="stripe2"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
            x="0"
            y="0"
            width="4"
            height="4"
            viewBox="0 0 10 10"
          >
            <rect
              width={2}
              height={4}
              fill={rgb(220, 220, 220)}
              style={styles}
            ></rect>
            <rect
              width={2}
              height={4}
              fill={rgb(255, 255, 255)}
              style={styles1}
            ></rect>
          </pattern>
        </defs>
        <rect width={18} height={18} style={{ fill: "url(#stripe2)" }}>
          <title>Data not available</title>
        </rect>
      </svg>
    );
  }
}

function App() {
  const [gridApi, setGridApi] = useState();
  const [pageSize, setPageSize] = useState(50);
  const [pageNum, setPageNum] = useState(1);
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(2);
  const [docCount, setDocCount] = useState(0);
  const [pageNumArr, setPageNumArr] = useState([1]);
  const [accessionC, setAccessionC] = useState(false);
  const [geneC, setGeneC] = useState(false);
  const [nameC, setNameC] = useState(false);
  const [eoC, seteoC] = useState(false);
  const [ihcC, setihcC] = useState(false);
  const [wsC, setwsC] = useState(false);
  const [parC, setparC] = useState(false);
  const [subC, setsubC] = useState(false);
  const [plasmaC, setplasmaC] = useState(false);
  const [mRNAC, setmRNAC] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [genePrefix, setGenePrefix] = useState("");
  const [namePrefix, setNamePrefix] = useState("");
  const [opCount, setOpCount] = useState([]);
  const [IHCCount, setIHCCount] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [opinionVal, setopinionVal] = useState("");
  const [IHCVal, setIHCVal] = useState("*");
  const [wsArr, setwsArr] = useState(["0", "20000"]);
  const [parStart, setparStart] = useState("0");
  const [parEnd, setparEnd] = useState("20000");
  const [subStart, setsubStart] = useState("0");
  const [subEnd, setsubEnd] = useState("20000");
  const [pStart, setpStart] = useState("0");
  const [pEnd, setpEnd] = useState("10");
  const [wsStart, setwsStart] = useState("0");
  const [wsEnd, setwsEnd] = useState("20000");
  const [mRNAStart, setmRNAStart] = useState("0");
  const [mRNAEnd, setmRNAEnd] = useState("20000");
  const [parArr, setparArr] = useState([0, 20000]);
  const [ssArr, setssArr] = useState([0, 20000]);
  const [pArr, setpArr] = useState([0, 20000]);
  const [mRNAArr, setmRNAArr] = useState([0, 20000]);
  const [opArr, setOpArr] = useState([false, false]);
  const [orChecked, setorChecked] = useState(false);
  const [exclude, setExclude] = useState(false);
  const [IHCArr, setIHCArr] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    const fetchOpCount = async () => {
      const data = await fetch("http://localhost:8000/opCount");
      const json = data.json();
      return json;
    };
    const countOpResult = fetchOpCount().catch(console.errror);
    countOpResult.then((value) => {
      if (value) {
        setOpCount(value);
      }
    });

    const fetchIHCCount = async () => {
      const data = await fetch("http://localhost:8000/IHCCount");
      const json = data.json();
      return json;
    };
    const countIHCResult = fetchIHCCount().catch(console.errror);
    countIHCResult.then((value) => {
      if (value) {
        setIHCCount(value);
        console.log(IHCCount);
      }
    });

    fetch("http://localhost:8000/saliva_protein_count/")
      .then((res) => res.json())
      .then((data) => {
        setDocCount(data.count);
        const newOptions = [];
        for (let i = 1; i <= Math.round(data.count / pageSize); i++) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }
        setPageNumArr(newOptions);
      });
  }, []);

  useEffect(() => {
    const fetchAndData = async () => {
      console.log("a:" + wsStart + wsEnd);
      const data = await fetch(
        "http://localhost:8000/and_search/" +
          pageSize +
          "/" +
          pageNum +
          "/" +
          prefix +
          "*/" +
          genePrefix +
          "*/" +
          namePrefix +
          "*/" +
          opinionVal +
          "*/" +
          wsStart +
          "/" +
          wsEnd +
          "/" +
          parStart +
          "/" +
          parEnd +
          "/" +
          pStart +
          "/" +
          pEnd +
          "/" +
          subStart +
          "/" +
          subEnd +
          "/" +
          mRNAStart +
          "/" +
          mRNAEnd +
          "," +
          IHCVal
      );
      const json = data.json();
      return json;
    };
    const fetchOrData = async () => {
      console.log("a:" + wsStart + wsEnd);
      const data = await fetch(
        "http://localhost:8000/or_search/" +
          pageSize +
          "/" +
          pageNum +
          "/" +
          prefix +
          "*/" +
          genePrefix +
          "*/" +
          namePrefix +
          "*/" +
          opinionVal +
          "*/" +
          wsStart +
          "/" +
          wsEnd +
          "/" +
          parStart +
          "/" +
          parEnd +
          "/" +
          pStart +
          "/" +
          pEnd +
          "/" +
          subStart +
          "/" +
          subEnd +
          "/" +
          mRNAStart +
          "/" +
          mRNAEnd +
          "," +
          IHCVal
      );
      const json = data.json();
      return json;
    };
    const fetchAndExcludeData = async () => {
      console.log("a:" + wsStart + wsEnd);
      const data = await fetch(
        "http://localhost:8000/and_search_exclude/" +
          pageSize +
          "/" +
          pageNum +
          "/" +
          prefix +
          "*/" +
          genePrefix +
          "*/" +
          namePrefix +
          "*/" +
          opinionVal +
          "*/" +
          wsStart +
          "/" +
          wsEnd +
          "/" +
          parStart +
          "/" +
          parEnd +
          "/" +
          pStart +
          "/" +
          pEnd +
          "/" +
          subStart +
          "/" +
          subEnd +
          "/" +
          mRNAStart +
          "/" +
          mRNAEnd +
          "," +
          IHCVal
      );
      const json = data.json();
      return json;
    };
    const fetchOrExcludeData = async () => {
      console.log("a:" + wsStart + wsEnd);
      const data = await fetch(
        "http://localhost:8000/or_search_exclude/" +
          pageSize +
          "/" +
          pageNum +
          "/" +
          prefix +
          "*/" +
          genePrefix +
          "*/" +
          namePrefix +
          "*/" +
          opinionVal +
          "*/" +
          wsStart +
          "/" +
          wsEnd +
          "/" +
          parStart +
          "/" +
          parEnd +
          "/" +
          pStart +
          "/" +
          pEnd +
          "/" +
          subStart +
          "/" +
          subEnd +
          "/" +
          mRNAStart +
          "/" +
          mRNAEnd +
          "," +
          IHCVal
      );
      const json = data.json();
      return json;
    };
    if (
      (accessionC === true ||
        geneC === true ||
        nameC === true ||
        eoC === true ||
        ihcC === true ||
        wsC === true ||
        parC === true ||
        subC === true ||
        plasmaC === true ||
        mRNAC === true) &&
      orChecked === false &&
      exclude === false
    ) {
      const result = fetchAndData().catch(console.errror);
      result.then((value) => {
        if (value.hits.hits) {
          console.log(value);
          let data1 = [];
          for (let i = 0; i < value.hits.hits.length; i++) {
            data1.push(value.hits.hits[i]["_source"]);
          }
          console.log(data1);
          setRowData(data1);
        }
        setDocCount(value.hits.total.value);
        const newOptions = [];
        for (
          let i = 1;
          i <= Math.round(value.hits.total.value / pageSize);
          i++
        ) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }
        setPageNum(1);
        setPageNumArr(newOptions);
        setCount(2);
        setOpCount(value.aggregations.expert_opinion.buckets);
        setIHCCount(value.aggregations.IHC.buckets);
      });
    } else if (
      (accessionC === true ||
        geneC === true ||
        nameC === true ||
        eoC === true ||
        ihcC === true ||
        wsC === true ||
        parC === true ||
        subC === true ||
        plasmaC === true ||
        mRNAC === true) &&
      orChecked === true &&
      exclude === false
    ) {
      console.log(
        "http://localhost:8000/or_search/" +
          pageSize +
          "/" +
          pageNum +
          "/" +
          prefix +
          "*/" +
          genePrefix +
          "*/" +
          namePrefix +
          "*/" +
          opinionVal +
          "*/" +
          wsStart +
          "/" +
          wsEnd +
          "/" +
          parStart +
          "/" +
          parEnd +
          "/" +
          pStart +
          "/" +
          pEnd +
          "/" +
          subStart +
          "/" +
          subEnd +
          "/" +
          mRNAStart +
          "/" +
          mRNAEnd +
          "," +
          IHCVal
      );
      const result = fetchOrData().catch(console.errror);
      result.then((value) => {
        if (value.hits.hits) {
          console.log(value);
          let data1 = [];
          for (let i = 0; i < value.hits.hits.length; i++) {
            data1.push(value.hits.hits[i]["_source"]);
          }
          console.log(data1);
          setRowData(data1);
        }
        setDocCount(value.hits.total.value);
        const newOptions = [];
        for (
          let i = 1;
          i <= Math.round(value.hits.total.value / pageSize);
          i++
        ) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }
        setPageNum(1);
        setPageNumArr(newOptions);
        setCount(2);
        setOpCount(value.aggregations.expert_opinion.buckets);
        setIHCCount(value.aggregations.IHC.buckets);
      });
    } else if (
      (accessionC === true ||
        geneC === true ||
        nameC === true ||
        eoC === true ||
        ihcC === true ||
        wsC === true ||
        parC === true ||
        subC === true ||
        plasmaC === true ||
        mRNAC === true) &&
      orChecked === false &&
      exclude === true
    ) {
      console.log(
        "http://localhost:8000/and_search_exclude/" +
          pageSize +
          "/" +
          pageNum +
          "/" +
          prefix +
          "*/" +
          genePrefix +
          "*/" +
          namePrefix +
          "*/" +
          opinionVal +
          "*/" +
          wsStart +
          "/" +
          wsEnd +
          "/" +
          parStart +
          "/" +
          parEnd +
          "/" +
          pStart +
          "/" +
          pEnd +
          "/" +
          subStart +
          "/" +
          subEnd +
          "/" +
          mRNAStart +
          "/" +
          mRNAEnd +
          "," +
          IHCVal
      );
      const result = fetchAndExcludeData().catch(console.errror);
      result.then((value) => {
        if (value.hits.hits) {
          console.log(value);
          let data1 = [];
          for (let i = 0; i < value.hits.hits.length; i++) {
            data1.push(value.hits.hits[i]["_source"]);
          }
          console.log(data1);
          setRowData(data1);
        }
        setDocCount(value.hits.total.value);
        const newOptions = [];
        for (
          let i = 1;
          i <= Math.round(value.hits.total.value / pageSize);
          i++
        ) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }
        setPageNum(1);
        setPageNumArr(newOptions);
        setCount(2);
        setOpCount(value.aggregations.expert_opinion.buckets);
        setIHCCount(value.aggregations.IHC.buckets);
      });
    } else if (
      (accessionC === true ||
        geneC === true ||
        nameC === true ||
        eoC === true ||
        ihcC === true ||
        wsC === true ||
        parC === true ||
        subC === true ||
        plasmaC === true ||
        mRNAC === true) &&
      orChecked === true &&
      exclude === true
    ) {
      console.log(
        "http://localhost:8000/or_search_exclude/" +
          pageSize +
          "/" +
          pageNum +
          "/" +
          prefix +
          "*/" +
          genePrefix +
          "*/" +
          namePrefix +
          "*/" +
          opinionVal +
          "*/" +
          wsStart +
          "/" +
          wsEnd +
          "/" +
          parStart +
          "/" +
          parEnd +
          "/" +
          pStart +
          "/" +
          pEnd +
          "/" +
          subStart +
          "/" +
          subEnd +
          "/" +
          mRNAStart +
          "/" +
          mRNAEnd +
          "," +
          IHCVal
      );
      const result = fetchOrExcludeData().catch(console.errror);
      result.then((value) => {
        if (value.hits.hits) {
          console.log(value);
          let data1 = [];
          for (let i = 0; i < value.hits.hits.length; i++) {
            data1.push(value.hits.hits[i]["_source"]);
          }
          console.log(data1);
          setRowData(data1);
        }
        setDocCount(value.hits.total.value);
        const newOptions = [];
        for (
          let i = 1;
          i <= Math.round(value.hits.total.value / pageSize);
          i++
        ) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }
        setPageNum(1);
        setPageNumArr(newOptions);
        setCount(2);
        setOpCount(value.aggregations.expert_opinion.buckets);
        setIHCCount(value.aggregations.IHC.buckets);
      });
    } else {
      const fetchData = async () => {
        const data = await fetch(
          "http://localhost:8000/saliva_protein_table/" +
            pageSize +
            "/" +
            pageNum
        );
        const json = data.json();
        return json;
      };
      const result = fetchData().catch(console.errror);
      result.then((value) => {
        if (value.hits.hits) {
          console.log(value);
          let data1 = [];
          for (let i = 0; i < value.hits.hits.length; i++) {
            data1.push(value.hits.hits[i]["_source"]);
          }

          setRowData(data1);
        }
        setDocCount(value.hits.total.value);
        const newOptions = [];
        for (
          let i = 1;
          i <= Math.round(value.hits.total.value / pageSize);
          i++
        ) {
          newOptions.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }
        setPageNum(1);
        setPageNumArr(newOptions);
        setCount(2);
        setOpCount(value.aggregations.expert_opinion.buckets);
        setIHCCount(value.aggregations.IHC.buckets);
      });

      const fetchOpCount = async () => {
        const data = await fetch("http://localhost:8000/opCount");
        const json = data.json();
        return json;
      };
      const countOpResult = fetchOpCount().catch(console.errror);
      countOpResult.then((value) => {
        if (value) {
          setOpCount(value);
        }
      });

      const fetchIHCCount = async () => {
        const data = await fetch("http://localhost:8000/IHCCount");
        const json = data.json();
        return json;
      };
      const countIHCResult = fetchIHCCount().catch(console.errror);
      countIHCResult.then((value) => {
        if (value) {
          setIHCCount(value);
          console.log(IHCCount);
        }
      });
    }

    const fetchAccessionData = async () => {
      const data = await fetch(
        "http://localhost:8000/filter_search/saliva_protein_test/uniprot_accession/" +
          prefix +
          "/" +
          pageSize +
          "/" +
          pageNum
      );
      const json = data.json();
      return json;
    };

    const fetchGeneData = async () => {
      const data = await fetch(
        "http://localhost:8000/filter_search/saliva_protein_test/Gene Symbol/" +
          genePrefix +
          "/" +
          pageSize +
          "/" +
          pageNum
      );
      const json = data.json();
      return json;
    };

    const fetchOpUSData = async () => {
      const data = await fetch(
        "http://localhost:8000/search_opinion/Unsubstantiated/" +
          pageSize +
          "/" +
          pageNum
      );
      const json = data.json();
      return json;
    };

    const fetchOpCData = async () => {
      const data = await fetch(
        "http://localhost:8000/search_opinion/Confirmed/" +
          pageSize +
          "/" +
          pageNum
      );
      const json = data.json();
      return json;
    };
  }, [
    prefix,
    genePrefix,
    namePrefix,
    opArr,
    IHCArr,
    wsStart,
    wsEnd,
    parStart,
    parEnd,
    subStart,
    subEnd,
    pStart,
    pEnd,
    mRNAStart,
    mRNAEnd,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        "http://localhost:8000/saliva_protein_table/" + pageSize + "/" + pageNum
      );
      const json = data.json();
      return json;
    };
    const result = fetchData().catch(console.errror);
    result.then((value) => {
      if (value.hits.hits) {
        console.log(value);
        let data1 = [];
        for (let i = 0; i < value.hits.hits.length; i++) {
          data1.push(value.hits.hits[i]["_source"]);
        }
        console.log(data1);
        setRowData(data1);
      }
    });
  }, [pageSize, pageNum]);

  const columns = [
    {
      headerName: "Accession",
      field: "UniProt Accession",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      minWidth: "135",
      wordWrap: true,
      autoHeight: true,
      cellStyle: { "word-break": "break-word" },
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Gene Symbol",
      minWidth: "120",
      field: "Gene Symbol",
      wrapText: true,
      autoHeight: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      cellStyle: { "word-break": "break-word" },
    },
    {
      headerName: "Protein Name",
      minWidth: "115",
      maxHeight: "5",
      field: "Protein Name",
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      autoHeight: true,
      cellStyle: { "word-break": "break-word" },
    },
    {
      headerName: "Expert Opinion",
      minWidth: "120",
      field: "expert_opinion",
      autoHeight: true,
      cellRenderer: "opinionComponent",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      wrapText: true,
    },
    {
      headerName: "MS",
      headerGroupComponent: CustomHeaderGroup,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      children: [
        {
          headerName: "WS",
          field: "saliva_abundance",
          minWidth: "95",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          headerName: "Par",
          field: "parotid_gland_abundance",
          minWidth: "95",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          headerName: "Sub",
          field: "sm/sl_abundance",
          minWidth: "95",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          headerName: "B",
          field: "plasma_abundance",
          minWidth: "95",
          cellRenderer: "LinkComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
      ],
      autoHeight: true,
      wrapText: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "IHC",
      field: "IHC",
      minWidth: "95",
      autoHeight: true,
      wrapText: true,
      cellRenderer: "IHCComponent",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "mRNA",
      headerGroupComponent: CustomHeaderGroup,
      minWidth: "105",
      autoHeight: true,
      wrapText: true,
      cellRenderer: "WSComponent",
      headerClass: ["header-border"],
      cellClass: ["table-border"],
      children: [
        {
          headerName: "value",
          field: "mRNA",
          minWidth: "105",
          cellRenderer: "WSComponent",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          field: "specificity",
          minWidth: "140",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
        {
          field: "specificity score",
          minWidth: "140",
          headerClass: ["header-border"],
          cellClass: ["table-border"],
        },
      ],
    },
  ];
  const gridRef = useRef();

  const searchAccession = () => {
    setAccessionC(true);
  };

  const searchGene = () => {
    setGeneC(true);

    console.log(geneC + genePrefix);
  };

  const searchName = () => {
    setNameC(true);
  };

  const paginationNumberFormatter = useCallback((params) => {
    return params.value.toLocaleString();
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    gridRef.current.api.paginationGoToPage(0);
  }, []);

  const onPageSizeChanged = (event) => {
    var value = document.getElementById("page-size").value;
    gridRef.current.api.paginationSetPageSize(Number(value));
    setPageSize(value);
  };

  const onPageNumChanged = (event) => {
    var value = document.getElementById("page-num").value;
    setPageNum(value);
  };

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);
  const onBtNext = (event) => {
    if (count < docCount / pageSize) {
      var x = gridRef.current.api.paginationGetCurrentPage();
      setPageNum(x + count);
      setCount(count + 1);
    }
  };

  const onBtPrevious = (event) => {
    if (pageNum !== 1) {
      var x = pageNum;
      setPageNum(x - 1);
      setCount(count - 1);
    }
  };
  const defColumnDefs = {
    flex: 1,
    filter: true,
    resizable: true,
    wrapHeaderText: true,
    wrapText: true,
    autoHeaderHeight: true,
    autoHeight: true,
    headerStyle: { "word-break": "break-word" },
    initialWidth: 200,
    headerComponentParams: {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
        '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
        '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
        '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
        '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
        '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
        '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
        '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
        "  </div>" +
        "</div>",
    },
  };

  const onGridReady = (params) => {
    setGridApi(params);
  };

  const handleAccessionChange = (e) => {
    if (e.target.value === "") {
      setAccessionC(false);
    } else {
      setAccessionC(true);
    }
    setPrefix(e.target.value);
  };

  const handleGeneChange = (e) => {
    if (e.target.value === "") {
      console.log("wt");
      setGeneC(false);
    } else if (e.target.value !== "") {
      setGeneC(true);
    }
    setGenePrefix(e.target.value);
  };

  const handleNameChange = (e) => {
    if (e.target.value === "") {
      console.log("wt");
      setNameC(false);
    } else if (e.target.value !== "") {
      setNameC(true);
    }
    setNamePrefix(e.target.value);
  };

  const handlestartWSChange = (e) => {
    if (e.target.value === "") {
      setwsC(false);
    } else if (e.target.value !== "") {
      setwsC(true);
    }
    setwsStart(e.target.value);
  };
  const handleendWSChange = (e) => {
    if (e.target.value === "") {
      setwsC(false);
    } else if (e.target.value !== "") {
      setwsC(true);
    }
    setwsEnd(e.target.value);
  };

  const handlestartParChange = (e) => {
    if (e.target.value === "") {
      setparC(false);
    } else if (e.target.value !== "") {
      setparC(true);
    }
    setparStart(e.target.value);
  };
  const handleendParChange = (e) => {
    if (e.target.value === "") {
      setparC(false);
    } else if (e.target.value !== "") {
      setparC(true);
    }
    setparEnd(e.target.value);
  };
  const handlestartSubChange = (e) => {
    if (e.target.value === "") {
      setsubC(false);
    } else if (e.target.value !== "") {
      setsubC(true);
    }
    setsubStart(e.target.value);
  };
  const handleendSubChange = (e) => {
    if (e.target.value === "") {
      setsubC(false);
    } else if (e.target.value !== "") {
      setsubC(true);
    }
    setsubEnd(e.target.value);
  };
  const handlestartBChange = (e) => {
    if (e.target.value === "") {
      setplasmaC(false);
    } else if (e.target.value !== "") {
      setplasmaC(true);
    }
    setpStart(e.target.value);
  };
  const handleendBChange = (e) => {
    if (e.target.value === "") {
      setplasmaC(false);
    } else if (e.target.value !== "") {
      setplasmaC(true);
    }
    setpEnd(e.target.value);
  };
  const handlestartmRNAChange = (e) => {
    if (e.target.value === "") {
      setmRNAC(false);
    } else if (e.target.value !== "") {
      setmRNAC(true);
    }
    setmRNAStart(e.target.value);
  };
  const handleendmRNAChange = (e) => {
    if (e.target.value === "") {
      setmRNAC(false);
    } else if (e.target.value !== "") {
      setmRNAC(true);
    }
    setmRNAEnd(e.target.value);
  };

  const filterOpUS = (event) => {
    setOpArr((prevOpArr) => {
      const updatedOpArr = [!prevOpArr[0], prevOpArr[1]];

      if (updatedOpArr[0] === true) {
        seteoC(true);
        setopinionVal("Unsubstantiated");
        console.log("diu:" + eoC + opinionVal);
      } else if (updatedOpArr[0] === false && updatedOpArr[1] === false) {
        seteoC(false);
        setopinionVal("");
      } else if (updatedOpArr[0] === false) {
        setopinionVal("");
      }

      return updatedOpArr;
    });
  };

  const filterOpC = (event) => {
    setOpArr((prevOpArr) => {
      const updatedOpArr = [prevOpArr[0], !prevOpArr[1]];

      if (updatedOpArr[1] === true) {
        seteoC(true);
        setopinionVal("Confirmed");
        console.log("diu:" + eoC + opinionVal);
      } else if (updatedOpArr[0] === false && updatedOpArr[1] === false) {
        seteoC(false);
        setopinionVal("");
      } else if (updatedOpArr[1] === false) {
        setopinionVal("");
      }

      return updatedOpArr;
    });
  };

  const filterIHC = (event) => {
    console.log(typeof event.target.value);
    if (event.target.value === "medium") {
      setIHCArr((prevIHCArr) => {
        const updatedIHCArr = [
          !prevIHCArr[0],
          prevIHCArr[1],
          prevIHCArr[2],
          prevIHCArr[3],
          prevIHCArr[4],
          prevIHCArr[5],
        ];
        if (updatedIHCArr[0] === true) {
          setihcC(true);
          setIHCVal("medium*");
        } else if (
          updatedIHCArr[0] === false &&
          updatedIHCArr[1] === false &&
          updatedIHCArr[2] === false &&
          updatedIHCArr[3] === false &&
          updatedIHCArr[4] === false &&
          updatedIHCArr[5] === false
        ) {
          setihcC(false);
          setIHCVal("*");
        }
        return updatedIHCArr;
      });
      console.log("diu:" + IHCArr);
    } else if (event.target.value === "not detected") {
      setIHCArr((prevIHCArr) => {
        const updatedIHCArr = [
          prevIHCArr[0],
          !prevIHCArr[1],
          prevIHCArr[2],
          prevIHCArr[3],
          prevIHCArr[4],
        ];
        if (updatedIHCArr[1] === true) {
          setihcC(true);
          setIHCVal("not_detected*");
        } else if (
          updatedIHCArr[0] === false &&
          updatedIHCArr[1] === false &&
          updatedIHCArr[2] === false &&
          updatedIHCArr[3] === false &&
          updatedIHCArr[4] === false
        ) {
          setihcC(false);
          setIHCVal("*");
        }
        return updatedIHCArr;
      });
    } else if (event.target.value === "low") {
      setIHCArr((prevIHCArr) => {
        const updatedIHCArr = [
          prevIHCArr[0],
          prevIHCArr[1],
          !prevIHCArr[2],
          prevIHCArr[3],
          prevIHCArr[4],
        ];
        if (updatedIHCArr[2] === true) {
          setihcC(true);
          setIHCVal("low*");
        } else if (
          updatedIHCArr[0] === false &&
          updatedIHCArr[1] === false &&
          updatedIHCArr[2] === false &&
          updatedIHCArr[3] === false &&
          updatedIHCArr[4] === false
        ) {
          setihcC(false);
          setIHCVal("*");
        }
        return updatedIHCArr;
      });
    } else if (event.target.value === "n/a") {
      setIHCArr((prevIHCArr) => {
        const updatedIHCArr = [
          prevIHCArr[0],
          prevIHCArr[1],
          prevIHCArr[2],
          !prevIHCArr[3],
          prevIHCArr[4],
        ];
        if (updatedIHCArr[3] === true) {
          setihcC(true);
          setIHCVal("n_a*");
        } else if (
          updatedIHCArr[0] === false &&
          updatedIHCArr[1] === false &&
          updatedIHCArr[2] === false &&
          updatedIHCArr[3] === false &&
          updatedIHCArr[4] === false
        ) {
          setihcC(false);
          setIHCVal("*");
        }
        return updatedIHCArr;
      });
    } else if (event.target.value === "high") {
      setIHCArr((prevIHCArr) => {
        const updatedIHCArr = [
          prevIHCArr[0],
          prevIHCArr[1],
          prevIHCArr[2],
          prevIHCArr[3],
          !prevIHCArr[4],
        ];
        if (updatedIHCArr[4] === true) {
          setihcC(true);
          setIHCVal("high*");
        } else if (
          updatedIHCArr[0] === false &&
          updatedIHCArr[1] === false &&
          updatedIHCArr[2] === false &&
          updatedIHCArr[3] === false &&
          updatedIHCArr[4] === false
        ) {
          setihcC(false);
          setIHCVal("*");
        }
        return updatedIHCArr;
      });
    }
  };

  const rowHeight = 20;
  return (
    <>
      <div className="rowC">
        <div className="sidebar1">
          <h2
            style={{
              margin: "26px",
              color: "#1463B9",
              fontFamily: "Montserrat",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "130%",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            FILTER
          </h2>
          <FormGroup style={{ marginLeft: "18%" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography color="common.black">And</Typography>
              <Switch
                checked={orChecked}
                inputProps={{ "aria-label": "ant design" }}
                onChange={(event) => setorChecked(event.target.checked)}
              />
              <Typography color="common.black">Or</Typography>
            </Stack>
          </FormGroup>
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">Accession</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-accession-box"
                  placeholder="Search..."
                  onChange={handleAccessionChange}
                  style={{
                    width: "80%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={prefix}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">Gene Symbol</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-gene-box"
                  placeholder="Search..."
                  onChange={handleGeneChange}
                  style={{
                    width: "80%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={genePrefix}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">Protein Name</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-protein-name-box"
                  placeholder="Search..."
                  onChange={handleNameChange}
                  style={{
                    width: "80%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={namePrefix}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">Expert Opinion</Typography>
              </AccordionSummary>
              <List
                component="div"
                disablePadding
                sx={{ border: "1px groove" }}
              >
                {opCount.map((child, key) =>
                  child.key !== "" &&
                  child.key !== "D.D.S." &&
                  child.key != "Unknown" ? (
                    <FormGroup sx={{ ml: "10px" }}>
                      {child.key === "Unsubstantiated" ? (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={opArr[0]}
                              onChange={filterOpUS}
                            />
                          }
                          label={"US (" + child.doc_count + ")"}
                        />
                      ) : (
                        <FormControlLabel
                          control={
                            <Checkbox checked={opArr[1]} onChange={filterOpC} />
                          }
                          label={"C (" + (child.doc_count - 1) + ")"}
                        />
                      )}
                    </FormGroup>
                  ) : null
                )}
              </List>
              <AccordionDetails></AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">IHC</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <List
                  component="div"
                  disablePadding
                  sx={{ border: "1px groove" }}
                >
                  {IHCCount.map((child, i) =>
                    child.key !== "?" ? (
                      <FormGroup sx={{ ml: "10px" }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={IHCArr[i]}
                              onChange={filterIHC}
                              value={child.key}
                            />
                          }
                          label={child.key + " (" + (child.doc_count - 1) + ")"}
                        />
                      </FormGroup>
                    ) : null
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">MS WS</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-startws-box"
                  placeholder="Start"
                  onChange={handlestartWSChange}
                  style={{
                    width: "40%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={wsStart}
                />
                <Typography variant="p"> to</Typography>
                <input
                  type="text"
                  id="filter-endws-box"
                  placeholder="End"
                  onChange={handleendWSChange}
                  style={{
                    width: "40%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={wsEnd}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">MS Par</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-gene-box"
                  placeholder="Start"
                  onChange={handlestartParChange}
                  style={{
                    width: "40%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={parStart}
                />
                <Typography variant="p"> to</Typography>
                <input
                  type="text"
                  id="filter-gene-box"
                  placeholder="End"
                  onChange={handleendParChange}
                  style={{
                    width: "40%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={parEnd}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">MS Sub</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-gene-box"
                  placeholder="Start"
                  onChange={handlestartSubChange}
                  style={{
                    width: "40%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={subStart}
                />
                <Typography variant="p"> to</Typography>
                <input
                  type="text"
                  id="filter-gene-box"
                  placeholder="End"
                  onChange={handleendSubChange}
                  style={{
                    width: "40%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={subEnd}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">MS Blood</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup style={{ marginLeft: "18%" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography color="common.black">Not</Typography>
                    <Switch
                      checked={exclude}
                      inputProps={{ "aria-label": "ant design" }}
                      onChange={(event) => setExclude(event.target.checked)}
                    />
                    <Typography color="common.black">Exclude</Typography>
                  </Stack>
                </FormGroup>
                <input
                  type="text"
                  id="filter-gene-box"
                  placeholder="Start"
                  onChange={handlestartBChange}
                  style={{
                    width: "40%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={pStart}
                />
                <Typography variant="p"> to</Typography>
                <input
                  type="text"
                  id="filter-gene-box"
                  placeholder="End"
                  onChange={handleendBChange}
                  style={{
                    width: "40%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={pEnd}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ flexDirection: "row-reverse" }}
              >
                <Typography variant="h6">mRNA Val</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <input
                  type="text"
                  id="filter-gene-box"
                  placeholder="Start"
                  onChange={handlestartmRNAChange}
                  style={{
                    width: "40%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={mRNAStart}
                />
                <Typography variant="p"> to</Typography>
                <input
                  type="text"
                  id="filter-gene-box"
                  placeholder="End"
                  onChange={handleendmRNAChange}
                  style={{
                    width: "40%",
                    marginLeft: "10px",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "10px",
                    borderColor: "#1463B9",
                    display: "inline",
                    position: "relative",
                  }}
                  value={mRNAEnd}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="AppBox1">
        <div className="example-header" style={{ marginLeft: "35px" }}>
          <form
            onSubmit={onFilterTextBoxChanged}
            style={{ display: "inline", position: "relative" }}
          >
            <input
              type="text"
              id="filter-text-box"
              placeholder="Search..."
              onInput={onFilterTextBoxChanged}
              style={{
                width: "30%",
                padding: "0.25rem 0.75rem",
                borderRadius: "10px 0 0 10px",
                borderColor: "#1463B9",
                display: "inline",
                position: "relative",
              }}
            />
            <button
              type="submit"
              style={{
                display: "inline",
                position: "relative",
                top: "0.3em",
                backgroundColor: "#1463B9",
                borderColor: "#1463B9",
                cursor: "pointer",
                width: "5%",
                borderRadius: "0 10px 10px 0",
              }}
            >
              <Search />
            </button>
          </form>
          <text style={{ marginLeft: "5%" }}>Records Per Page</text>
          <select onChange={onPageSizeChanged} value={pageSize} id="page-size">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
          </select>
          <text style={{ marginLeft: "5%" }}>Page</text>
          <select onChange={onPageNumChanged} value={pageNum} id="page-num">
            {pageNumArr}
          </select>
          <text style={{ marginLeft: "1%" }}>
            out of {Math.round(docCount / pageSize)}
          </text>
          <button
            onClick={onBtPrevious}
            style={{
              marginLeft: "5%",
              fontWeight: "bold",
              marginLeft: "3%",
              marginTop: "10px",
              color: "#F6921E",
              background: "white",
              fontSize: "20",
              padding: ".3em 2em",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Left_Arrow
              style={{
                marginRight: "10px",
                paddingTop: "5px",
                display: "inline",
                position: "relative",
                top: "0.15em",
              }}
            />
            prev
          </button>
          <button
            onClick={onBtNext}
            style={{
              fontWeight: "bold",
              marginTop: "10px",
              marginLeft: "1%",
              color: "#F6921E",
              background: "white",
              fontSize: "20",
              padding: "2em .3em ",
              border: "none",
              cursor: "pointer",
            }}
          >
            next
            <Right_Arrow
              style={{
                marginLeft: "10px",
                paddingTop: "5px",
                display: "inline",
                position: "relative",
                top: "0.15em",
              }}
            />
          </button>
        </div>
        <div
          className="ag-theme-material ag-cell-wrap-text ag-theme-alpine"
          style={{ height: 600 }}
        >
          <AgGridReact
            className="ag-cell-wrap-text"
            rowData={rowData}
            columnDefs={columns}
            ref={gridRef}
            defaultColDef={defColumnDefs}
            frameworkComponents={{
              LinkComponent,
              WSComponent,
              IHCComponent,
              opinionComponent,
            }}
            overlayNoRowsTemplate={
              '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">Loading</span>'
            }
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={50}
            rowHeight={rowHeight}
            suppressPaginationPanel={true}
          />
        </div>
        <button
          onClick={onBtExport}
          style={{
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "10px",
            color: "#F6921E",
            background: "white",
            fontSize: "20",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Download_Logo
            style={{
              marginRight: "10px",
              paddingTop: "5px",
              display: "inline",
              position: "relative",
              top: "0.15em",
            }}
          />
          Download Spreadsheet
        </button>
      </div>
    </>
  );
}

export default App;
