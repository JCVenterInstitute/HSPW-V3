import React, { Component } from "react";
import axios from "axios";
import xml2js from "xml2js";

class ParseXml extends Component {
  constructor() {
    super();
    this.state = {
      name: "React"
    };
  }

  componentDidMount() {
    var self = this;
    axios
      .get("https://fakerestapi.azurewebsites.net/api/Authors", {
        "Content-Type": "application/xml; charset=utf-8"
      })
      .then(function(response) {
        self.setState({ authors: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    console.log(this.state.authors)
    let parser = new xml2js.Parser();
    parser.parseString(
      `<email>
        <to>Test</to>
        <from>Test1</from>
        <heading>Test email</heading>
        <body>Email regards to xml data parsing in React</body>
       </email>`,
      function(err, result) {
        console.log(result);
      }
    );
    return <div>Parse XML using ReactJs</div>;
  }
}

export default ParseXml;
