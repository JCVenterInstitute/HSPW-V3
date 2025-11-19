import React, { useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Breadcrumbs,
  Link,
  Divider,
  Container,
} from "@mui/material";
import axios from "axios";

import S3FileList from "../../components/Workspace/S3FileList.tsx";
import FileUpload from "../../components/Workspace/FileUpload.tsx";
import FolderCreate from "../../components/Workspace/FolderCreate.tsx";
import { AuthContext } from "../../services/AuthContext.js";
import PageHeader from "../../components/Layout/PageHeader.js";

const WorkSpace: React.FC = () => {
  const {
    user: { username: user },
  } = useContext(AuthContext);

  const MAX_HISTORY = 10; // Maximum number of folders to keep in history for "Go Back" functionality
  const [shortcutRoot, setShortcutRoot] = useState<string | null>(null); // Root folder for when navigating shortcuts
  const [files, setFiles] = useState<any>([]); // Files, folders and shortcuts from s3
  const [historyStack, setHistoryStack] = useState<string[]>([]); // Folder navigation history for go back functionality
  const [currentFolder, setCurrentFolder] = useState<string>(`users/${user}/`); // Current folder being displayed
  const [folderPath, setFolderPath] = useState<string[]>(["users", user]); // Path to current folder

  // TODO: re-enable grid view after updating it
  // Grid view needs to filter .files, and display shortcuts from the .shortcut file
  const [isListView, setIsListView] = useState<boolean>(true); // Toggle between list and grid view

  // Fetch files and folders within the current folder
  const fetchFiles = async () => {
    try {
      const response = await axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/list-s3-objects`,
          {
            params: { prefix: currentFolder, user },
          }
        )
        .then((res) => res.data);

      setFiles(response); // Update state with fetched data
    } catch (error: any) {
      console.error("Error fetching files:", error.message);
      Swal.fire("Error", error.message, "error");
      handleGoBack(); // Go back to previous folder on error
    }
  };

  // Fetch new files and folders when currentFolder changes
  useEffect(() => {
    fetchFiles();
  }, [currentFolder]);

  // Handle changing directories/folders
  const handleFolderChange = (folder: string, isShortcut = false) => {
    // Update users history by adding prefixes to a stack
    if (historyStack.length < MAX_HISTORY) {
      setHistoryStack((prev) => [...prev, currentFolder]);
    } else {
      setHistoryStack((prev) => [...prev.slice(1), currentFolder]);
    }

    // For jumping directly to a specified path
    if (isShortcut) {
      // If entering a shared folder, set shortcut root
      setShortcutRoot(folder);

      const displayName = folder.split("/").filter(Boolean).pop()!;

      setFolderPath([displayName]); // Only show the shared folder name
    } else {
      if (shortcutRoot && folder.startsWith(shortcutRoot)) {
        // navigating deeper into shared folder
        const relPath = folder
          .replace(shortcutRoot, "")
          .split("/")
          .filter(Boolean);
        const sharedRootName = shortcutRoot.split("/").filter(Boolean).pop()!;
        setFolderPath([sharedRootName, ...relPath]);
      } else {
        // normal folder navigation
        setShortcutRoot(null);

        setFolderPath(folder.split("/").filter(Boolean));
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
          setFolderPath([rootName, ...rel]);
        } else {
          // Exited the shortcut
          setShortcutRoot(null);
          setFolderPath(lastFolder.split("/").filter(Boolean));
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

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Account" },
    { path: "Workspace" },
  ];

  return (
    <>
      <PageHeader
        tabTitle={`HSP | Workspace`}
        title={`Workspace`}
        breadcrumb={breadcrumbPath}
        description={`View and manage your submissions or data files.`}
      />
      <Container maxWidth="xl">
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
                disabled={historyStack.length === 0}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                onClick={fetchFiles}
              >
                Refresh
              </Button>
            </Box>
            {/* TODO: re-enable grid view after updating it */}
            {/* <Button
              variant="outlined"
              onClick={toggleView}
            >
              {isListView ? "Switch to Grid View" : "Switch to List View"}
            </Button> */}
          </Box>
          {/* Breadcrumb navigation */}
          <Breadcrumbs separator="›">
            {folderPath.map((folder, index) => {
              const pathUpTo = folderPath.slice(0, index + 1).join("/") + "/";

              // Don't show the user's folder
              if (index === 0) return;

              return (
                <Link
                  key={index}
                  onClick={() => handleFolderChange(pathUpTo)}
                  sx={{ cursor: "pointer", color: "primary.main" }}
                >
                  {index === 1 ? "Home" : folder}
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
      </Container>
    </>
  );
};

export default WorkSpace;
