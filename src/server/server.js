const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const fs = require('fs');

app.use(cors());
app.use(express.json());

var host = 'https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com';

const getClient = async () => {
    const awsCredentials = await defaultProvider()();
    const connector = createAwsOpensearchConnector({
        credentials: awsCredentials,
        region: process.env.AWS_REGION ?? 'us-east-2',
        getCredentials: function(cb) {
            return cb();
        }
    });
    return new Client({
        ...connector,
        node: host,
    });
};

async function getMapping() {
  var client = await getClient();
  var response = await client.indices.getMapping({
    index: 'protein_cluster'
  });
  return Object.keys(response.body["protein_cluster"]["mappings"]["properties"]);
  console.log(Object.keys(response.body["protein_cluster"]["mappings"]["properties"]));
};

app.get("/a123", (req, res) => {
  let a = getMapping();
  a.then(function(result){
    console.log(result);
    res.json(result);
  });
});

async function search_cluster() {

    // Initialize the client.
    var client = await getClient();
  
    
    var query = {
      size: 10000,
      query:{
        match_all : {}
      }
    };
  
    var response = await client.search({
      index: 'protein_cluster',
      body: query
    });
    console.log(Object.keys(JSON.parse(JSON.stringify(response.body.hits.hits))).length);
    console.log(JSON.stringify(response.body.hits.hits[0]["_source"]["Cluster ID"]));
    return response.body.hits.hits;
  }


app.get("/protein_cluster", (req, res) => {
  let a = search_cluster();
  a.then(function(result){
    console.log(result);
    res.json(result);
  });
  
});

async function search_gene() {

  // Initialize the client.
  var client = await getClient();

  
  var query = {
    size: 10000,
    query:{
      match_all : {}
    }
  };

  var response = await client.search({
    index: 'genes',
    body: query
  });
  return response.body.hits.hits;
}

app.get("/genes", (req, res) => {
let a = search_gene();
a.then(function(result){
  console.log(result);
  res.json(result);
});

});

async function search_geneID(id){
  var client = await getClient();

  
  var query = {
    query:{
      match: {
        _id:{
          query: id
        }
      }
    }
  };

  var response = await client.search({
    index: 'genes',
    body: query
  });
  console.log(Object.keys(JSON.parse(JSON.stringify(response.body.hits.hits))).length);
  return response.body.hits.hits;
}

app.get("/genes/:id",(req,res)=>{
  console.log(req.params.id);
  let a = search_geneID(req.params.id);
  a.then(function(result){
    console.log(result);
    res.json(result);
  });
});


async function search_signature() {

  // Initialize the client.
  var client = await getClient();

  
  var query = {
    size: 10000,
    query:{
      match_all : {}
    }
  };

  var response = await client.search({
    index: 'protein_signature',
    body: query
  });
  console.log(Object.keys(JSON.parse(JSON.stringify(response.body.hits.hits))).length);
  console.log(JSON.stringify(response.body.hits.hits[0]["_source"]["InterPro ID"]));
  return response.body.hits.hits;
}

app.get("/protein_signature", (req, res) => {
let a = search_signature();
a.then(function(result){
  console.log(result);
  res.json(result);
});

});

async function search_signatureID(id){
  var client = await getClient();

  
  var query = {
    query:{
      match: {
        _id:{
          query: id
        }
      }
    }
  };

  var response = await client.search({
    index: 'protein_signature',
    body: query
  });
  console.log(Object.keys(JSON.parse(JSON.stringify(response.body.hits.hits))).length);
  console.log(JSON.stringify(response.body.hits.hits[0]["_source"]["InterPro ID"]));
  return response.body.hits.hits;
}

app.get("/protein_signature/:id",(req,res)=>{
  console.log(req.params.id);
  let a = search_signatureID(req.params.id);
  a.then(function(result){
    console.log(result);
    res.json(result);
  });
});

async function search_withID(index,id){
  var client = await getClient();

  
  var query = {
    query:{
      match: {
        _id:{
          query: id
        }
      }
    }
  };

  var response = await client.search({
    index: index,
    body: query
  });
  return response.body.hits.hits;
}

app.get("/citation/:id",(req,res)=>{
  console.log(req.params.id);
  let a = search_withID('citation',req.params.id);
  a.then(function(result){
    console.log(result);
    res.json(result);
  });
});


async function search_citation_field() {

  // Initialize the client.
  var client = await getClient();

  

  var response = await client.indices.getFieldMapping({
    index: 'citation',
  });
  console.log('123');
  return response.body.hits.hits;
}

app.get("/citation/field", (req, res) => {
  let a = search_citation_field();
  a.then(function(result){
    console.log('321:'+result);
    res.json(result);
  });
  
  });

async function search_citation() {

  // Initialize the client
  var client = await getClient();

  
  var query = {
    size: 10000,
    query:{
      match_all : {}
    }
  };

  var response = await client.search({
    index: 'citation',
    body: query
  });
  return response.body.hits.hits;
}

app.get("/citation", (req, res) => {
let a = search_citation();
a.then(function(result){
  console.log(result);
  res.json(result);
});

});

async function search_protein() {

  // Initialize the client.
  var client = await getClient();

  
  var query = {
    size: 10000,
    query:{
      match_all : {}
    }
  };

  var response = await client.search({
    index: 'testing123',
    body: query
  });
  return response.body.hits.hits;
}

app.get("/protein", (req, res) => {
  let a = search_protein();
  a.then(function(result){
    console.log(result);
    res.json(result);
  });
  
  });

  async function search_proteinID(id){
    var client = await getClient();
  
    
    var query = {
      query:{
        match: {
          _id:{
            query: id
          }
        }
      }
    };
  
    var response = await client.search({
      index: 'protein',
      body: query
    });

    return response.body.hits.hits;
  }
  
  app.get("/protein/:id",(req,res)=>{

    let a = search_proteinID(req.params.id);
    a.then(function(result){
      console.log(result);
      res.json(result);
    });
  });

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});

search_cluster().catch(console.log);
search_gene().catch(console.log);
search_signature().catch(console.log);
search_citation().catch(console.log);
search_geneID('EntrezGene:1').catch(console.log);