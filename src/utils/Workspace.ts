import Swal from "sweetalert2";
import axios from "axios";

// Enum for sorting options
enum SortOption {
  ALPHABETICAL = "Alphabetical",
  DATE_MODIFIED = "Date Modified",
}

const handleSubmissionLink = async (fileKey: string) => {
  try {
    const presignedUrl = await axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/api/getJSONFile`, {
        params: {
          s3Key: fileKey,
        },
      })
      .then((res) => res.data.url);

    const fileResponse = await fetch(presignedUrl);
    const { link } = await fileResponse.json();

    Swal.fire({
      icon: "question",
      title: "Navigate to results page?",
      text: "Are you sure you want to leave the page?",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        window.open(link, "_self");
      }
    });
  } catch (err) {
    console.error("Download error:", err);
    Swal.fire("Error", "Download failed.", "error");
  }
};

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

// Sorting logic based on the selected option
const sortFilesAndFolders = (
  searchQuery: any,
  sortOption: any,
  folders: any,
  files: any,
  shortcuts: any
) => {
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

export {
  handleSubmissionLink,
  formatBytes,
  handleDownload,
  sortFilesAndFolders,
  SortOption,
};
