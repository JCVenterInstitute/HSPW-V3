import { Container } from "@mui/material";

/**
 * Banner for home
 */
const HomeBanner = () => {
  const styles = {
    bannerSection: { backgroundColor: "#e6eeaf" },
    bannerContainer: {
      fontSize: "18px",
      paddingY: "12px",
      borderRadius: "16px",
    },
  };

  return (
    <section style={styles.bannerSection}>
      <Container
        maxWidth="xl"
        sx={styles.bannerContainer}
      >
        {`Our team is thrilled to release the Human Salivary Proteome
                (HSP) version 2.0 with our goal to accelerate breakthroughs in
                biomarker discovery, foster collaborative research, and impact
                precision medicine. More information can be found `}
        <a
          href={`${process.env.REACT_APP_PUBLIC_STATIC_S3_HOST}/web-static/HSP2.0_Flyer.pdf`}
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        {` for a quick snapshot.`}
      </Container>
    </section>
  );
};

export default HomeBanner;
