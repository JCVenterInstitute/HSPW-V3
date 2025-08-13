import React, { useState, useContext, useEffect } from "react";
import S3FileList from "./S3FileList.tsx";
import FileUpload from "./FileUpload.tsx";
import FolderCreate from "./FolderCreate.tsx";
import Swal from "sweetalert2";
import { AuthContext } from "../../services/AuthContext.js";
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Link,
  Divider,
} from "@mui/material";

const S3Explorer: React.FC = () => {
  const context_data = useContext(AuthContext);
  const user = context_data.user.username;
  const [shortcutRoot, setShortcutRoot] = useState<string | null>(null);
  const [files, setFiles] = useState<any>([]);
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>(`${user}/`); // Start at configs folder
  const [breadcrumb, setBreadcrumb] = useState<string[]>([user]); // Initialize breadcrumb
  const [isListView, setIsListView] = useState<boolean>(true); // Toggle for view type

  const fetchFiles = async () => {
    console.log(currentFolder);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/list-s3-objects?prefix=${currentFolder}&user=${user}`
      );

      if (!response.ok) {
        const errorText = await response.text(); // Parse error message safely
        throw new Error(`Failed to fetch: ${errorText}`);
      }

      const data = await response.json();
      setFiles(data);
      console.log(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching S3 objects:", error.message);
        Swal.fire("Error", error.message, "error");
        handleGoBack();
      } else {
        console.error("Unknown error:", error);
        Swal.fire("Error", "An unknown error occurred.", "error");
        handleGoBack();
      }
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [currentFolder]);

  const handleFolderChange = (folder: string, isShortcut = false) => {
    if (historyStack.length < 5) {
      setHistoryStack((prev) => [...prev, currentFolder]);
    } else {
      setHistoryStack((prev) => [...prev.slice(1), currentFolder]);
    }

    if (isShortcut) {
      setShortcutRoot(folder);
      const displayName = folder.split("/").filter(Boolean).pop()!;
      setBreadcrumb([displayName]); // Only show the shared folder name
    } else {
      if (shortcutRoot && folder.startsWith(shortcutRoot)) {
        // navigating deeper into shortcut
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

    setBreadcrumb(folder.split("/").filter(Boolean));
  };

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

  const toggleView = () => {
    setIsListView(!isListView); // Toggle view type
  };

  return (
    <Box p={4}>
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
          {/* <Button
            variant="contained"
            onClick={changeUser}
          >
            {" "}
            Current User: {user}{" "}
          </Button> */}
        </Box>
        <Button
          variant="outlined"
          onClick={toggleView}
        >
          {isListView ? "Switch to Grid View" : "Switch to List View"}
        </Button>
      </Box>

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
