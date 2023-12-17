import React from "react";
import main_feature from "../assets/hero.jpeg";

const ProteinSetSearch = () => {
  return (
    <>
      <div style={{ height: "40%", backgroundImage: `url(${main_feature})` }}>
        <h1
          style={{
            color: "white",
            textAlign: "center",
            display: "left",
            marginLeft: "20px",
            marginBottom: "1rem",
          }}
          align="left"
        >
          Protein Set Search
        </h1>

        <p
          style={{
            textAlign: "left",
            color: "white",
            fontSize: "25px",
            paddingBottom: "15px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          Use the form below to search for salivary proteins stored in this
          database. Enter on each line one accession number or gene symbol.
          Accepted identifier types include UniProt, International Protein Index
          (IPI), RefSeq, Protein Data Bank (PDB), and Ensembl. To ensure
          accurate results, please use genes symbols (e.g. AMY2B) approved by
          the HUGO Gene Nomenclature Committee.
        </p>
        <br></br>
        <p
          style={{
            textAlign: "left",
            color: "white",
            fontSize: "25px",
            paddingBottom: "15px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          If you have a large set of proteins, please consider making multiple
          searches with no more than 100 proteins at a time. As the query may
          take a few minutes to finish, you can choose to receive the results by
          email.
        </p>
      </div>
      <form
        name="proteinSetSearch"
        id="proteinSetSearch"
        method="post"
        style={{ display: "block", margin: "10px" }}
      >
        <input
          type="hidden"
          name="method"
          value="proteinSetSearch"
        />
        <label>
          Search by{" "}
          <select
            name="acctype"
            id="acctype"
          >
            <option
              value="accession"
              selected="selected"
            >
              Accession number
            </option>
            <option value="gene">Official gene symbol</option>
          </select>
          :
        </label>
        <textarea
          name="numbers"
          id="numbers"
          rows="15"
          style={{ width: "97%", marginTop: "10px" }}
        ></textarea>
        <input
          type="submit"
          value="Submit"
          style={{ margin: "10px" }}
        ></input>
        <input
          type="reset"
          value="Reset"
        ></input>
      </form>
    </>
  );
};

export default ProteinSetSearch;
