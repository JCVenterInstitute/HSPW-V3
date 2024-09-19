import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const Submissions = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);

  const ddbClient = new DynamoDBClient({ region: "us-east-2" });
  const docClient = DynamoDBDocumentClient.from(ddbClient);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          TableName: "hsp-analysis-submissions-DEV",
          IndexName: "username-index", // Use the GSI (if defined)
          KeyConditionExpression: "#username = :username",
          ExpressionAttributeNames: {
            "#username": "username",
          },
          ExpressionAttributeValues: {
            ":username": "testUser", // Replace with your actual username or variable
          },
        };

        const command = new QueryCommand(params);
        const data = await docClient.send(command);
        console.log(data);
        setRowData(data.Items); // Set row data to display in AG Grid
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columnDefs = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "status", headerName: "Status" },
    { field: "submission_date", headerName: "Submission Date" },
    { field: "type", headerName: "Type" },
    {
      field: "link",
      headerName: "Link",
      cellRenderer: (params) =>
        `<a href="${params.value}" target="_blank">View</a>`,
    },
    { field: "description", headerName: "Description" },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
      )}
    </div>
  );
};

export default Submissions;
