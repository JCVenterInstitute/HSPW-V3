import { Container, Typography } from "@mui/material";

import MainFeature from "../../assets/hero.jpeg";

const AccessibilityPage = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${MainFeature})`,
        }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Accessibility</h1>
        </Container>
      </div>
      <Container
        maxWidth="xl"
        sx={{ my: 6 }}
      >
        <Typography sx={{ fontFamily: "Lato", fontSize: "18px" }}>
          We are making every effort to ensure that the information available on
          our website is accessible to all. If you use special adaptive
          equipment to access the Web and encounter problems when using our
          site, please <a href="/contact">let us know.</a>
        </Typography>
        <br />
        <Typography sx={{ fontFamily: "Lato", fontSize: "18px" }}>
          We will attempt to provide the information to you in a suitable
          format. It would be helpful if you can be as specific as possible when
          describing the information you seek.
        </Typography>
        <br />
        <Typography sx={{ fontFamily: "Lato", fontSize: "18px" }}>
          Thank you for using the Human Salivary Proteome.
        </Typography>
      </Container>
    </>
  );
};

export default AccessibilityPage;
