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

const Team = () => {
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
            paddingBottom: "25px",
          }}
        >
          Team
        </h1>
      </div>
      <Container sx={{ mt: 4 }}>
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
          <>
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
            {institution.members.map((member) => (
              <div
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
          </>
        ))}
      </Container>
    </>
  );
};

export default Team;
