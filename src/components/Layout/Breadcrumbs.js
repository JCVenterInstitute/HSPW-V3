import { Breadcrumbs, Container, Link, Typography } from "@mui/material";

const BreadCrumb = ({ path }) => {
  return (
    <section style={{ backgroundColor: "##c9c9c9" }}>
      <Container
        maxWidth="xl"
        sx={{ padding: "10px" }}
      >
        <Breadcrumbs
          id="breadcrumb"
          aria-label="breadcrumb"
          sx={{
            color: "#266cb4",
            textDecoration: "none",
            fontSize: "16px",
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
      </Container>
    </section>
  );
};

export default BreadCrumb;
