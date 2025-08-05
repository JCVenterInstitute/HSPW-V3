# Converting Proteomic Thermo Raw files to mzTab using Proteome Discoverer

Example files to convert can be found here: [https://www.ebi.ac.uk/pride/archive/projects/PXD033661](https://www.ebi.ac.uk/pride/archive/projects/PXD033661)

- Create new study in Proteome Discoverer

  ![Create new study](./img/proteome-discoverer-conversion/1-add-input-file.png)

- Select Input Files Tab and click “Add Files” to add files to be converted

  ![New Analysis](./img/proteome-discoverer-conversion/2-new-analysis.png)

- Click “New Analysis”

  ![Analysis](./img/proteome-discoverer-conversion/3-analysis.png)

- Drag and drop files you wish to convert to “Files for Analysis” box. You can drag multiple files in. **However, if you would like separate mzTab files for each file, ensure you click “By File”.**

  ![Edit](./img/proteome-discoverer-conversion/4-edit.png)

- Click “edit” next to “Consensus Step” heading

  ![Open Common](./img/proteome-discoverer-conversion/5-open-common.png)
  ![Open Common](./img/proteome-discoverer-conversion/6-open-common.png)

- Click “edit” in “Processing Step” header
  ![Processing](./img/proteome-discoverer-conversion/7-processing.png)

- Click `Open Common`, in the `ProcessingWF_Tribrid` folder, select `PWF_Tribrid_Basic_SequestHT_IT__HCD_CID`

  - `PWF_Tribrid_Basic_SequestHT_OT__HCD_CID` is also okay

    ![Open Common](./img/proteome-discoverer-conversion/8-open-common.png)

- It is likely you will have to change parameters for two nodes `Spectrum Files` RC and `Sequest HT`. To open parameters, click on the node - the parameters will show up on the left. For the Spectrum Files RC node, you will need to select what Protein Database to use (which will be a `.fasta` file that you will have to upload see tutorial at bottom). Hit the drop down menu next to Protein Database to select which database to use.

  ![Search Setting](./img/proteome-discoverer-conversion/9-search-setting.png)

- You must also choose your desired Protein Database for SequestHT. The parameters must also be changed as per the following 2 screenshots. \*If the sample has been treated with an alkylating reagent, remove the carbamidomethylation parameter & replace with none.

  ![Input Data](./img/proteome-discoverer-conversion/10-input-data.png)

  ![Input Data](./img/proteome-discoverer-conversion/11-input-data.png)

- Now click Run!

  ![Run](./img/proteome-discoverer-conversion/12-run.png)

- Once it is finished running, click “Open Results”

  ![Show Results](./img/proteome-discoverer-conversion/13-show-results.png)

- In the results file, click `file` then `export` then `To mzTab...`

  ![Export](./img/proteome-discoverer-conversion/14-export.png)

# Converting Peptidomic Thermo Raw Files to mzTab Using Proteome Discoverer
