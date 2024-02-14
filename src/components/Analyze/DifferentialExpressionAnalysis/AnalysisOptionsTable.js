import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const AnalysisOptionsTable = ({ searchParams }) => {
  const headers = [
    "Log Transformation",
    "Number of Differentially Abundant Proteins in Heatmap",
    "Fold Change Threshold",
    "P-Value Threshold",
    "P-Value Type",
    "Statistical Parametric Test",
  ];
  const data = [
    searchParams.get("logNorm"),
    searchParams.get("heatmap"),
    searchParams.get("foldChange"),
    searchParams.get("pValue"),
    searchParams.get("pType"),
    searchParams.get("parametricTest"),
  ];
  return (
    <Table sx={{ marginTop: "15px", marginBottom: "20px" }}>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <TableCell
              key={index}
              sx={{
                backgroundColor: "#1463B9",
                color: "white",
                fontFamily: "Montserrat",
                fontSize: "14px",
                fontWeight: "bold",
                borderRight: "1px solid #3592E4",
                "&:first-of-type": {
                  borderTopLeftRadius: "16px",
                  borderLeft: "none",
                  borderTop: "none",
                },
                "&:last-of-type": {
                  borderTopRightRadius: "16px",
                  borderRight: "none",
                  borderTop: "none",
                },
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {data.map((row, index) => (
            <TableCell
              key={index}
              sx={{ fontSize: "15px", border: "1px solid #CACACA" }}
            >
              {row}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default AnalysisOptionsTable;
