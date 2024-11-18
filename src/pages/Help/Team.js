import React from "react";
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Helmet } from "react-helmet";

import PageHero from "../../assets/hero.jpeg";
import memberInfo from "../../components/Help/Team/memberInfo";
import BreadCrumb from "../../components/Layout/Breadcrumbs";

const Team = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Help" },
    { path: "Team" },
  ];

  return (
    <>
      <Helmet>
        <title>HSP | Team</title>
      </Helmet>
      <BreadCrumb path={breadcrumbPath} />
      <div
        className="head_background"
        style={{ backgroundImage: `url(${PageHero})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Team</h1>
        </Container>
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

export default Team;
