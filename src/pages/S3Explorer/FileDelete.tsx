import React from "react";
import Swal from "sweetalert2";

interface FileDeleteProps {
  fileKey: string; // Full S3 object key for the file/folder to delete
  onDeleteSuccess: () => void; // Callback to refresh parent S3Explorer after delete
  user: string; // Username performing the delete action
  children: React.ReactNode; // UI element (e.g., delete button/icon) wrapped by this component
}

const FileDelete: React.FC<FileDeleteProps> = ({
  fileKey,
  onDeleteSuccess,
  user,
  children,
}) => {
  // Handles the delete request when the wrapped element is clicked
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents parent click events (like folder navigation) from fireing
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

    // exits early if the user cancels
    if (!result.isConfirmed) return;

    try {
      // send DELETE request to backend
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/delete-s3-file`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key: fileKey, user }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        Swal.fire("Delete Failed", `${error.error}`, "error"); // Show error modal
      } else {
        await Swal.fire("Deleted!", "Your file has been deleted.", "success"); // Show success modal
        onDeleteSuccess(); // Trigger parent component to refresh S3 file/folder List
      }
    } catch (err) {
      Swal.fire("Error", `Failed to delete file: ${err}`, "error");
    }
  };

  // Wraps any child component making them trigger handle delete on click
  return <span onClick={handleDelete}>{children}</span>;
};

export default FileDelete;
