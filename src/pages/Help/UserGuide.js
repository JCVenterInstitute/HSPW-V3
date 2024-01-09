import React from "react";
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import main_feature from "../../assets/hero.jpeg";
import memberInfo from "../../components/Help/Team/memberInfo";

const UserGuide = () => {
  return (
    <>
      <div style={{ backgroundImage: `url(${main_feature})` }}>
        <h1
          style={{
            color: "white",
            display: "left",
            marginLeft: "20px",
            marginBottom: "1rem",
            paddingTop: "25px",
            paddingLeft: "40px",
          }}
        >
          User Guide
        </h1>
        <p
          style={{
            textAlign: "left",
            color: "white",
            fontSize: "18px",
            paddingBottom: "25px",
            marginLeft: "20px",
            marginRight: "20px",
            paddingLeft: "40px",
            paddingRight: "40px",
          }}
        >
          This user guide contains descriptions of various features on the Human
          Salivary Proteome Wiki, a service of the National Institute of Dental
          and Craniofacial Research (NIDCR), that stores information on human
          salivary proteins from a large collection of biomedical knowledge
          bases.
        </p>
      </div>
      <Container
        maxWidth="xl"
        sx={{ mt: 4 }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 3,
            color: "black",
          }}
        >
          Current Team
        </Typography>
        <List component="nav">
          {memberInfo.map((institution) => (
            <ListItem
              key={institution.id}
              button
              component="a"
              href={`#${institution.id}`}
              sx={{ color: "#266CB4", padding: 0 }}
            >
              <div style={{ padding: "5px", cursor: "pointer" }}>
                <ListItemText primary={institution.title} />
              </div>
            </ListItem>
          ))}
        </List>
        {memberInfo.map((institution) => (
          <React.Fragment key={institution.id}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Montserrat",
                fontWeight: "bold",
                mt: 5,
                mb: 1,
                color: "black",
              }}
              id={institution.id}
            >
              {institution.title}
            </Typography>
            <div
              style={{
                height: "3px",
                background: "linear-gradient(to right, #1463B9, #ffffff)",
                marginBottom: "30px",
              }}
            ></div>
            {institution.members.map((member, memberIndex) => (
              <div
                key={`${institution.id}-${memberIndex}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
              >
                <img
                  alt={member.imageName}
                  src={member.image}
                  style={{ marginRight: "20px" }}
                />
                <Typography style={{ display: "inline-block" }}>
                  <span
                    dangerouslySetInnerHTML={{ __html: member.description }}
                  ></span>
                </Typography>
              </div>
            ))}
          </React.Fragment>
        ))}
      </Container>
    </>
  );
};

export default UserGuide;
