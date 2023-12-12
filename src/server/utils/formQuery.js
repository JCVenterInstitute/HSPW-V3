exports.formQuery = async (
  index,
  query,
  booleanOperator,
  selectedProperties,
  size,
  from
) => {
  console.log("> Forming query...");

  // Function to map each operation to its corresponding OpenSearch clause
  const mapOperationToClause = (item) => {
    // Append '.keyword' to each field name
    const field =
      item.selectedProperty === "number_of_members" ||
      item.selectedProperty === "experiment_id_key" ||
      item.selectedProperty === "Name" ||
      item.selectedProperty === "Gene Name" ||
      item.selectedProperty === "glycans.mass" ||
      item.selectedProperty === "mass" ||
      item.selectedProperty === "protein_sequence_length"
        ? item.selectedProperty
        : item.selectedProperty + ".keyword";
    const value = item.value;

    switch (item.selectedOperation) {
      case "exists":
        return { exists: { field: field } };
      case "is equal to":
        return { term: { [field]: value } };
      case "is unequal to":
        return { bool: { must_not: { term: { [field]: value } } } };
      case "starts with":
        return { prefix: { [field]: value } };
      case "ends with":
        // Note: Ends with operation using a script
        return {
          script: {
            script: {
              source: `doc['${field}'].value.endsWith(params.value)`,
              params: { value: value },
            },
          },
        };
      case "contains":
        return { wildcard: { [field]: `*${value}*` } };
      case "doesn't start with":
        // Note: Using a script query for doesn't start with operation
        return {
          script: {
            script: {
              source: `!doc['${field}'].value.startsWith(params.value)`,
              params: { value: value },
            },
          },
        };
      case "doesn't end with":
        // Note: Using a script query for doesn't end with operation
        return {
          script: {
            script: {
              source: `!doc['${field}'].value.endsWith(params.value)`,
              params: { value: value },
            },
          },
        };
      case "doesn't contain":
        return { bool: { must_not: { wildcard: { [field]: `*${value}*` } } } };
      default:
        throw new Error(`Unsupported operation: ${item.selectedOperation}`);
    }
  };

  // Function to map each operation to its corresponding OpenSearch clause
  const mapOperationToClauseSalivaryProtein = (item) => {
    // Append '.keyword' to each field name
    const field =
      item.selectedProperty === "glycans.mass" ||
      item.selectedProperty === "mass" ||
      item.selectedProperty === "protein_sequence_length"
        ? "salivary_proteins." + item.selectedProperty
        : "salivary_proteins." + item.selectedProperty + ".keyword";
    const value = item.value;

    switch (item.selectedOperation) {
      case "exists":
        return { exists: { field: field } };
      case "is equal to":
        return { term: { [field]: value } };
      case "is unequal to":
        return { bool: { must_not: { term: { [field]: value } } } };
      case "starts with":
        return { prefix: { [field]: value } };
      case "ends with":
        // Note: Ends with operation using a script
        return {
          script: {
            script: {
              source: `doc['${field}'].value.endsWith(params.value)`,
              params: { value: value },
            },
          },
        };
      case "contains":
        return { wildcard: { [field]: `*${value}*` } };
      case "doesn't start with":
        // Note: Using a script query for doesn't start with operation
        return {
          script: {
            script: {
              source: `!doc['${field}'].value.startsWith(params.value)`,
              params: { value: value },
            },
          },
        };
      case "doesn't end with":
        // Note: Using a script query for doesn't end with operation
        return {
          script: {
            script: {
              source: `!doc['${field}'].value.endsWith(params.value)`,
              params: { value: value },
            },
          },
        };
      case "doesn't contain":
        return { bool: { must_not: { wildcard: { [field]: `*${value}*` } } } };
      default:
        throw new Error(`Unsupported operation: ${item.selectedOperation}`);
    }
  };

  // Map each item in the query array to an OpenSearch clause
  let clauses;
  if (index === "salivary-proteins-112023") {
    clauses = query.map(mapOperationToClauseSalivaryProtein);
  } else {
    clauses = query.map(mapOperationToClause);
  }

  let combinedSelectedProperties = [];
  if (index === "genes") {
    combinedSelectedProperties = ["GeneID", ...selectedProperties];
  } else if (index === "protein_cluster") {
    combinedSelectedProperties = ["uniprot_id", ...selectedProperties];
  } else if (index === "protein_signature") {
    combinedSelectedProperties = ["InterPro ID", ...selectedProperties];
  } else if (index === "citation") {
    combinedSelectedProperties = ["CitationID", ...selectedProperties];
  } else if (index === "salivary-proteins-112023") {
    const modifiedSelectedProperties = selectedProperties.map(
      (item) => `salivary_proteins.${item}`
    );
    combinedSelectedProperties = [
      "salivary_proteins.uniprot_accession",
      ...modifiedSelectedProperties,
    ];
  }

  // Form the final query
  const finalQuery = {
    track_total_hits: true,
    size: size,
    from: from,
    _source: combinedSelectedProperties,
    query: {
      bool: {
        [booleanOperator === "OR" ? "should" : "must"]: clauses,
      },
    },
  };

  console.log("> Generated query:", JSON.stringify(finalQuery, null, 2));
  return finalQuery;
};
