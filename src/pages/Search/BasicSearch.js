import React, { Component } from "react";
import Select from "react-select";

import MainFeature from "../../assets/hero.jpeg";

class BasicSearch extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
      data: [0],
      list: [],
      list1: [],
      itemName: "",
      categories: "gene",
      operation: "::+",
      geneOption: [
        { value: "Also known as", label: "Also Known As" },
        { value: "Found in", label: "Found In" },
        { value: "Known officially as", label: "Known Officially As" },
        { value: "Located in", label: "Located In" },
      ],
    };
    var customStyles = {
      control: (provided, state) => ({
        ...provided,
        background: "#fff",
        borderColor: "#9e9e9e",
        minHeight: "23px",
        height: "23px",
        boxShadow: state.isFocused ? null : null,
      }),

      valueContainer: (provided, state) => ({
        ...provided,
        height: "23px",
        padding: "0 6px",
      }),

      input: (provided, state) => ({
        ...provided,
        margin: "0px",
      }),
      indicatorSeparator: (state) => ({
        display: "none",
      }),
      indicatorsContainer: (provided, state) => ({
        ...provided,
        height: "23px",
      }),
    };
  }

  handleChange = (event) => {
    this.setState({ itemName: event.target.value });
  };
  delete = (index) => {
    this.state.list.splice(index, 1);
    this.setState({ list: this.state.list });
    console.log(index);
  };
  add = () => {
    const list = [...this.state.list];
    list.push(this.state.itemName);
    this.setState({ list: list });
    this.setState({ itemName: "" });
  };

  add1 = () => {
    const list = [...this.state.list];
    list.push(this.state.itemName);
    this.setState({ list: list });
    this.setState({ itemName: "" });
  };

  delete1 = (index) => {
    this.state.list.splice(index, 1);
    this.setState({ list1: this.state.list1 });
  };

  render() {
    const renderData = () => {
      return this.state.list.map((item, index) => {
        return (
          <div key={item}>
            <input type="checkbox" /> {item}
            <button onClick={() => this.delete(index)}>Remove</button>
          </div>
        );
      });
    };

    const renderData1 = () => {
      return this.state.list1.map((item, index) => {
        return (
          <div key={item}>
            <input type="checkbox" /> {item}
            <button onClick={() => this.delete(index)}>Remove</button>
          </div>
        );
      });
    };

    return (
      <div>
        <div style={{ height: "40%", backgroundImage: `url(${MainFeature})` }}>
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
            Basic Search
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
            This search interface allows you to build complex queries exploiting
            the semantic annotations stored in this wiki.
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
            <b>Instructions:</b> (1) select the type of entities you wish to
            search; (2) specify the properties and their values to include in
            the query, using the plus (+) sign to add fields; (3) choose the
            properties that you want to display; (4) configure the optional
            parameters; and (5) press Search or Export to display the results
            either in the wiki or in Microsoft Excel.
          </p>
        </div>
        <input
          type="text"
          value={this.state.itemName}
          onChange={this.handleChange}
        />{" "}
        <button onClick={this.add}>Click to add</button>
        <p onClick={this.add}>Add</p>
        {renderData()}
        <input
          type="submit"
          value="+"
          style={{ width: "30px" }}
          onClick={this.add}
        ></input>
        <input
          type="submit"
          value="-"
          style={{ width: "30px" }}
          onClick={this.delete}
        ></input>
        <form onSubmit={this.handleSubmit}>
          <div className="button-section">
            <button
              className="button add"
              type="button"
              onClick={this.add1}
            >
              Add
            </button>
            <button
              className="button submit"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
        <form
          style={{ marginTop: "30px", marginLeft: "20px", fontSize: "18px" }}
        >
          <table
            style={{
              width: "90%",
              borderSpacing: "4px",
              tableLayout: "fixed",
              margin: "10px",
            }}
          >
            <caption style={{ margin: "10px" }}>
              Search For
              <select
                name="displayAll"
                value={this.state.categories}
                onChange={(e) => this.setState({ categories: e.target.value })}
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  minHeight: "23px",
                }}
              >
                <option value="gene">Genes</option>
                <option value="protein_cluster">Protein Clusters</option>
                <option value="protein_signature">Protein Signatures</option>
                <option value="protein">Proteins</option>
                <option value="publication">Publications</option>
                <option value="salivary_protein">Salivary Proteins</option>
                <option value="sequence">Sequences</option>
              </select>
              contatining
              <input
                type="radio"
                value="intersection"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              ></input>
              all of the following
              <input
                type="radio"
                value="union"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              ></input>
              any of the following
            </caption>
            <thead style={{ marginBottom: "20px", marginTop: "20px" }}>
              <tr>
                <th width="5%"></th>
                <th
                  scope="col"
                  width="25%"
                  style={{ textAlign: "left" }}
                >
                  Property
                </th>
                <th
                  scope="col"
                  width="25%"
                  style={{ textAlign: "left" }}
                >
                  Operation
                </th>
                <th
                  scope="col"
                  width="25%"
                  style={{ textAlign: "left" }}
                >
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <div className="searchfield">
                <div className="first-division">
                  <tr
                    style={{
                      marginLeft: "20px",
                      marginTop: "20px",
                      textAlign: "left",
                      width: "64px",
                      whiteSpace: "nowrap",
                    }}
                  />
                  <th
                    scope="row"
                    style={{ width: "64px" }}
                  />
                </div>
                <div className="second-division"></div>
              </div>

              <tr
                style={{
                  marginLeft: "20px",
                  marginTop: "20px",
                  textAlign: "left",
                  width: "64px",
                  whiteSpace: "nowrap",
                }}
              >
                <th
                  scope="row"
                  style={{ width: "64px" }}
                >
                  <input
                    type="submit"
                    value="+"
                    style={{ width: "30px" }}
                  ></input>
                  <input
                    type="submit"
                    value="-"
                    style={{ width: "30px" }}
                  ></input>
                </th>
                <td style={{ width: "100%" }}>
                  {this.state.categories === "gene" ? (
                    <Select
                      options={this.state.geneOption}
                      styles={this.customStyles}
                      defaultValue={this.state.geneOption[0]}
                    />
                  ) : null}
                  {this.state.categories === "protein_cluster" ? (
                    <select
                      name="displayAll"
                      style={{ width: "100%" }}
                    >
                      <option value=""></option>
                      <option value="all">Has member</option>
                      <option value="gene">Represented by</option>
                    </select>
                  ) : null}
                  {this.state.categories === "protein_signature" ? (
                    <select
                      name="displayAll"
                      style={{ width: "100%" }}
                    >
                      <option value=""></option>
                      <option value="all">Cites</option>
                      <option value="gene">Has accession number</option>
                      <option value="protein_cluster">Has function</option>
                      <option value="protein_signature">Has member</option>
                      <option value="protein_signature">
                        Known officially as
                      </option>
                      <option value="protein_signature">Part of</option>
                      <option value="protein_signature">Participates in</option>
                      <option value="protein_signature">Xref</option>
                    </select>
                  ) : null}
                  {this.state.categories === "publication" ? (
                    <select
                      name="displayAll"
                      style={{ width: "100%" }}
                    >
                      <option value=""></option>
                      <option value="all">Authored by</option>
                      <option value="gene">Has MeSH heading</option>
                      <option value="protein_cluster">
                        Has publication date
                      </option>
                      <option value="protein_signature">Has title</option>
                      <option value="protein_signature">Located in</option>
                      <option value="protein_signature">Published in</option>
                    </select>
                  ) : null}
                  {this.state.categories === "sequence" ? (
                    <select
                      name="displayAll"
                      style={{ width: "100%" }}
                    >
                      <option value=""></option>
                      <option value="all">Has accession number</option>
                      <option value="gene">Has hit count</option>
                      <option value="protein_cluster">
                        Has molecular mass
                      </option>
                      <option value="protein_signature">
                        Has sequence coverage
                      </option>
                      <option value="protein_signature">
                        Has sequence length
                      </option>
                      <option value="protein_signature">Is a precursor</option>
                      <option value="protein_signature">
                        Known officially as
                      </option>
                      <option value="protein_signature">Variant of</option>
                    </select>
                  ) : null}
                </td>
                <td
                  name="displayOp"
                  value={this.stateoperation}
                >
                  <select
                    name="displayOp"
                    style={{ width: "100%", minHeight: "23px" }}
                  >
                    <option value="::+">exists</option>
                    <option value="::">is equal to</option>
                    <option value="::!">is unequal to</option>
                    <option value="_startswith">starts with</option>
                    <option value="_endswith">ends with</option>
                    <option value="_contains">contains</option>
                    <option value="::~">follows pattern</option>
                    <option value="_notstartswith">doesn't start with</option>
                    <option value="_notendswith">doesn't end with</option>
                    <option value="_notcontains">doesn't contain</option>
                    <option value="::!~">doesn't follow pattern</option>
                  </select>
                </td>

                {this.state.operation === "::+" ? (
                  <td class="value no-val">(No need to specify value)</td>
                ) : (
                  <td class="value editable">
                    <input
                      id="2[0]"
                      name="2[0]"
                      placeholder="Text"
                    />
                  </td>
                )}
              </tr>
            </tbody>
          </table>

          <table style={{ width: "90%", marginLeft: "5px" }}>
            <tbody>
              <tr style={{ display: "table-row" }}>
                <td style={{ display: "table-cell" }}>
                  <label>
                    Show up to{" "}
                    <input
                      name="limit"
                      type="text"
                      value="20"
                      size="4"
                      style={{ marginRight: "5px" }}
                    />
                  </label>
                  items,
                  <label>
                    starting at{" "}
                    <input
                      name="offset"
                      type="text"
                      value="0"
                      size="4"
                    />
                  </label>
                </td>
                <td style={{ textAlign: "right", display: "table-cell" }}>
                  <label>
                    Sort by{" "}
                    <select name="sort">
                      <option value=""></option>
                      <option value="Annotates">Annotates</option>
                      <option value="Annotation long value">
                        Annotation long value
                      </option>
                      <option value="Annotation scope">Annotation scope</option>
                      <option value="Annotation scope revision">
                        Annotation scope revision
                      </option>
                      <option value="Annotation source">
                        Annotation source
                      </option>
                      <option value="Annotation type">Annotation type</option>
                      <option value="Annotation value">Annotation value</option>
                      <option value="Comment">Comment</option>
                      <option value="Ends at">Ends at</option>
                      <option value="Evidence code">Evidence code</option>
                      <option value="Evidence reference">
                        Evidence reference
                      </option>
                      <option value="Starts at">Starts at</option>
                    </select>
                  </label>{" "}
                  In order:{" "}
                  <label>
                    <select name="order">
                      <option value=""></option>
                      <option value="ascending">Ascending</option>
                      <option value="descending">Descending</option>
                    </select>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
          <input
            type="submit"
            value="Submit Query"
            style={{ margin: "10px" }}
          ></input>
          <input
            type="reset"
            value="Reset"
          ></input>
        </form>
      </div>
    );
  }
}

export default BasicSearch;

/*
const BasicSearch = () => {
    const [categories,setCategories] = useState("gene");
    const [operation,setOperation] = useState("::+");

    this.state = { 
      formValues: [{ name: "", email : "" }]
    };

    function handleChange(i, e) {
      let formValues = this.state.formValues;
      formValues[i][e.target.name] = e.target.value;
      this.setState({ formValues });
    }
  
    function addFormFields() {
      this.setState(({
        formValues: [...this.state.formValues, { name: "", email: "" }]
      }))
    }
  
    function removeFormFields(i) {
      let formValues = this.state.formValues;
      formValues.splice(i, 1);
      this.setState({ formValues });
    }

    const option = [
        {value:"gene",label:"Genes"},
        {value:"protein_cluster",label:"Protein Clusters"},
        {value:"protein_signature",label:"Protein Signatures"},
        {value:"protein",label:"Proteins"},
        {value:"publication",label:"Publications"},
        {value:"salivary_protein",label:"Salivary Proteins"},
        {value:"sequence",label:"Sequences"}
    ]
    const geneOption = [
        {value:"Also known as", label:"Also Known As"},
        {value:"Found in", label :"Found In"},
        {value:"Known officially as",label:"Known Officially As"},
        {value:"Located in", label:"Located In"}
    ]

    const [searchField,setSearchField] = useState([{service:""}]);

    const handleServiceChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...searchField];
      list[index][name] = value;
      setSearchField(list);
    };

    const handleServiceRemove = (index) => {
      const list = [...searchField];
      list.splice(index, 1);
      setSearchField(list);
    };

    const handleServiceAdd = () => {
      setSearchField([...searchField, { service: "" }]);
    };
  

    
  
    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          background: '#fff',
          borderColor: '#9e9e9e',
          minHeight: '23px',
          height: '23px',
          boxShadow: state.isFocused ? null : null,
        }),
    
        valueContainer: (provided, state) => ({
          ...provided,
          height: '23px',
          padding: '0 6px'
        }),
    
        input: (provided, state) => ({
          ...provided,
          margin: '0px',
        }),
        indicatorSeparator: state => ({
          display: 'none',
        }),
        indicatorsContainer: (provided, state) => ({
          ...provided,
          height: '23px',
        }),
      };

  return (
    <>

    <div style={{height: '40%',backgroundImage: `url(${main_feature})`}}>
      <h1 style={{color:'white',textAlign:'center',display:'left',marginLeft:'20px',marginBottom:'1rem'}} align="left">Basic Search</h1>
      <p style={{textAlign:'left', color:'white',fontSize:'25px', paddingBottom:'15px', marginLeft:'20px',marginRight:'20px'}}>
      This search interface allows you to build complex queries exploiting the semantic annotations stored in this wiki.
      </p>
      <br></br>
      <p style={{textAlign:'left', color:'white',fontSize:'25px', paddingBottom:'15px', marginLeft:'20px',marginRight:'20px'}}>
        <b>Instructions:</b> (1) select the type of entities you wish to search; (2) specify the properties and their values to include in the query, using the plus (+) sign to add fields; (3) choose the properties that you want to display; (4) configure the optional parameters; and (5) press Search or Export to display the results either in the wiki or in Microsoft Excel.
      </p>
    </div>
    <form  onSubmit={this.handleSubmit}>
          {this.state.formValues.map((element, index) => (
            <div className="form-inline" key={index}>
              <label>Name</label>
              <input type="text" name="name" value={element.name || ""} onChange={e => this.handleChange(index, e)} />
              <label>Email</label>
              <input type="text" name="email" value={element.email || ""} onChange={e => this.handleChange(index, e)} />
              {
                index ? 
                  <button type="button"  className="button remove" onClick={() => this.removeFormFields(index)}>Remove</button> 
                : null
              }
            </div>
          ))}
          <div className="button-section">
              <button className="button add" type="button" onClick={() => this.addFormFields()}>Add</button>
              <button className="button submit" type="submit">Submit</button>
          </div>
      </form>
    <form style={{marginTop:'30px',marginLeft:'20px', fontSize:'18px'}}>
        <table style={{width:'90%', borderSpacing:'4px',tableLayout:'fixed',margin:'10px'}}>
            <caption style={{margin:'10px'}}>
                Search For  
                <select name="displayAll" value={categories} onChange = {e=>setCategories(e.target.value)} style={{marginLeft:'5px',marginRight:'5px',
          minHeight: '23px'}}>
                    <option value="gene">Genes</option>
                    <option value="protein_cluster">Protein Clusters</option>
                    <option value="protein_signature">Protein Signatures</option>
                    <option value="protein">Proteins</option>
                    <option value="publication">Publications</option>
                    <option value="salivary_protein">Salivary Proteins</option>
                    <option value="sequence">Sequences</option>
                </select>
                contatining
                <input type="radio" value="intersection" style={{marginLeft:'5px', marginRight:'5px'}}>   
                </input>
                all of the following
                <input type="radio" value="union" style={{marginLeft:'5px', marginRight:'5px'}}>   
                </input>
                any of the following
            </caption>
            <thead style={{marginBottom:'20px',marginTop:'20px'}}>
  

              <tr >
                  <th width='5%'></th>
                  <th scope="col" width='25%' style={{textAlign:'left'}}>Property</th>
                  <th scope="col" width='25%' style={{textAlign:'left'}}>Operation</th>
                  <th scope="col" width='25%' style={{textAlign:'left'}}>Value</th>
              </tr>
              </thead>
              <tbody>
              {searchField.map((singleSearch, index) => (
          <div key={index} className="searchfield">
            <div className="first-division">
            <tr style={{marginLeft:'20px',marginTop:'20px',textAlign:'left',width:'64px',whiteSpace:'nowrap'}} /> 
            <th scope="row" style={{width:'64px'}} />
              {searchField.length - 1 === index && searchField.length < 4 && (
                <button
                  type="button"
                  onClick={handleServiceAdd}
                  className="add-btn"
                  style={{width:'30px'}}
                >
                  +
                </button>
              )}
            </div>
            <div className="second-division">
              {searchField.length !== 1 && (
                <button
                  type="button"
                  onClick={() => handleServiceRemove(index)}
                  className="remove-btn"
                  style={{width:'30px'}}
                >
                  -
                </button>
              )}
            </div>

          </div>
        ))}
              <tr style={{marginLeft:'20px',marginTop:'20px',textAlign:'left',width:'64px',whiteSpace:'nowrap'}}>
                  <th scope="row" style={{width:'64px'}}>
                    <input type="submit" value="+" style={{width:'30px'}}></input>
                    <input type="submit" value="-" style={{width:'30px'}}></input>
                  </th>
                  <td style={{width:'100%'}}>
                    {categories === "gene" ?
                    <Select options={geneOption} styles={customStyles} defaultValue={geneOption[0]}/>
                    : null
                    }
                    {categories === "protein_cluster" ?
                    <select name="displayAll" style={{width:'100%'}}>
                        <option value=""></option>
                        <option value="all">Has member</option>
                        <option value="gene">Represented by</option>
                    </select>
                    : null
                    }
                    {categories === "protein_signature" ?
                    <select name="displayAll" style={{width:'100%'}}>
                        <option value=""></option>
                        <option value="all">Cites</option>
                        <option value="gene">Has accession number</option>
                        <option value="protein_cluster">Has function</option>
                        <option value="protein_signature">Has member</option>
                        <option value="protein_signature">Known officially as</option>
                        <option value="protein_signature">Part of</option>
                        <option value="protein_signature">Participates in</option>
                        <option value="protein_signature">Xref</option>
                    </select>
                    : null
                    }
                    {categories === "publication" ?
                    <select name="displayAll" style={{width:'100%'}}>
                        <option value=""></option>
                        <option value="all">Authored by</option>
                        <option value="gene">Has MeSH heading</option>
                        <option value="protein_cluster">Has publication date</option>
                        <option value="protein_signature">Has title</option>
                        <option value="protein_signature">Located in</option>
                        <option value="protein_signature">Published in</option>
                    </select>
                    : null
                    }
                    {categories === "sequence" ?
                    <select name="displayAll" style={{width:'100%'}}>
                        <option value=""></option>
                        <option value="all">Has accession number</option>
                        <option value="gene">Has hit count</option>
                        <option value="protein_cluster">Has molecular mass</option>
                        <option value="protein_signature">Has sequence coverage</option>
                        <option value="protein_signature">Has sequence length</option>
                        <option value="protein_signature">Is a precursor</option>
                        <option value="protein_signature">Known officially as</option>
                        <option value="protein_signature">Variant of</option>
                    </select>
                    : null
                    }
                  </td>
                  <td name="displayOp" value={operation} onChange = {e=>setOperation(e.target.value)}>
                  <select name="displayOp" style={{width:'100%',
          minHeight: '23px'}}>
                        <option value="::+">exists</option>
                        <option value="::">is equal to</option>
                        <option value="::!">is unequal to</option>
                        <option value="_startswith">starts with</option>
                        <option value="_endswith">ends with</option>
                        <option value="_contains">contains</option>
                        <option value="::~">follows pattern</option>
                        <option value="_notstartswith">doesn't start with</option>
                        <option value="_notendswith">doesn't end with</option>
                        <option value="_notcontains">doesn't contain</option>
                        <option value="::!~">doesn't follow pattern</option>
                    </select>
                  </td>
                  
                    {operation === "::+" ?
                    <td class="value no-val">(No need to specify value)</td>
                    : <td class="value editable"><input id="2[0]" name="2[0]" placeholder="Text" /></td>
                    }

              </tr>
              </tbody>

        </table>
        
       <table style={{width:'90%',marginLeft:'5px'}}>
        <tbody>
            <tr style={{display: 'table-row'}}>
                <td style={{display:'table-cell'}}>
                    <label>Show up to <input name="limit" type="text" value="20" size="4" style={{marginRight:'5px'}}/></label>
                      items, 
                    <label>starting at <input name="offset" type="text" value="0" size="4" /></label>
                </td>
                <td style={{textAlign:'right',display:'table-cell'}}>
                    <label>Sort by <select name="sort"><option value=""></option><option value="Annotates">Annotates</option><option value="Annotation long value">Annotation long value</option><option value="Annotation scope">Annotation scope</option><option value="Annotation scope revision">Annotation scope revision</option><option value="Annotation source">Annotation source</option><option value="Annotation type">Annotation type</option><option value="Annotation value">Annotation value</option><option value="Comment">Comment</option><option value="Ends at">Ends at</option><option value="Evidence code">Evidence code</option><option value="Evidence reference">Evidence reference</option><option value="Starts at">Starts at</option></select></label> In order: <label><select name="order"><option value=""></option><option value="ascending">Ascending</option><option value="descending">Descending</option></select></label>
                </td>
            </tr>
        </tbody>
       </table>
       <input type="submit" value="Submit Query" style={{margin:'10px'}}></input>
       <input type="reset" value="Reset"></input>
        </form>

    </>
  );
};

export default BasicSearch;
*/
