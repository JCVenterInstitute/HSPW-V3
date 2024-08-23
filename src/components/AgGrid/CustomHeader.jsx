import InfoIcon from "@mui/icons-material/Info";
import Swal from "sweetalert2";

export default (props) => {
  const onButtonClick = (event) => {
    event.stopPropagation();
    Swal.fire({
      title: props.tooltipText,
      html: props.tooltipHTML,
      confirmButtonColor: "#1464b4",
    });
  };
  const onHeaderClick = () => {
    props.progressSort();
  };

  return (
    <div
      className="custom-header"
      onClick={onHeaderClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ flex: 1, cursor: "pointer", paddingRight: 10 }}>
        {props.displayName}
      </span>
      <InfoIcon
        onClick={onButtonClick}
        sx={{
          color: "inherit",
          "&:hover": {
            color: "#e9e9e9",
          },
          marginLeft: "auto", // Ensures the icon is pushed to the right
        }}
      />
    </div>
  );
};
