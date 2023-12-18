exports.formQuery = async (
  entity,
  query,
  booleanOperator,
  selectedProperties,
  size,
  from,
  paginationKey
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
      item.selectedProperty === "PubMed_ID" ||
      item.selectedProperty === "Date of Publication" ||
      item.selectedProperty === "PubDate"
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
      case "between":
        return {
          range: {
            [field]: {
              gte: value.startDate,
              lte: value.endDate,
              format: "yyyy/MM/dd",
            },
          },
        };
      default:
        throw new Error(`Unsupported operation: ${item.selectedOperation}`);
    }
  };

  // Function to map each operation to its corresponding OpenSearch clause for Salivary Protein
  const mapOperationToClauseSalivaryProtein = (item) => {
    // Append '.keyword' to each field name
    const field =
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

  // Function to map each operation to its corresponding OpenSearch clause for Annotations
  const mapOperationToClauseAnnotations = (item) => {
    // Append '.keyword' to each field name
    const field =
      item.selectedProperty === "uniprot_accession"
        ? "salivary_proteins." + item.selectedProperty + ".keyword"
        : "salivary_proteins.annotations." + item.selectedProperty + ".keyword";
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
  if (entity === "Salivary Proteins") {
    clauses = query.map(mapOperationToClauseSalivaryProtein);
  } else if (entity === "Annotations") {
    clauses = query.map(mapOperationToClauseAnnotations);
  } else {
    clauses = query.map(mapOperationToClause);
  }

  let combinedSelectedProperties = [];
  if (entity === "Salivary Proteins") {
    const modifiedSelectedProperties = selectedProperties.map(
      (item) => `salivary_proteins.${item}`
    );
    combinedSelectedProperties = [...modifiedSelectedProperties];
  } else if (entity === "Annotations") {
    const modifiedSelectedProperties = selectedProperties.map(
      (item) => `salivary_proteins.annotations.${item}`
    );
    combinedSelectedProperties = [...modifiedSelectedProperties];
  } else {
    combinedSelectedProperties = [...selectedProperties];
  }

  // Form the final query
  let finalQuery;
  if (entity === "Annotations" && paginationKey) {
    finalQuery = {
      track_total_hits: true,
      size: size,
      _source: combinedSelectedProperties,
      query: {
        bool: {
          [booleanOperator === "OR" ? "should" : "must"]: clauses,
        },
      },
      search_after: paginationKey,
      sort: [{ _id: "asc" }],
    };
  } else if (entity === "Annotations") {
    finalQuery = {
      track_total_hits: true,
      size: size,
      _source: combinedSelectedProperties,
      query: {
        bool: {
          [booleanOperator === "OR" ? "should" : "must"]: clauses,
        },
      },
      sort: [{ _id: "asc" }],
    };
  } else {
    finalQuery = {
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
  }

  console.log("> Generated query:", JSON.stringify(finalQuery, null, 2));
  return finalQuery;
};
