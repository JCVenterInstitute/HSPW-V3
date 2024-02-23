import { Breadcrumbs, Link, Typography } from "@mui/material";

const BreadCrumb = ({ path }) => {
  return (
    <Breadcrumbs
      id="breadcrumb"
      aria-label="breadcrumb"
      sx={{
        color: "white",
        marginBottom: "20px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      {path.map((crumb, i) => {
        const { path, link } = crumb;

        return i !== path.length ? (
          <Link
            underline={link ? "always" : "none"}
            key={`breadcrumb-${i}`}
            color="inherit"
            href={link}
          >
            {path}
          </Link>
        ) : (
          <Typography>{path}</Typography>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadCrumb;
