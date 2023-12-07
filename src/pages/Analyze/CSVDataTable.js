import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const CSVDataTable = ({ data }) => {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <>
      {data.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40vh",
          }}
        >
          <p>No data available.</p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "17px",
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
            {data.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header, columnIndex) => (
                  <TableCell
                    key={columnIndex}
                    sx={{ fontSize: "15px", border: "1px solid #CACACA" }}
                  >
                    {row[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default CSVDataTable;
