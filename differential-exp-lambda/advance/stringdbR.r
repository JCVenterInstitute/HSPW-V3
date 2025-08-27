library("org.Hs.eg.db")
library(STRINGdb)
library(UniProt.ws)
library(tidyr)

all_data <- read.table("all_data.tsv",sep="\t",header=T)

# Strip rn column to only the part before the first space or dash
all_data$rn <- sub("^([^ -]+).*", "\\1", all_data$rn)

colnames(all_data)[1] <- "UNIPROT"
id_chngs<-mapUniProt("UniProtKB_AC-ID", "UniProtKB", query = all_data$UNIPROT, columns = c("gene_primary"))
colnames(id_chngs)[1] <- "UNIPROT"
all_dataE <- merge(all_data, id_chngs[, c("UNIPROT", "Gene.Names..primary.")], by="UNIPROT")		   
string_db <- STRINGdb$new( version="12.0", species=9606, score_threshold=200, network_type="full", input_directory="")
all_mapped <- string_db$map(all_dataE, "UNIPROT", removeUnmappedRows = TRUE)
interactions <- string_db$get_interactions(all_mapped$STRING_id)
interactions$to <- sub("9606\\.", "", interactions$to)
interactions$from <- sub("9606\\.", "", interactions$from)
all_mapped$STRING_id <- sub("9606\\.", "", all_mapped$STRING_id)
colnames(all_mapped)[11] <- "from"
all_mapped_inter <- merge(all_mapped, interactions[, c("from", "to", "combined_score")], by="from")
id_chngse<-mapUniProt("Ensembl_Protein", "UniProtKB", query = all_mapped_inter$from, columns = c("gene_primary","accession"))
colnames(id_chngse)[1] <- "to"
colnames(id_chngse)[2] <- "Genes.interacting"
all_mapped_inter_symbol <- unique(merge(all_mapped_inter, id_chngse[, c("to", "Genes.interacting")], by="to"))
all_mapped_inter_symbol$Gene.Names..primary. <- sub(";.*", "", all_mapped_inter_symbol$Gene.Names..primary.)
all_mapped_inter_symbol$Genes.interacting <- sub(";.*", "", all_mapped_inter_symbol$Genes.interacting)
write.csv(all_mapped_inter_symbol,"string.csv",row.names=F)