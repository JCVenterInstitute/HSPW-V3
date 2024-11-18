const EnrichmentDescriptions = {
  "Enrichment Plot":
    "Over-Representation Analysis (ORA) is a standard method to check if specific biological functions or processes are found more frequently in a list of genes from experiments, such as those differentially expressed (DEGs). By default, the background includes all genes that have annotations and, in the case of humans, the entire human proteome. It is important to adjust p-values carefully for multiple comparisons to ensure accurate results. The enrichGO() and enrichKEGG() functions were implemented in the clusterProfiler package and are used for the gene ontology and KEGG pathway over-representation test.",
  "Enriched terms & connected genes":
    "To understand that genes can belong to multiple categories, we used the cnetplot() function from the clusterProfiler package. This function helps us see the connections between genes and biological concepts, such as Gene Ontology (GO) terms or KEGG pathways, in a network format.",
};

const GSEADescriptions = {
  "Ridge plot":
    "The ridge plot shows how core-enriched proteins are expressed in GSEA-enriched categories. It helps users quickly see which pathways are upregulated and which are downregulated.",
  "Heatmap plot":
    "The heatplot works like a cnetplot but shows relationships as a heatmap. A gene-concept network can become complicated when users want to display many significant terms. The heatplot makes the results more apparent and helps users quickly identify expression patterns.",
  "Tree cluster plot":
    "The `treeplot()` function helps group related terms through hierarchical clustering. It uses pairwise similarities calculated by the `pairwise_termsim()` function, which applies Jaccard’s similarity index (JC) and the Ward.D method. The `treeplot()` function divides the tree into five smaller subtrees and labels these using common words. This method simplifies the results and makes it easier for users to understand the information.",
};

const GoDescriptions = {
  "Enrichment Plot": EnrichmentDescriptions["Enrichment Plot"],
  "Enriched terms & connected genes":
    EnrichmentDescriptions["Enriched terms & connected genes"],
  "GSEA Ridge plot": GSEADescriptions["Ridge plot"],
  "GSEA Heatmap plot": GSEADescriptions["Heatmap plot"],
  "GSEA Tree cluster plot": GSEADescriptions["Tree cluster plot"],
};

const KeggDescriptions = {
  "Enrichment Plot": EnrichmentDescriptions["Enrichment Plot"],
  "Enriched terms & connected genes":
    EnrichmentDescriptions["Enriched terms & connected genes"],
  "GSEA Ridge plot": GSEADescriptions["Ridge plot"],
  "GSEA Heatmap plot": GSEADescriptions["Heatmap plot"],
};

const description = {
  "Volcano Plot":
    "Volcano plot combines results from Fold Change (FC) Analysis and T-tests into one single graph, which allows users to intuitively select significant proteins based on either biological significance, statistical significance, or both. Please refer to the Fold Change and T-test web pages for details of the underlying calculations. The figure shows the important proteins identified by the volcano plot. The data matrix shows the details of these proteins.",
  Heatmap:
    "A heatmap provides an intuitive visualization of a data table. Each colored cell on the map corresponds to a concentration value in your data table, with samples in rows and proteins in columns. You can use a heatmap to identify samples/proteins that are unusually high/low. The maximum number of proteins that can be displayed is 2000 proteins (selected based on IQR by default). Two heatmaps are generated: A) using all of the proteins and B) Top numberOfDifferentiallyAbundantProteinsInHeatmap proteins identified using the T-Test.",
  "Statistical Parametric Test":
    "The module allows users to perform either Two-sample t-tests or Wilcoxon rank-sum tests. For large data sets (> 1000 variables), both the paired information and the group variance will be ignored, and the default parameters will be used for t-tests to save computational time. If you choose non-parametric tests (Wilcoxon rank-sum test), the group variance will be ignored.",
  "Fold Change Analysis":
    "The goal of fold change analysis is to compare the absolute values of change between two group means. Since column-wise normalization (i.e., log transformation and various scaling) will significantly change absolute values, FC calculation using data before the column-wise normalization was applied (i.e., at the original scale). The significant proteins are those proteins whose FCs are beyond the given FC threshold (either up or down). For unpaired analysis, FCs are calculated as the ratios between two group means (M1/M2). For paired analysis, FCs are calculated by computing the ratio between paired samples (i.e., one FC per pair) and then computing their means (i.e., pair means). ",
  "Principal Component Analysis":
    "PCA is an unsupervised method aiming to find the directions that best explain the variance in a data set (X) without referring to class labels (Y). The data are summarized into much fewer variables called scores, which are weighted averages of the original variables. The weighting profiles are called loadings. The PCA analysis is performed using the prcomp package. The calculation is based on singular value decomposition.",
  "Venn-Diagram":
    "The Venn-Diagram page displays the protein unique as well as common between the two groups. The user can download the list of unique and common proteins as a text file.",
  Normalization:
    "The data is stored as a table with one sample per row and one protein per column. The normalization consists of the following options:<br/>1. Row-wise procedures: Normalization by the sum<br/>2. Data transformation: Log transformation (base 10)<br/>3. Data scaling: Autoscaling (mean-centered and divided by standard deviation of each variable)<br/>The normalization page figure shows the effects before and after normalization.",
  "Result Data":
    "The result data page displays the merged output of the Statistical Parametric Test, Fold Change Analysis, and Volcano Plot into a single table file for a better understanding of the underlying results.",
  "Random Forest Class":
    "The classification analysis using the random forest method indicated the presence of classification errors when employing up to 500 trees. The ultimate classification confusion matrix was derived from the utilization of 500 trees.",
  "Random Forest Sig":
    "Feature selection is based on the mean decrease in accuracy. The figure displays the top 15 proteins with the highest mean decrease in accuracy, along with a heatmap showing their abundance in both groups. Additionally, a table presents the mean decrease in accuracy for all proteins in a sorted format.",
  "Random Forest Outlier":
    "Outliers are depicted in the plot based on the outlying measures derived from the Random Forest classification model.",
  "Random Forest": {
    Classification:
      "The classification analysis using the random forest method indicated the presence of classification errors when employing up to 500 trees. The ultimate classification confusion matrix was derived from the utilization of 500 trees.",
    Feature:
      "Feature selection is based on the mean decrease in accuracy. The figure displays the top 15 proteins with the highest mean decrease in accuracy, along with a heatmap showing their abundance in both groups. Additionally, a table presents the mean decrease in accuracy for all proteins in a sorted format.",
    Outlier:
      "Outliers are depicted in the plot based on the outlying measures derived from the Random Forest classification model.",
  },
  "GO Biological Process": GoDescriptions,
  "GO Molecular Function": GoDescriptions,
  "GO Cellular Component": GoDescriptions,
  "KEGG Pathway": KeggDescriptions,
  "KEGG Module": KeggDescriptions,
};

export default description;
