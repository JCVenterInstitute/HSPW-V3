import React, { useState, useContext, useEffect } from "react";
import S3FileList from "./S3FileList.tsx";
import FileUpload from "./FileUpload.tsx";
import FolderCreate from "./FolderCreate.tsx";
import Swal from "sweetalert2";
import { AuthContext } from "../../services/AuthContext.js";
import { Box, Button, Breadcrumbs, Link, Divider } from "@mui/material";

const S3Explorer: React.FC = () => {
  // Access user info from authenticcation context
  const context_data = useContext(AuthContext);
  const user = context_data.user.username;

  const [shortcutRoot, setShortcutRoot] = useState<string | null>(null); // Root folder for when navigating shortcuts
  const [files, setFiles] = useState<any>([]); // Files, folders and shortcuts from s3
  const [historyStack, setHistoryStack] = useState<string[]>([]); // Folder navigation history for go back functionality
  const [currentFolder, setCurrentFolder] = useState<string>(`${user}/`); // Current folder being displayed
  const [breadcrumb, setBreadcrumb] = useState<string[]>([user]); // Breadcrumb path for current folder
  // TODO: re-enable grid view after updating it
  // Grid view needs to filter .files, and display shortcuts from the .shortcut file
  const [isListView, setIsListView] = useState<boolean>(true); // Toggle between list and grid view

  // Function to fetch and files and folders within the current folder
  const fetchFiles = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/list-s3-objects?prefix=${currentFolder}&user=${user}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch: ${errorText}`);
      }

      const data = await response.json();
      setFiles(data); // Update state with fetched data
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching S3 objects:", error.message);
        Swal.fire("Error", error.message, "error");
        handleGoBack(); // Go back to previous folder on error
      } else {
        console.error("Unknown error:", error);
        Swal.fire("Error", "An unknown error occurred.", "error");
        handleGoBack();
      }
    }
  };

  // Fetch files and folders whenever currentFolder changes
  useEffect(() => {
    fetchFiles();
  }, [currentFolder]);

  // Handle changing directories/folders
  const handleFolderChange = (folder: string, isShortcut = false) => {
    // Update users history by adding prefixes to a stack (set to Max 10 folders)
    if (historyStack.length < 10) {
      setHistoryStack((prev) => [...prev, currentFolder]);
    } else {
      setHistoryStack((prev) => [...prev.slice(1), currentFolder]);
    }

    // For jumping directly to a specified path
    if (isShortcut) {
      // If entering a shared folder, set shortcut root
      setShortcutRoot(folder);
      const displayName = folder.split("/").filter(Boolean).pop()!;
      setBreadcrumb([displayName]); // Only show the shared folder name
    } else {
      if (shortcutRoot && folder.startsWith(shortcutRoot)) {
        // navigating deeper into shared folder
        const relPath = folder
          .replace(shortcutRoot, "")
          .split("/")
          .filter(Boolean);
        const sharedRootName = shortcutRoot.split("/").filter(Boolean).pop()!;
        setBreadcrumb([sharedRootName, ...relPath]);
      } else {
        // normal folder navigation
        setShortcutRoot(null);
        setBreadcrumb(folder.split("/").filter(Boolean));
      }
    }
    setCurrentFolder(folder); // Change current folder
  };

  // Handle "Go Back" navigation
  const handleGoBack = () => {
    setHistoryStack((prev) => {
      if (prev.length === 0) return prev;

      const newHistory = [...prev];
      const lastFolder = newHistory.pop();

      if (lastFolder) {
        setCurrentFolder(lastFolder);
        if (shortcutRoot && lastFolder.startsWith(shortcutRoot)) {
          const rel = lastFolder
            .replace(shortcutRoot, "")
            .split("/")
            .filter(Boolean);
          const rootName = shortcutRoot.split("/").filter(Boolean).pop()!;
          setBreadcrumb([rootName, ...rel]);
        } else {
          // Exited the shortcut
          setShortcutRoot(null);
          setBreadcrumb(lastFolder.split("/").filter(Boolean));
        }
      }
      return newHistory;
    });
  };

  // TODO: re-enable grid view after updating it
  // Toggle between list and grid view for file display
  //   const toggleView = () => {
  //     setIsListView(!isListView); // Toggle view type
  //   };

  return (
    <Box p={4}>
      {/* Top controls: Go Back, Refresh, and View Toggle */}
      <Box
        mb={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          display="flex"
          gap={2}
        >
          <Button
            variant="contained"
            onClick={handleGoBack}
          >
            Go Back
          </Button>

          <Button
            variant="contained"
            onClick={fetchFiles}
          >
            {" "}
            Refresh{" "}
          </Button>
        </Box>
        {/* TODO: re-enable grid view after updating it
        <Button
          variant="outlined"
          onClick={toggleView}
        >
          {isListView ? "Switch to Grid View" : "Switch to List View"}
        </Button> */}
      </Box>

      {/* Breadcrumb navigation */}
      <Breadcrumbs separator="›">
        {breadcrumb.map((folder, index) => {
          const pathUpTo = breadcrumb.slice(0, index + 1).join("/") + "/";
          return (
            <Link
              key={index}
              onClick={() => handleFolderChange(pathUpTo)}
              sx={{ cursor: "pointer", color: "primary.main" }}
            >
              {folder}
            </Link>
          );
        })}
      </Breadcrumbs>

      {/* File upload and folder creation components */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <FileUpload
          currentPrefix={currentFolder}
          onUploadSuccess={fetchFiles}
          user={user}
        />
        <FolderCreate
          currentPrefix={currentFolder}
          onCreateSuccess={fetchFiles}
          user={user}
        />
      </Box>

      {/* File and folder list */}
      {files.length === 0 ? null : (
        <S3FileList
          files={files.files.filter((file: any) => !file.Key.endsWith("/"))} // Render files only
          folders={files.folders.filter((file: any) =>
            file.Prefix.endsWith("/")
          )} // Render folders only
          shortcuts={Object.values(files.shortcuts)}
          onFolderChange={handleFolderChange}
          isListView={isListView}
          user={user}
          onDeleteSuccess={fetchFiles}
        />
      )}

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default S3Explorer;
