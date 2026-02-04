import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import { Button, TextField, Stack } from "@mui/material";
import axios from "axios";

interface FileUploadProps {
  currentPrefix: string; // Current folder path where file should be uploaded
  onUploadSuccess: () => void; // Callback to refresh parent S3Explorer after upload
  user: string; // Username of the current user
}

// Functional component to handle file upload into S3
const FileUpload: React.FC<FileUploadProps> = ({
  currentPrefix,
  onUploadSuccess,
  user,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Currently selected file
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref needed to reset the file input after upload

  // Handler for when a file is selected from the input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files ? e.target.files[0] : null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) return;

    // Prevents uploading of dotfiles (.permissions, .shortcuts, etc.)
    if (selectedFile.name.startsWith(".")) {
      Swal.fire("Error", "Uploading dotfiles is not allowed.", "error");
      return;
    }

    // Prepare form data for API call
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("prefix", currentPrefix); // Current S3 folder path
    formData.append("user", user); // User name of current user

    // Show SweetAlert with custom progress bar
    // TODO: either update progress bar to accurately show progress or replace with loading animation
    Swal.fire({
      title: "Uploading...",
      html: `<div style="width:100%;background:#eee;border-radius:5px;">
             <div id="progress-bar" style="width:0%;background:#3085d6;height:20px;border-radius:5px;"></div>
           </div>
           <div id="progress-text" style="margin-top:10px;">0%</div>`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Keeps modal active while uploading
      },
    });

    try {
      // POST request to backend for uploading a file to S3
      await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/upload-s3-object`,
        formData,
        {
          // Track progress during upload
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
            );

            // Update progress bar in SweetAlert popup
            const progressBar = document.getElementById("progress-bar");
            const progressText = document.getElementById("progress-text");
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressText) progressText.innerText = `${percent}%`;
          },
        }
      );

      Swal.fire("Success", "File uploaded successfully!", "success");

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Trigger parent callback to refresh file list
      onUploadSuccess();
    } catch (error: any) {
      Swal.fire(
        "Upload Failed",
        error?.response?.data?.error || error.message,
        "error"
      );
    }
  };

  return (
    // JSX form with file picker and upload button
    <form onSubmit={handleUpload}>
      <Stack
        direction="row"
        spacing={2}
        py={4}
        alignItems="center"
      >
        <TextField
          type="file"
          inputRef={fileInputRef}
          onChange={handleFileChange}
          variant="outlined"
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!selectedFile}
          sx={{ fontWeight: "bold", borderRadius: 1 }}
        >
          Upload File
        </Button>
      </Stack>
    </form>
  );
};

export default FileUpload;
