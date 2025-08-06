# Converting Proteomic Thermo Raw files to mzTab using Proteome Discoverer

Example files to convert can be found here: [https://www.ebi.ac.uk/pride/archive/projects/PXD033661](https://www.ebi.ac.uk/pride/archive/projects/PXD033661)

- Create new study in Proteome Discoverer

  ![Create new study](./img/proteome-discoverer-conversion/proteomics/1-add-input-file.png)

- Select Input Files Tab and click “Add Files” to add files to be converted

  ![New Analysis](./img/proteome-discoverer-conversion/proteomics/2-new-analysis.png)

- Click “New Analysis”

  ![Analysis](./img/proteome-discoverer-conversion/proteomics/3-analysis.png)

- Drag and drop files you wish to convert to “Files for Analysis” box. You can drag multiple files in. **However, if you would like separate mzTab files for each file, ensure you click “By File”.**

  ![Edit](./img/proteome-discoverer-conversion/proteomics/4-edit.png)

- Click “edit” next to “Consensus Step” heading

  ![Open Common](./img/proteome-discoverer-conversion/proteomics/5-open-common.png)
  ![Open Common](./img/proteome-discoverer-conversion/proteomics/6-open-common.png)

- Click “edit” in “Processing Step” header
  ![Processing](./img/proteome-discoverer-conversion/proteomics/7-processing.png)

- Click `Open Common`, in the `ProcessingWF_Tribrid` folder, select `PWF_Tribrid_Basic_SequestHT_IT__HCD_CID`

  - `PWF_Tribrid_Basic_SequestHT_OT__HCD_CID` is also okay

    ![Open Common](./img/proteome-discoverer-conversion/proteomics/8-open-common.png)

- It is likely you will have to change parameters for two nodes `Spectrum Files` RC and `Sequest HT`. To open parameters, click on the node - the parameters will show up on the left. For the Spectrum Files RC node, you will need to select what Protein Database to use (which will be a `.fasta` file that you will have to upload see tutorial at bottom). Hit the drop down menu next to Protein Database to select which database to use.

  ![Search Setting](./img/proteome-discoverer-conversion/proteomics/9-search-setting.png)

- You must also choose your desired Protein Database for SequestHT. The parameters must also be changed as per the following 2 screenshots. \*If the sample has been treated with an alkylating reagent, remove the carbamidomethylation parameter & replace with none.

  ![Input Data](./img/proteome-discoverer-conversion/proteomics/10-input-data.png)

  ![Input Data](./img/proteome-discoverer-conversion/proteomics/11-input-data.png)

- Now click Run!

  ![Run](./img/proteome-discoverer-conversion/proteomics/12-run.png)

- Once it is finished running, click “Open Results”

  ![Show Results](./img/proteome-discoverer-conversion/proteomics/13-show-results.png)

- In the results file, click `file` then `export` then `To mzTab...`

  ![Export](./img/proteome-discoverer-conversion/proteomics/14-export.png)

# Converting Peptidomic Thermo Raw Files to mzTab Using Proteome Discoverer

- Create new study in Proteome Discoverer
- Select Input Files Tab and click “Add Files” to add files to be converted

  ![Add File](./img/proteome-discoverer-conversion/peptidomics/1-add-file.png)

- Click “New Analysis”

  ![New Analysis](./img/proteome-discoverer-conversion/peptidomics/2-new-analysis.png)

- Drag and drop files you wish to convert to “Files for Analysis” box. You can drag multiple files in. **However, if you would like separate mzTab files for each file, ensure you click “By File”.**

  ![Analysis](./img/proteome-discoverer-conversion/peptidomics/3-analysis.png)

- Click “edit” next to “Consensus Step” heading

  ![Edit](./img/proteome-discoverer-conversion/peptidomics/4-edit.png)

- Click “Open Common”. In the “ConsensusWF” folder, choose "CWF_Basic” to open

  ![Open Common](./img/proteome-discoverer-conversion/peptidomics/5-open-common.png)

  ![Select Files](./img/proteome-discoverer-conversion/peptidomics/6-select-files.png)

- Click “edit” in “Processing Step” header

  ![Edit](./img/proteome-discoverer-conversion/peptidomics/7-edit.png)

- Click “Open Common”, in the `ProcessingWF_Hybrid` folder, select `PWF_Hybrid_MPS_SequestHT_INFERYS_Rescoring_Percolator`

![Select File](./img/proteome-discoverer-conversion/peptidomics/8-select-file.png)

- Delete “Spectrum Files RC” node by right clicking on it and selecting “Cut”. By clicking into the gray space in the workflow tree, a list of possible nodes you can add appears on the left side of the screen. Drag the “Spectrum Files” node into the Workflow Tree. An arrow should automatically appear connecting it to the “Spectrum Selecter” node.

![Cut](./img/proteome-discoverer-conversion/peptidomics/9-cut.png)

![Workflow Tree](./img/proteome-discoverer-conversion/peptidomics/10-workflow-tree.png)

- The parameters for Sequest HT must also be changed as per the following 2 screenshots. You can change these parameters by clicking on the drop down menu beside the desired parameter you want to change. For SequestHT, you will need to provide a Protein Database which you can do via the tutorial at the bottom of this document.

  - If the sample has been treated with an alkylating reagent, remove the carbamidomethylation parameter & replace with none.

  ![Input Data](./img/proteome-discoverer-conversion/peptidomics/11-input-data.png) ![Input Data](./img/proteome-discoverer-conversion/peptidomics/12-input-data.png)

- Now click Run!

  ![Run](./img/proteome-discoverer-conversion/peptidomics/13-run.png)

- Once it is finished running, click “Open Results”

  ![Open Results](./img/proteome-discoverer-conversion/peptidomics/14-open-results.png)

- In the results file, click “file” then “export” then “to mzTab”’

  ![Export](./img/proteome-discoverer-conversion/peptidomics/15-export.png)

# Uploading .fasta File to Proteome Discoverer

- Navigate to the “Maintain FASTA Files” page in the “Administration” tab.

  ![Maintain Fasta](./img/proteome-discoverer-conversion/fasta-upload/1-maintain-fasta.png)

- Click “Add” to add in your desired fasta file. You can also see more information about the fasta files you have already uploaded on this page.

  ![Maintain Fasta](./img/proteome-discoverer-conversion/fasta-upload/2-add.png)
