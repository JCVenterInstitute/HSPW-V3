import axios from "axios";

export const awsJsonUpload = async (s3Key, data) => {
  console.log(s3Key);
  console.log(data);
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/api/s3JSONUpload`,
      {
        s3Key: s3Key,
        jsonData: data,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Combined JSON file uploaded via backend.");
    console.log("Backend upload response:", res.data);
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
  }
};
