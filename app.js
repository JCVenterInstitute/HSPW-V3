const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const fs = require('fs');
const path = require('path');

var host = 'https://search-hspw-dev2-dmdd32xae4fmxh7t4g6skv67aa.us-east-2.es.amazonaws.com'

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
}

async function search() {

  // Initialize the client.
  var client = await getClient();

  
  var query = {
    size: 0,
    
        aggs: {
          langs : {
            terms : { "field" : "Cluster ID.keyword",  "size" : 500 }
        }
    }
  };

  var response = await client.search({
    index: 'testing',
    body: query,
  });
  console.log("aggs");
  response.body.aggregations.langs.buckets.map(lang => console.log(JSON.stringify(lang.key)));
}

async function search_cluster() {

  // Initialize the client.
  var client = await getClient();

  
  var query = {
    size: 5000,
    query:{
      match_all : {}
    }
  };

  var response = await client.search({
    index: 'protein_cluster',
    body: query
  });
  console.log(Object.keys(JSON.parse(JSON.stringify(response.body.hits.hits))).length);
}

async function search_cluster_count() {

  // Initialize the client.
  var client = await getClient();

  
  var query = {
    size: 0,
    
        aggs: {
          sum_all : {
            count:{"field" : "# of Members Salivary Protein.keyword"}
        }
    }
  };

  var response = await client.search({
    index: 'protein_cluster',
    body: query,
  });
  console.log("aggs");
  response.body.aggregations.langs.buckets.map(lang => console.log(JSON.stringify(lang.key)));
}

async function index(){
  var client = await getClient();
  var index_name = "study";

  var response = await client.indices.create({
      index: index_name,
  });

  console.log("Creating index:");
  console.log(response.body);
}


async function bulk(){
  let temp = [];
  let temp1 = [];
  let temp2 = "";
  let temp3 = "";
  let json = require('/Users/wchoi/backend/json/cluster_bk.json');


  for (let i = 0; i <json.length;i++){
    temp.push({"index":{"_index":"protein_cluster","_id":json[i]["Cluster ID"]}});
    temp.push(json[i]);
  }

console.log(temp.length);
  let j = 0;
  var client = await getClient();

  const addJson = temp.map(JSON.stringify).join('\n') + '\n';
  client.bulk({ body: addJson }, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    j++;
    console.log(j);
    console.log(data);
  }
});
}

function arrayT(){
  let temp = [];
  let json = require('/Users/wchoi/backend/json/cluster.json');
  for (let i = 0; i <3;i++){
    console.log('diu'+json[i]["# of Members Salivary Protein"]);
    temp = json[i]["# of Members Salivary Protein"].split(',');
    json[i]["# of Members Salivary Protein"] = temp;
    console.log(json[i]["# of Members Salivary Protein"]);
  }
}

async function bulk1(file){
  let temp = [];
  let temp1 = [];
  let temp2 = "";
  let temp3 = "";
  let json = require('/Users/wchoi/backend/json/study2/'+file);
  
  temp.push({"index":{"_index":"study","_id":json["Samples"][0]["experiment_id_key"]}});
  temp.push(json);

  let j = 0;
  var client = await getClient();

  const addJson = temp.map(JSON.stringify).join('\n') + '\n';
  client.bulk({ body: addJson }, (err, data) => {
  if (err) {
    console.log(temp);
    console.error(err);
  } else {
    j++;
    console.log(j);
    console.log(addJson);
  }
});
}

async function bulk2(file){
  let temp = [];
  let temp1 = [];
  let temp2 = "";
  let temp3 = "";
  let json = require('/Users/wchoi/backend/json/peptide2/'+file);


  for (let i = 0; i <json["Study Peptide"].length;i++){
    temp.push({"index":{"_index":"peptide","_id":json["Study Peptide"][i]["experiment_id_key"]+'_'+json["Study Peptide"][i]["Uniprot_accession"]+'_'+json["Study Peptide"][i]["charge"]+'_'+json["Study Peptide"][i]["mz_ratio"]+'_'+json["Study Peptide"][i]["peptide_sequence"]+'_'+json["Study Peptide"][i]["peptide_score"]}});
    temp.push(json["Study Peptide"][i]);
  }

  let j = 0;
  var client = await getClient();

  const addJson = temp.map(JSON.stringify).join('\n') + '\n';
  client.bulk({ body: addJson }, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    j++;
    console.log(j);
  }
});
}


async function count(file){
  let json = require('/Users/wchoi/backend/json/peptide/'+file);
  console.log(typeof(json["Study Peptide"].length));
}

let m = 0;
const directoryPath = path.join(__dirname,'/json/peptide2');
//passsing directoryPath and callback function
let i = [];

fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        console.log(file);
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
      files.forEach(function (file) {
        // Do whatever you want to do with the file
        bulk2(file).catch(console.log);
    });

});



//bulk2().catch(console.log);
//bulk1().catch(console.log);
//index().catch(console.log);

//bulk().catch(console.log);
//arrayT();
//search_cluster_count().catch(console.log);
//search_cluster().catch(console.log);
//search().catch(console.log);