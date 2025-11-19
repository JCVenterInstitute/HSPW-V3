import axios from "axios";
import React from "react";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

import { IconButton, Tooltip } from "@mui/material";

interface FileDeleteProps {
  fileKey: string; // Full S3 object key for the file/folder to delete
  onDeleteSuccess: () => void; // Callback to refresh parent S3Explorer after delete
  user: string; // Username performing the delete action
}

const FileDelete: React.FC<FileDeleteProps> = ({
  fileKey,
  onDeleteSuccess,
  user,
}) => {
  // Handles the delete request when the wrapped element is clicked
  const handleDelete = async (e: React.MouseEvent) => {
    // Prevents parent click events (like folder navigation) from firing
    e.stopPropagation();

    const objectName = fileKey.split("/").at(-1) || fileKey.split("/").at(-2);

    // Confirmation dialog show to the user before deletion
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${objectName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/delete-s3-file`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            key: fileKey,
            user,
          },
        }
      );

      await Swal.fire("Deleted!", "Your file has been deleted.", "success");

      // Trigger parent component to refresh S3 file/folder List
      onDeleteSuccess();
    } catch (err) {
      Swal.fire("Error", `Failed to delete file: ${err}`, "error");
    }
  };

  // Wraps any child component making them trigger handle delete on click
  return (
    <span onClick={handleDelete}>
      <Tooltip title="Delete File">
        <IconButton
          size="small"
          color="error"
        >
          <FaTrash />
        </IconButton>
      </Tooltip>
    </span>
  );
};

export default FileDelete;
