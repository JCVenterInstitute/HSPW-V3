// File mapping of sections > tab > file to display
export const fileMapping = {
  "Volcano Plot": {
    Visualization: "volcano_0_dpi150.png",
    "Data Matrix": "volcano.csv",
  },
  Heatmap: {
    "Top Samples": "heatmap_1_dpi150.png",
    "All Samples": "heatmap_0_dpi150.png",
  },
  "Statistical Parametric Test": {
    Visualization: "tt_0_dpi150.png",
    "Data Matrix": "statistical_parametric_test.csv",
  },
  "Fold Change Analysis": {
    Visualization: "fc_0_dpi150.png",
    "Data Matrix": "fold_change.csv",
  },
  "Principal Component Analysis": {
    Visualization: "pca_score2d_0_dpi150.png",
    "Data Matrix": "pca_score.csv",
  },
  "Venn-Diagram": {
    Visualization: "venn-dimensions.png",
    "Data Matrix": "venn_out_data.txt",
  },
  Normalization: {
    Visualization: "norm_0_dpi150.png",
    "Data Matrix": "data_normalized.csv",
  },
  "Input Data": "data_original.csv",
  "Result Data": "all_data.tsv",
  "Random Forest": {
    Classification: ["rf_cls_0_dpi150.png", "randomforest_confusion.csv"],
    Feature: ["rf_imp_0_dpi150.png", "randomforests_sigfeatures.csv"],
    Outlier: "rf_outlier_0_dpi150.png",
  },
  "GO Biological Process": {},
  "GO Molecular Function": {},
  "GO Cellular Component": {},
  "KEGG Pathway/Module": {},
};

// Mapping of tabs for each section of results page
export const sectionToTabs = {
  Heatmap: [`Top <-numbOfTopVolcanoSamples-> Samples`, "All Samples"],
  "Random Forest": ["Classification", "Feature", "Outlier"],
  "Volcano Plot": ["Visualization", "Data Matrix"],
  "Statistical Parametric Test": ["Visualization", "Data Matrix"],
  "Fold Change Analysis": ["Visualization", "Data Matrix"],
  "Principal Component Analysis": ["Visualization", "Data Matrix"],
  "Venn-Diagram": ["Visualization", "Data Matrix"],
  Normalization: ["Visualization", "Data Matrix"],
  "GO Biological Process": [
    "CC Enrichment Plot",
    "Enriched terms & connected genes",
    "GSEA Ridge plot",
    "GSEA Heatmap plot",
    "GSEA Tree cluster plot",
  ],
  "GO Molecular Function": [
    "placeholder1",
    "placeholder2",
    "placeholder3",
    "placeholder4",
    "placeholder5",
  ],
  "GO Cellular Component": [
    "placeholder1",
    "placeholder2",
    "placeholder3",
    "placeholder4",
    "placeholder5",
  ],
  "KEGG Pathway/Module": [
    "placeholder1",
    "placeholder2",
    "placeholder3",
    "placeholder4",
    "placeholder5",
  ],
};

// Mapping of each download link to file name in s3
export const downloadMapping = {
  "Volcano Plot": "volcano_0_dpi72.png",
  "Volcano Data": "volcano.csv",
  "Top 25 Samples Heatmap": "heatmap_1_dpi72.png",
  "All Samples Heatmap": "heatmap_0_dpi72.png",
  "Statistical Parametric Test Plot": "tt_0_dpi72.png",
  "Statistical Parametric Test Data": "statistical_parametric_test.csv",
  "Fold Change Analysis Plot": "fc_0_dpi72.png",
  "Fold Change Analysis Data": "fold_change.csv",
  "Principal Component Analysis Plot": "pca_score2d_0_dpi72.png",
  "Principal Component Analysis Data": "pca_score.csv",
  "Venn-Diagram Plot": "venn-dimensions.png",
  "Venn-Diagram Data": "venn_out_data.txt",
  "Normalization Plot": "norm_0_dpi72.png",
  "Normalization Data": "data_normalized.csv",
  "Input Data": "data_original.csv",
  "Random Forest CLS": "rf_cls_0_dpi72.png",
  "Random Forest IMP": "rf_imp_0_dpi72.png",
  "Random Forest Outlier": "rf_outlier_0_dpi72.png",
  "GO Biological Process": "",
  "GO Molecular Function": "",
  "GO Cellular Component": "",
  "KEGG Pathway/Module": "",
  "Result Data": "all_data.tsv",
  "All Data Set": "data_set.zip",
};

export const option = [
  "Volcano Plot",
  "Heatmap",
  "Statistical Parametric Test",
  "Fold Change Analysis",
  "Principal Component Analysis",
  "Venn-Diagram",
  "Normalization",
  "Random Forest",
  "GO Biological Process",
  "GO Molecular Function",
  "GO Cellular Component",
  "KEGG Pathway/Module",
  "Input Data",
  "Result Data",
  "Download",
];
