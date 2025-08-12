import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import { Button, TextField, Stack } from "@mui/material";

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
      html: "Please do not close or leave this page.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/upload-s3-object`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        const error = await response.json();
        Swal.fire("Upload Failed", `${error.error}`, "error");
      } else {
        Swal.fire("Success", "File uploaded successfully!", "success");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onUploadSuccess();
      }
    } catch (error) {
      Swal.fire("Upload Failed", `${error}`, "error");
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
