import React, { useState } from "react";
import {
  FaFolder,
  FaFile,
  FaExternalLinkAlt,
  FaTrash,
  FaShareAlt,
  FaDownload,
} from "react-icons/fa";
import FileDelete from "./FileDelete.tsx"; // Import the FileDelete component
import Swal from "sweetalert2";
import {
  Box,
  FormControl,
  Grid,
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
  Typography,
} from "@mui/material";

enum SortOption {
  ALPHABETICAL = "Alphabetical",
  DATE_MODIFIED = "Date Modified",
  DATE_CREATED = "Date Created",
}

// Define types for your props
interface File {
  Key: string;
  LastModified: string;
  Size: number;
}

interface Folder {
  Prefix: string;
}

interface Shortcut {
  path: string;
  owner: string;
  name: string | null;
  lastModified: string;
}

interface S3FileListProps {
  files: File[];
  folders: Folder[];
  shortcuts: Shortcut[];
  onFolderChange: (folderKey: string, isShortcut?: boolean) => void;
  isListView: boolean;
  user: string;
  onDeleteSuccess: () => void;
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
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.ALPHABETICAL
  );
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state

  const handleDownload = async (fileKey: string) => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_ENDPOINT
        }/api/generate-download-url?key=${encodeURIComponent(fileKey)}`
      );

      if (!response.ok) throw new Error("Failed to get download URL");

      const { url } = await response.json();
      window.open(url, "_blank"); // or use a programmatic download
    } catch (err) {
      console.error("Download error:", err);
      Swal.fire("Error", "Download failed.", "error");
    }
  };

  const handleShareFolder = async (folderKey: string) => {
    await Swal.fire({
      title: "Share Folder",
      html: `
      <div>
        <input id="username-input" class="swal2-input" placeholder="Enter username">
        <button type="button" id="add-user-btn" class="swal2-confirm swal2-styled" style="margin-left: 8px; padding: 4px 10px;">Add</button>
        <div id="user-list" style="margin-top: 15px; text-align: left;"></div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Share",
      didOpen: () => {
        const addBtn = document.getElementById(
          "add-user-btn"
        ) as HTMLButtonElement;
        const input = document.getElementById(
          "username-input"
        ) as HTMLInputElement;
        const list = document.getElementById("user-list") as HTMLDivElement;

        const addedUsers = new Set<string>();

        addBtn.onclick = () => {
          const username = input.value.trim();
          if (!username || addedUsers.has(username)) {
            input.value = "";
            return;
          }

          addedUsers.add(username);

          const userRow = document.createElement("div");
          userRow.style.marginTop = "5px";
          userRow.innerHTML = `
          <strong>${username}</strong>
          <label style="margin-left: 10px;"><input type="checkbox" class="read" checked> Read</label>
          <label style="margin-left: 10px;"><input type="checkbox" class="write"> Write</label>
          <button class="remove-user" style="margin-left: 10px; color: red;">Remove</button>
        `;

          userRow.setAttribute("data-username", username);
          list.appendChild(userRow);

          userRow
            .querySelector(".remove-user")
            ?.addEventListener("click", () => {
              list.removeChild(userRow);
              addedUsers.delete(username);
            });

          input.value = "";
        };
      },
      preConfirm: () => {
        const list = document.getElementById("user-list") as HTMLDivElement;
        const userDivs = Array.from(list.children);
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
      console.log("line 199: ", users);

      try {
        const currentDate = new Date();
        const res = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}/api/share-folder`,
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
      case SortOption.DATE_CREATED:
        // Assuming there's a 'DateCreated' field, adjust accordingly if you're using a different field.
        sortedFiles.sort(
          (a, b) =>
            new Date(b.LastModified).getTime() -
            new Date(a.LastModified).getTime()
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
      {/* Search Bar */}
      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {/* Sort Button */}
      <Box
        display="flex"
        justifyContent="flex-end"
        mb={4}
      >
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
            <MenuItem value={SortOption.DATE_CREATED}>Date Created</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isListView ? (
        <TableContainer
          sx={{ maxHeight: 400, mb: 4, bgcolor: "background.paper" }}
        >
          <Table
            stickyHeader
            aria-label="file explorer table"
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
                  folder.Prefix.toLowerCase().includes(
                    searchQuery.toLowerCase()
                  )
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
                      sx={{ cursor: "pointer" }}
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
                    <TableCell>{file.Size} bytes</TableCell>
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
      ) : (
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
      )}
    </>
  );
};

export default S3FileList;
