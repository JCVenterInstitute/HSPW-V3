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

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        minWidth: "75px",
      }}
    >
      <span
        style={{
          flex: 1,
          paddingRight: 10,
          textWrap: "wrap",
          textAlign: "left",
        }}
      >
        {props.displayName}
      </span>
      <InfoIcon
        onClick={onButtonClick}
        sx={{
          color: "inherit",
          "&:hover": {
            color: "#e9e9e9",
          },
          cursor: "pointer",
          marginLeft: "auto",
        }}
      />
    </div>
  );
};
