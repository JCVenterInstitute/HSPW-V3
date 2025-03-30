import { Helmet } from "react-helmet";
import { Container } from "@mui/material";

import BreadCrumb from "./Breadcrumbs";
import backgroundImage from "../../assets/hero.jpeg";

/** Component for setting the tab title, breadcrumb &  header for all pages */
const PageHeader = ({ tabTitle, breadcrumb, title, description }) => {
  return (
    <>
      <Helmet>
        <title>{tabTitle}</title>
      </Helmet>
      <BreadCrumb path={breadcrumb} />
      <div
        className="head_background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">{title}</h1>
          {description && <p className="head_text">{description}</p>}
        </Container>
      </div>
    </>
  );
};

export default PageHeader;
