import React from "react";
import Swal from "sweetalert2";
import { Button } from "@mui/material";
import axios from "axios";

interface FolderCreateProps {
  currentPrefix: string; // Current folder path where new folder should be created
  onCreateSuccess: () => void; // Callback to refresh parent S3 explorer after folder creation
  user: string; // Username of current user
}

const FolderCreate: React.FC<FolderCreateProps> = ({
  currentPrefix,
  onCreateSuccess,
  user,
}) => {
  const handleCreateFolder = async () => {
    const { value: folderName } = await Swal.fire({
      title: "Create New Folder",
      input: "text",
      inputLabel: "Folder name",
      inputPlaceholder: "Enter folder name",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Folder name cannot be empty"; // Cannot be empty
        if (value.startsWith(".")) return "Dot folders are not allowed"; // Cannot begin with .
        if (value.includes("/")) return "Folder name cannot contain slashes"; // Cannot contain slashes
        return null;
      },
    });

    if (!folderName) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/create-folder`,
        {
          prefix: currentPrefix, // Parent folder path
          folderName, // New folder name
          user, // Current user
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire("success", "Folder created successfully", "success"); // Show success modal

      onCreateSuccess(); // Trigger parent component to refresh S3 file/folder List
    } catch (error) {
      console.error("Error creating folder:", error);
      Swal.fire("Error", "Failed to create folder", "error"); // Show generic error modal
    }
  };

  return (
    // Button that triggers folder creation modal
    <Button
      variant="contained"
      onClick={handleCreateFolder}
      color="primary"
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
    >
      + New Folder
    </Button>
  );
};

export default FolderCreate;
