from pyteomics import mztab

def parse_mztab(file_path):
    # Load mzTab file into an MzTab object
    mz_tab = mztab.MzTab(file_path)
    
    # Access the protein table (already a DataFrame)
    protein_df = mz_tab.protein_table
    
    # Access the peptide table (if available and already a DataFrame)
    peptide_df = mz_tab.peptide_table if hasattr(mz_tab, 'peptide_table') else None

    return protein_df, peptide_df

# Example usage
protein_df, peptide_df = parse_mztab('SILAC_CQI.mzTab')

# Save the protein table to CSV
protein_df.to_csv('protein_table.csv', index=False)

# If peptide table exists, save it to CSV
if peptide_df is not None:
    peptide_df.to_csv('peptide_table.csv', index=False)

# Display the tables
print("Protein Table:")
print(protein_df.head())

if peptide_df is not None:
    print("\nPeptide Table:")
    print(peptide_df.head())
