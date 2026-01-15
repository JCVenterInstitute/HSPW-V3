import React, { useState } from "react";
import {
  FaFolder,
  FaFile,
  FaShareAlt,
  FaDownload,
  FaLink,
} from "react-icons/fa";
import { RiFolderSharedFill } from "react-icons/ri";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";

import FileDelete from "./FileDelete.tsx"; // Import the FileDelete component
import {
  formatBytes,
  handleDownload,
  handleSubmissionLink,
  sortFilesAndFolders,
  SortOption,
} from "../../utils/Workspace.ts";

// Types of S3 objects and shortcuts
interface File {
  Key: string; // Full S3 file key
  LastModified: string; // Last modified date
  Size: number; // File size in bytes
}

interface Folder {
  Prefix: string; // S3 folder prefix
}

interface Shortcut {
  path: string; // Target path the shortcut points to
  owner: string; // Who created the shortcut
  name: string | null; // Display name of the shortcut
  lastModified: string; // Last modification date
}

interface S3FileListProps {
  files: File[]; // Files to display
  folders: Folder[]; //Folders to display
  shortcuts: Shortcut[]; // Shortcuts to display
  onFolderChange: (folderKey: string, isShortcut?: boolean) => void; // Callback when a folder is clicked
  user: string; // Current logged-in user
  onDeleteSuccess: () => void; // Callback after file/folder is deleted
}

const S3FileList: React.FC<S3FileListProps> = ({
  files,
  folders,
  shortcuts,
  onFolderChange,
  user,
  onDeleteSuccess,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.ALPHABETICAL
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { sortedFolders, sortedFiles, sortedShortcuts } = sortFilesAndFolders(
    searchQuery,
    sortOption,
    folders,
    files,
    shortcuts
  );

  // Handle folder sharing by showing a SweetAlert modal
  // Allows adding/removing users and setting read/write permissions
  const handleShareFolder = async (folderKey: string) => {
    let currentPermissions: Record<string, any> = {};

    // Fetch existing permissions for this file
    try {
      currentPermissions = await axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/get-permissions?folderKey=${encodeURIComponent(folderKey)}&user=${encodeURIComponent(user)}`
        )
        .then((res) => res.data);
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }

    // Show modal to manage permissions
    await Swal.fire({
      title: "Share Folder",
      html: `
        <div style="text-align: left;">
          <div style="display: flex; gap: 8px; margin-bottom: 12px; align-items: center;">
            <input id="username-input" class="swal2-input" placeholder="Enter username" style="flex: 1; height: 36px; margin: 0; box-sizing: border-box;">
            <button type="button" id="add-user-btn" class="swal2-confirm swal2-styled" style="padding: 0 12px; height: 36px; line-height: 36px;">
                Add
            </button>
          </div>
          <div id="user-list" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 8px; border-radius: 6px;"/>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Update",
      didOpen: () => {
        const addBtn = document.getElementById(
          "add-user-btn"
        ) as HTMLButtonElement;
        const input = document.getElementById(
          "username-input"
        ) as HTMLInputElement;
        const list = document.getElementById("user-list") as HTMLDivElement;
        const addedUsers = new Set<string>();

        // Prepopulate with existing users and permissions.
        Object.entries(currentPermissions).forEach(([username, perms]) => {
          if (username === "_meta") return;
          addedUsers.add(username);

          // Create a row for each user with checkboxes
          const userRow = document.createElement("div");
          userRow.style.display = "flex";
          userRow.style.alignItems = "center";
          userRow.style.justifyContent = "space-between";
          userRow.style.marginBottom = "6px";
          userRow.style.padding = "4px 6px";
          userRow.style.borderBottom = "1px solid #eee";
          userRow.innerHTML = `
            <div style="flex:1;">
              <strong>${username}</strong>
              <label style="margin-left: 10px;"><input type="checkbox" class="read" ${perms.read ? "checked" : ""}> Read</label>
              <label style="margin-left: 10px;"><input type="checkbox" class="write" ${perms.write ? "checked" : ""}> Write</label>
            </div>
            <button class="remove-user" style="margin-left: 10px; color: red; background:none; border:none; cursor:pointer;">✖</button>
          `;
          userRow.setAttribute("data-username", username);
          list.appendChild(userRow);

          // Add remove functionality
          userRow
            .querySelector(".remove-user")
            ?.addEventListener("click", () => {
              list.removeChild(userRow);
              addedUsers.delete(username);
            });
        });

        // Add new user functionality
        addBtn.onclick = () => {
          const username = input.value.trim();
          if (!username || addedUsers.has(username)) {
            input.value = "";
            return;
          }
          addedUsers.add(username);

          // Create row for new user
          const userRow = document.createElement("div");
          userRow.style.display = "flex";
          userRow.style.alignItems = "center";
          userRow.style.justifyContent = "space-between";
          userRow.style.marginBottom = "6px";
          userRow.style.padding = "4px 6px";
          userRow.style.borderBottom = "1px solid #eee";
          userRow.innerHTML = `
            <div style="flex:1;">
              <strong>${username}</strong>
              <label style="margin-left: 10px;"><input type="checkbox" class="read" checked> Read</label>
              <label style="margin-left: 10px;"><input type="checkbox" class="write"> Write</label>
            </div>
            <button class="remove-user" style="margin-left: 10px; color: red; background:none; border:none; cursor:pointer;">✖</button>
          `;
          userRow.setAttribute("data-username", username);
          list.appendChild(userRow);

          // Remove handler
          userRow
            .querySelector(".remove-user")
            ?.addEventListener("click", () => {
              list.removeChild(userRow);
              addedUsers.delete(username);
            });
          input.value = "";
        };
      },

      // Validation before confirming
      preConfirm: () => {
        const list = document.getElementById("user-list") as HTMLDivElement;
        const userDivs = Array.from(list.children);

        // Collect all users with permissions
        const users = userDivs.map((div) => {
          const username = div.getAttribute("data-username");
          const read =
            (div.querySelector(".read") as HTMLInputElement)?.checked ?? false;
          const write =
            (div.querySelector(".write") as HTMLInputElement)?.checked ?? false;
          return { username, permissions: { read, write } };
        });
        if (users.length === 0) {
          Swal.showValidationMessage("Please add at least one user.");
          return;
        }
        return users;
      },
    }).then(async (result) => {
      if (!result.isConfirmed || !result.value) return;

      const users = result.value;

      try {
        const currentDate = new Date();

        // Submit updated permissions to backend
        await axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/share-folder`,
          {
            folderKey,
            user,
            lastModified: currentDate.toLocaleString(),
            targets: users,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        Swal.fire("Success", "Folder shared successfully!", "success");
      } catch (err: any) {
        console.error("> Share folder error: ", err);

        Swal.fire(
          "Error",
          err.status === 403
            ? "Access denied. Only folder owner can update permissions"
            : err?.message || "Failed to share folder",
          "error"
        );
      }
    });
  };

  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    setSortOption(event.target.value as SortOption);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        mb={4}
      >
        <TextField
          variant="outlined"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControl
          variant="outlined"
          size="small"
          sx={{ minWidth: 200 }}
        >
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortOption}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value={SortOption.ALPHABETICAL}>Alphabetical</MenuItem>
            <MenuItem value={SortOption.DATE_MODIFIED}>Date Modified</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer
        sx={{ maxHeight: 400, mb: 4, bgcolor: "background.paper" }}
      >
        <Table
          stickyHeader
          aria-label="Workspace table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedFiles
              .filter(
                (file) =>
                  !file.Key.split("/").pop()?.startsWith(".") &&
                  file.Key.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((file) => {
                const fileName = file.Key.split("/").slice(-1)[0];

                if (fileName !== "Submission.html") {
                  return null;
                }

                return (
                  <TableRow
                    key={file.Key}
                    hover
                  >
                    <TableCell align="center">
                      <FaLink
                        size={20}
                        color="#6b7280"
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        sx={{
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                        onClick={(e) => handleSubmissionLink(file.Key)}
                      >
                        {fileName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {new Date(file.LastModified).toLocaleString()}
                    </TableCell>
                    <TableCell>{formatBytes(file.Size)}</TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <Tooltip title="Download File">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleDownload(file.Key)}
                          >
                            <FaDownload />
                          </IconButton>
                        </Tooltip>
                        <FileDelete
                          fileKey={file.Key}
                          onDeleteSuccess={onDeleteSuccess}
                          user={user}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            {sortedFolders
              .filter((folder) =>
                folder.Prefix.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((folder) => {
                const folderName = folder.Prefix.split("/").slice(-2, -1)[0];

                return (
                  <TableRow
                    key={folder.Prefix}
                    hover
                  >
                    <TableCell align="center">
                      <FaFolder
                        size={20}
                        color="#3b82f6"
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                      onClick={() => onFolderChange(folder.Prefix)}
                    >
                      {folderName}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <Tooltip title="Share Folder">
                          <IconButton
                            size="small"
                            onClick={() => handleShareFolder(folder.Prefix)}
                            color="success"
                            disabled={
                              folderName === "Shared Folders" ? true : false
                            }
                          >
                            <FaShareAlt />
                          </IconButton>
                        </Tooltip>
                        <FileDelete
                          fileKey={folder.Prefix}
                          onDeleteSuccess={onDeleteSuccess}
                          user={user}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            {sortedFiles
              .filter(
                (file) =>
                  !file.Key.split("/").pop()?.startsWith(".") &&
                  file.Key.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((file) => {
                const fileName = file.Key.split("/").slice(-1)[0];

                if (fileName === "Submission.html") {
                  return null;
                }

                return (
                  <TableRow
                    key={file.Key}
                    hover
                  >
                    <TableCell align="center">
                      <FaFile
                        size={20}
                        color="#6b7280"
                      />
                    </TableCell>
                    <TableCell>{fileName}</TableCell>
                    <TableCell>
                      {new Date(file.LastModified).toLocaleString()}
                    </TableCell>
                    <TableCell>{formatBytes(file.Size)}</TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <Tooltip title="Download File">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleDownload(file.Key)}
                          >
                            <FaDownload />
                          </IconButton>
                        </Tooltip>
                        <FileDelete
                          fileKey={file.Key}
                          onDeleteSuccess={onDeleteSuccess}
                          user={user}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            {sortedShortcuts.length > 0 &&
              sortedShortcuts.map((shortcut) => (
                <TableRow
                  key={shortcut.path}
                  hover
                >
                  <TableCell align="center">
                    <RiFolderSharedFill
                      size={20}
                      color="#2b6fb5"
                    />
                  </TableCell>
                  <TableCell
                    sx={{ cursor: "pointer" }}
                    onClick={() => onFolderChange(shortcut.path, true)}
                  >
                    {shortcut.name
                      ? shortcut.name
                      : shortcut.path.split("/").at(-2)}
                  </TableCell>
                  <TableCell>{shortcut.lastModified}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default S3FileList;
