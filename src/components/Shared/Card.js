import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const CardComponent = ({ rawContent, title, blurb, imageSrc }) => {
  const styles = {
    card: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      borderRadius: "16px",
      minHeight: "400px",
    },
    cardTitle: {
      fontFamily: "Lato",
      fontSize: "18px",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    cardBlurb: {
      fontFamily: "Lato",
      fontSize: "16px",
    },
  };

  return (
    <Card sx={styles.card}>
      {rawContent ? (
        rawContent
      ) : (
        <>
          <CardContent className="card-content">
            {rawContent ? (
              rawContent
            ) : (
              <>
                <Typography
                  component="div"
                  sx={styles.cardTitle}
                >
                  {title}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={styles.cardBlurb}
                >
                  {blurb}
                </Typography>
              </>
            )}
          </CardContent>
          <CardMedia
            component={"img"}
            image={imageSrc}
            sx={{ marginY: "30px" }}
          />
        </>
      )}
    </Card>
  );
};

export default CardComponent;
