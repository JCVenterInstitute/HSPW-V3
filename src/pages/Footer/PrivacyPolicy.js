import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import MainFeature from "../../assets/hero.jpeg";

const sections = [
  "User Accounts and Authorship",
  "General Expectations",
  "Links to Other Sites",
  "Personally Provided Information",
];

const PrivacyNoticePage = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${MainFeature})`,
        }}
        className="head_background"
      >
        <h1
          className="head_title"
          align="left"
        >
          Privacy Policy
        </h1>
      </div>
      <Container sx={{ my: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 3,
            color: "black",
          }}
        >
          Contents
        </Typography>
        <List>
          {sections.map((section) => (
            <ListItem
              key={section}
              component="a"
              href={`#${section}`}
              sx={{ color: "#266CB4", padding: 0 }}
            >
              <div style={{ padding: "5px", cursor: "pointer" }}>
                <ListItemText primary={section} />
              </div>
            </ListItem>
          ))}
        </List>
        <Typography
          id="User Accounts and Authorship"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          User Accounts and Authorship
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <Typography sx={{ fontFamily: "Lato" }}>
          Registration is not required to view the content on this Web site.
          However, only logged-in users have the ability to edit pages. User
          accounts are set up using the credentials provided by the users'
          affiliated institute. User pages may contain the user's contact
          information, including telephone number, email address, and physical
          address. Except insofar as it may be required by law, no person should
          disclose, or knowingly expose, either user passwords and/or cookies
          generated to identify a user.
        </Typography>
        <Typography
          id="General Expectations"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          General Expectations
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <Typography sx={{ fontFamily: "Lato" }}>
          <Typography sx={{ marginY: "20px", fontFamily: "Lato" }}>
            <h3 style={{ marginBottom: "15px" }}>
              IP and Other Technical Information
            </h3>
            When a visitor requests or reads a page, or sends email to us, no
            more information is collected than is typically collected by web
            sites. We may keep raw logs of such transactions. Sampled raw log
            data may include the IP address of any user, but it is not
            reproduced publicly.
          </Typography>
          <Typography sx={{ marginY: "20px", fontFamily: "Lato" }}>
            <h3 style={{ marginBottom: "15px" }}>Cookies</h3>A "cookie" is a
            small file that a Web site transfers to your computer's hard disk
            allowing our server to "remember" specific information about your
            session. We use cookies only for internal tracking and for providing
            a better user experience. The cookie and the information about your
            session is only valid for a short period and will be destroyed
            automatically -it is not permanently stored on your computer.
          </Typography>
          <Typography sx={{ marginY: "20px", fontFamily: "Lato" }}>
            <h3 style={{ marginBottom: "15px" }}>User Contribution</h3>
            Edits to pages are identified with the username of the editor, and
            editing history is aggregated by author in a contribution list. Such
            information will be available permanently. Data on user
            contributions, such as the times at which users edited and the
            number of edits they have made, are publicly available via user
            contributions lists, and in aggregated forms published by other
            users.
          </Typography>
          <Typography sx={{ marginY: "20px", fontFamily: "Lato" }}>
            <h3 style={{ marginBottom: "15px" }}>Page History</h3>
            Edits or other contributions to the wiki on its articles, user pages
            and talk pages are generally retained forever. Removing text from a
            project does not permanently delete it. Normally, anyone can look at
            a previous version of an article and see what was there. Even if an
            article is "deleted", a user entrusted with higher level of access
            may still see what was removed from public view. Information can be
            permanently deleted by individuals with access to our servers, but
            aside from the rare circumstance when HSPW is required to delete
            editing-history material in response to a court order or equivalent
            legal process, there is no guarantee any permanent deletion will
            happen.
          </Typography>
        </Typography>
        <Typography
          id="Links to Other Sites"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Links to Other Sites
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <Typography sx={{ fontFamily: "Lato" }}>
          The wiki provides links to other Internet sites that may consist of
          additional information. Once you link to another site, you are subject
          to the privacy policy of the new site.
        </Typography>
        <Typography
          id="Personally Provided Information"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Personally Provided Information
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <Typography sx={{ fontFamily: "Lato" }}>
          If you choose to provide us with personal information by sending an
          email, or by filling out a form with your personal information and
          submitting it through our Web site, we use that information to respond
          to your message and to help us provide you with information or
          material that you request. If provided, personally identifiable
          information is maintained for as long as needed to respond to your
          question or to fulfill the stated purpose of the communication; your
          personal information is safeguarded in accordance with the Privacy Act
          of 1974, as amended (5 U.S.C. Section 552a).
        </Typography>
      </Container>
    </>
  );
};

export default PrivacyNoticePage;
