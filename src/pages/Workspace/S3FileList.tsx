import React, { useState } from "react";
import {
  FaFolder,
  FaFile,
  FaExternalLinkAlt,
  FaTrash,
  FaShareAlt,
  FaDownload,
} from "react-icons/fa";
import Swal from "sweetalert2";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
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

import FileDelete from "./FileDelete.tsx"; // Import the FileDelete component
import axios from "axios";

// Enum for sorting options
enum SortOption {
  ALPHABETICAL = "Alphabetical",
  DATE_MODIFIED = "Date Modified",
}

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
  isListView: boolean; // Whether to show in list view or grid view
  user: string; // Current logged-in user
  onDeleteSuccess: () => void; // Callback after file/folder is deleted
}

const S3FileList: React.FC<S3FileListProps> = ({
  files,
  folders,
  shortcuts,
  onFolderChange,
  isListView,
  user,
  onDeleteSuccess,
}) => {
  // Currently selected sorting option (defaults to alphabetical)
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.ALPHABETICAL
  );

  // Search query string
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Byte formatter helper function
  const formatBytes = (a: number, b = 2) => {
    if (!+a) return "0 Bytes";
    const c = 0 > b ? 0 : b,
      d = Math.floor(Math.log(a) / Math.log(1024));
    return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${["Bytes", "KiB", "MiB", "GiB"][d]}`;
  };

  // Handle file download by generating a presigned S3 URL
  const handleDownload = async (fileKey: string) => {
    try {
      const { url }: { url: string } = await axios
        .get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/generate-download-url`,
          {
            params: { key: fileKey }, // axios handles encoding automatically
          }
        )
        .then((res) => res.data);

      window.open(url, "_blank"); // or use a programmatic download
    } catch (err) {
      console.error("Download error:", err);
      Swal.fire("Error", "Download failed.", "error");
    }
  };

  // Handle folder sharing by showing a SweetAlert modal
  // Allows adding/removing users and setting read/write permissions
  const handleShareFolder = async (folderKey: string) => {
    let currentPermissions: Record<string, any> = {};

    console.log("Sharing folder:", folderKey, user);

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

    console.log("Current permissions:", currentPermissions);

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
        const res = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}/api/workspace/share-folder`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              folderKey,
              user: user,
              lastModified: currentDate.toLocaleString(),
              targets: users,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Sharing failed");

        Swal.fire("Success", "Folder shared successfully!", "success");
      } catch (err: any) {
        console.error(err);
        Swal.fire("Error", err?.message || "Failed to share folder", "error");
      }
    });
  };

  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    setSortOption(event.target.value as SortOption);
  };

  // Sorting logic based on the selected option
  const sortFilesAndFolders = () => {
    let sortedFolders = [...folders];
    let sortedFiles = [...files];
    let sortedShortcuts = [...shortcuts];

    switch (sortOption) {
      case SortOption.ALPHABETICAL:
        sortedFolders.sort((a, b) => a.Prefix.localeCompare(b.Prefix));
        sortedFiles.sort((a, b) => a.Key.localeCompare(b.Key));
        sortedShortcuts.sort((a, b) => a.path.localeCompare(b.path));
        break;
      case SortOption.DATE_MODIFIED:
        sortedFiles.sort(
          (a, b) =>
            new Date(b.LastModified).getTime() -
            new Date(a.LastModified).getTime()
        );
        sortedShortcuts.sort(
          (a, b) =>
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime()
        );
        break;
      default:
        break;
    }

    // Apply search filtering
    if (searchQuery.trim()) {
      sortedFolders = sortedFolders.filter((folder) =>
        folder.Prefix.toLowerCase().includes(searchQuery.toLowerCase())
      );
      sortedFiles = sortedFiles.filter((file) =>
        file.Key.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return { sortedFolders, sortedFiles, sortedShortcuts };
  };

  const { sortedFolders, sortedFiles, sortedShortcuts } = sortFilesAndFolders();

  return (
    <>
      {/* Top toolbar with search + sort controls */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        mb={4}
      >
        {/* Search input */}
        <TextField
          variant="outlined"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        {/* Sort dropdown */}
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
      {/* TODO: Add back grid view after updating it */}
      {/* {isListView ? ( */}
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
            {sortedFolders
              .filter((folder) =>
                folder.Prefix.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((folder) => (
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
                    {folder.Prefix.split("/").slice(-2, -1)[0]}
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
                        >
                          <FaShareAlt />
                        </IconButton>
                      </Tooltip>
                      <FileDelete
                        fileKey={folder.Prefix}
                        onDeleteSuccess={onDeleteSuccess}
                        user={user}
                      >
                        <Tooltip title="Delete Folder">
                          <IconButton
                            size="small"
                            color="error"
                          >
                            <FaTrash />
                          </IconButton>
                        </Tooltip>
                      </FileDelete>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {sortedFiles
              .filter(
                (file) =>
                  !file.Key.split("/").pop()?.startsWith(".") &&
                  file.Key.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((file) => (
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
                  <TableCell>{file.Key.split("/").slice(-1)[0]}</TableCell>
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
                      >
                        <Tooltip title="Delete File">
                          <IconButton
                            size="small"
                            color="error"
                          >
                            <FaTrash />
                          </IconButton>
                        </Tooltip>
                      </FileDelete>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {sortedShortcuts.length > 0 &&
              sortedShortcuts.map((shortcut) => (
                <TableRow
                  key={shortcut.path}
                  hover
                >
                  <TableCell align="center">
                    <FaExternalLinkAlt
                      size={20}
                      color="#8b5cf6"
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
      {/*) 
       : (
         <Grid
           container
           spacing={2}
         >
           {sortedFolders
             .filter(
               (folder) =>
                 !folder.Prefix.split("/")
                   .filter(Boolean)
                   .pop()
                   ?.startsWith(".") &&
                 folder.Prefix.toLowerCase().includes(searchQuery.toLowerCase())
             )
             .map((folder) => (
               <Grid
                 item
                 xs={12}
                 sm={6}
                 md={4}
                 key={folder.Prefix}
               >
                 <Box
                   border={1}
                   borderColor="grey.300"
                   borderRadius={1}
                   p={2}
                   position="relative"
                   height="150px"
                   display="flex"
                   flexDirection="column"
                   justifyContent="space-between"
                 >
                   <Box>
                     <FaFolder
                       size={40}
                       color="#3b82f6"
                     />
                   </Box>

                   <Typography
                     variant="subtitle1"
                     noWrap
                   >
                     {folder.Prefix.split("/").slice(-2, -1)[0]}
                   </Typography>

                   <Typography variant="body2">-</Typography>

                   <Box
                     position="absolute"
                     top={8}
                     right={8}
                     display="flex"
                     gap={1}
                     alignItems="center"
                   >
                     <Tooltip title="Share Folder">
                       <IconButton
                         size="small"
                         color="success"
                         onClick={() => handleShareFolder(folder.Prefix)}
                       >
                         <FaShareAlt />
                       </IconButton>
                     </Tooltip>

                     <FileDelete
                       fileKey={folder.Prefix}
                       onDeleteSuccess={onDeleteSuccess}
                       user={user}
                     >
                       <Tooltip title="Delete Folder">
                         <IconButton
                           size="small"
                           color="error"
                         >
                           <FaTrash />
                         </IconButton>
                       </Tooltip>
                     </FileDelete>
                   </Box>
                 </Box>
               </Grid>
             ))}

           {sortedFiles
             .filter((file) =>
               file.Key.toLowerCase().includes(searchQuery.toLowerCase())
             )
             .map((file) => (
               <Grid
                 item
                 xs={12}
                 sm={6}
                 md={4}
                 key={file.Key}
               >
                 <Box
                   border={1}
                   borderColor="grey.300"
                   borderRadius={1}
                   p={2}
                   position="relative"
                   height="150px"
                   display="flex"
                   flexDirection="column"
                   justifyContent="space-between"
                 >
                   <Box>
                     <FaFile
                       size={40}
                       color="#6b7280"
                     />
                   </Box>

                   <Typography
                     variant="subtitle1"
                     noWrap
                   >
                     {file.Key.split("/").slice(-1)[0]}
                   </Typography>

                   <Typography
                     variant="body2"
                     noWrap
                   >
                     {new Date(file.LastModified).toLocaleString()}
                   </Typography>

                   <Typography
                     variant="body2"
                     noWrap
                   >{`${file.Size} bytes`}</Typography>

                   <Box
                     position="absolute"
                     top={8}
                     right={8}
                     display="flex"
                     gap={1}
                     alignItems="center"
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
                     >
                       <Tooltip title="Delete File">
                         <IconButton
                           size="small"
                           color="error"
                         >
                           <FaTrash />
                         </IconButton>
                       </Tooltip>
                     </FileDelete>
                   </Box>
                 </Box>
               </Grid>
             ))}
         </Grid>
       )*/}
    </>
  );
};

export default S3FileList;
