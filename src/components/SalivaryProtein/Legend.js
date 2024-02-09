import { rgb } from "d3";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Grid } from "@mui/material";

import "../../pages/style.css";

const styles = {
  transform: "translate(0, 0)",
};

const styles1 = {
  transform: "translate(2, 0)",
};

const Legend = () => {
  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        item
        xs={6}
      >
        <div
          style={{
            borderRadius: "10px 10px 0 0",
            backgroundColor: "#E7E7E7",
            border: "hidden",
            borderColor: "#C2C2C2",
            padding: "10px",
          }}
        >
          <div style={{ color: "#616161", textAlign: "center" }}>
            Differential Expression
          </div>
        </div>
        <TableContainer
          component={Paper}
          style={{ padding: "10px" }}
        >
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>Label</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  Specificity
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>Salivary gland specific</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ borderBottom: "none" }}>2</TableCell>
                <TableCell style={{ borderBottom: "none" }}>
                  Specific to salivary glands and a few other tissues
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid
        item
        xs={6}
      >
        <div
          style={{
            borderRadius: "10px 10px 0 0",
            backgroundColor: "#E7E7E7",
            border: "hidden",
            borderColor: "#C2C2C2",
            padding: "10px",
          }}
        >
          <div style={{ color: "#616161", textAlign: "center" }}>
            Expert Opinion
          </div>
        </div>
        <TableContainer
          component={Paper}
          style={{ padding: "10px" }}
        >
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    wordBreak: "break-word",
                  }}
                >
                  Acronym
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Definition</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingRight: "5px", marginLeft: "35px" }}>
                  US
                </TableCell>
                <TableCell style={{ paddingRight: "5px", marginLeft: "35px" }}>
                  Unsubstantiated
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    paddingRight: "5px",
                    marginLeft: "35px",
                    borderBottom: "none",
                  }}
                >
                  C
                </TableCell>
                <TableCell
                  style={{
                    paddingRight: "5px",
                    marginLeft: "35px",
                    borderBottom: "none",
                  }}
                >
                  Confirmed
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid
        item
        xs={6}
      >
        <div
          style={{
            borderRadius: "10px 10px 0 0",
            backgroundColor: "#E7E7E7",
            border: "hidden",
            borderColor: "#C2C2C2",
            padding: "10px",
          }}
        >
          <div style={{ color: "#616161", textAlign: "center" }}>
            Abundance Indicator
          </div>
        </div>
        <TableContainer
          component={Paper}
          style={{ padding: "10px" }}
        >
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    wordBreak: "break-word",
                  }}
                >
                  Saliva-based
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  Blood-based
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  Estimated Abundance
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Units</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingRight: "5px", marginLeft: "35px" }}>
                  <svg
                    width={18}
                    height={18}
                    className="table-cell"
                  >
                    <rect
                      width={18}
                      height={18}
                      fill="rgb(0,100,0)"
                    >
                      <title>High</title>
                    </rect>
                  </svg>
                  <span
                    className="svg-text"
                    style={{
                      color: "rgb(0,100,0)",
                    }}
                  >
                    &gt; 100
                  </span>
                </TableCell>
                <TableCell style={{ paddingRight: "5px", marginLeft: "35px" }}>
                  <svg
                    width={18}
                    height={18}
                    className="table-cell"
                  >
                    <rect
                      width={18}
                      height={18}
                      fill="rgb(100,0,0)"
                    >
                      <title>High</title>
                    </rect>
                  </svg>
                  <span
                    className="svg-text"
                    style={{
                      color: "rgb(100,0,0)",
                    }}
                  >
                    &gt; 2.1
                  </span>
                </TableCell>
                <TableCell>High</TableCell>
                <TableCell>obs</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingRight: "5px", marginLeft: "35px" }}>
                  <svg
                    width={18}
                    height={18}
                    className="table-cell"
                  >
                    <rect
                      width={18}
                      height={18}
                      fill="rgb(70,170,70)"
                    >
                      <title>Medium</title>
                    </rect>
                  </svg>
                  <span
                    className="svg-text"
                    style={{
                      color: "rgb(70,170,70)",
                    }}
                  >
                    11 - 100
                  </span>
                </TableCell>
                <TableCell style={{ paddingRight: "5px", marginLeft: "35px" }}>
                  <svg
                    width={18}
                    height={18}
                    className="table-cell"
                  >
                    <rect
                      width={18}
                      height={18}
                      fill="rgb(190,70,70)"
                    >
                      <title>Medium</title>
                    </rect>
                  </svg>
                  <span
                    className="svg-text"
                    style={{
                      color: "rgb(190,70,70)",
                    }}
                  >
                    0.8 - 2
                  </span>
                </TableCell>
                <TableCell>Medium</TableCell>
                <TableCell>obs</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingRight: "5px", marginLeft: "35px" }}>
                  <svg
                    width={18}
                    height={18}
                    className="table-cell"
                  >
                    <rect
                      width={18}
                      height={18}
                      fill="rgb(180,250,180)"
                    >
                      <title>Low</title>
                    </rect>
                  </svg>
                  <span
                    className="svg-text"
                    style={{
                      color: "rgb(180,250,180)",
                    }}
                  >
                    &lt; 10
                  </span>
                </TableCell>
                <TableCell style={{ paddingRight: "5px", marginLeft: "35px" }}>
                  <svg
                    width={18}
                    height={18}
                    className="table-cell"
                  >
                    <rect
                      width={18}
                      height={18}
                      fill="rgb(250,180,180)"
                    >
                      <title>Low</title>
                    </rect>
                  </svg>
                  <span
                    className="svg-text"
                    style={{
                      color: "rgb(250,180,180)",
                    }}
                  >
                    &lt; 0.79
                  </span>
                </TableCell>
                <TableCell>Low</TableCell>
                <TableCell>obs</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <svg
                    width={18}
                    height={18}
                    style={{ stroke: "black", alignItems: "center" }}
                  >
                    <rect
                      width={18}
                      height={18}
                      fill="rgb(255,255,255)"
                    >
                      <title>Not Detected</title>
                    </rect>
                  </svg>
                </TableCell>
                <TableCell sx={{ marginLeft: "20px" }}>
                  <svg
                    width={18}
                    height={18}
                    style={{ stroke: "black", alignItems: "center" }}
                  >
                    <rect
                      width={18}
                      height={18}
                      fill="rgb(255,255,255)"
                    >
                      <title>Not Detected</title>
                    </rect>
                  </svg>
                </TableCell>
                <TableCell>ND (Not Detected)</TableCell>
                <TableCell>na</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ borderBottom: "none" }}>
                  <svg
                    width={18}
                    height={18}
                    style={{ stroke: "black", alignItems: "center" }}
                  >
                    <rect
                      width={18}
                      height={18}
                      fill="rgb(255,255,255)"
                    >
                      <title>Not Available</title>
                    </rect>
                  </svg>
                </TableCell>
                <TableCell sx={{ marginLeft: "20px", borderBottom: "none" }}>
                  <svg
                    width={18}
                    height={18}
                    style={{ stroke: "black", alignItems: "center" }}
                  >
                    <rect
                      width={18}
                      height={18}
                      style={{ fill: "url(#stripe2)" }}
                    >
                      <title>Not Available</title>
                    </rect>
                  </svg>
                </TableCell>
                <TableCell style={{ borderBottom: "none" }}>
                  NA (Not Available)
                </TableCell>
                <TableCell style={{ borderBottom: "none" }}>na</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid
        item
        xs={6}
      >
        <div
          style={{
            borderRadius: "10px 10px 0 0",
            backgroundColor: "#E7E7E7",
            border: "hidden",
            borderColor: "#C2C2C2",
            padding: "10px",
          }}
        >
          <div style={{ color: "#616161", textAlign: "center" }}>
            Specificity Score
          </div>
        </div>
        <TableContainer
          component={Paper}
          style={{ padding: "10px" }}
        >
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Label
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  Specificity Score
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingRight: "5px", marginLeft: "35px" }}>
                  Higher
                </TableCell>
                <TableCell style={{ paddingRight: "5px", marginLeft: "35px" }}>
                  On average higher in salivary glands than in other tissues
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    paddingRight: "5px",
                    marginLeft: "35px",
                    borderBottom: "none",
                  }}
                >
                  Lower
                </TableCell>
                <TableCell
                  style={{
                    paddingRight: "5px",
                    marginLeft: "35px",
                    borderBottom: "none",
                  }}
                >
                  On average lower in salivary glands than in other tissues
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
export default Legend;
