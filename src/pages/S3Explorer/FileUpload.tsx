import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import { Button, TextField, Stack } from "@mui/material";
import axios from "axios";

interface FileUploadProps {
  currentPrefix: string;
  onUploadSuccess: () => void;
  user: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  currentPrefix,
  onUploadSuccess,
  user,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files ? e.target.files[0] : null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (selectedFile.name.startsWith(".")) {
      Swal.fire("Error", "Uploading dotfiles is not allowed.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("prefix", currentPrefix);
    formData.append("user", user);

    Swal.fire({
      title: "Uploading...",
      html: `<div style="width:100%;background:#eee;border-radius:5px;">
             <div id="progress-bar" style="width:0%;background:#3085d6;height:20px;border-radius:5px;"></div>
           </div>
           <div id="progress-text" style="margin-top:10px;">0%</div>`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/upload-s3-object`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
            );
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
      onUploadSuccess();
    } catch (error) {
      Swal.fire(
        "Upload Failed",
        error?.response?.data?.error || error.message,
        "error"
      );
    }
  };

  return (
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
          sx={{ fontWeight: "bold", borderRadius: 1 }}
        >
          Upload File
        </Button>
      </Stack>
    </form>
  );
};

export default FileUpload;
