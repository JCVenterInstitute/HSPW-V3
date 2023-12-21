import { Box } from "@mui/material";

const Genes = ({ searchQuery }) => {
  return (
    <>
      <Box
        component="fieldset"
        sx={{ p: 2, mb: 2, mt: 3 }}
      >
        <legend
          style={{
            fontSize: "100%",
            backgroundColor: "#e5e5e5",
            color: "#222",
            padding: "0.1em 0.5em",
            border: "2px solid #d8d8d8",
          }}
        >
          Genes
        </legend>
      </Box>
    </>
  );
};

export default Genes;
