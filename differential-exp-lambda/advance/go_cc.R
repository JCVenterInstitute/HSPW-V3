library("org.Hs.eg.db")
library(clusterProfiler)
library(enrichplot)
library(ggupset)
library(ggplot2)
all_data <- read.table("all_data.tsv",sep="\t",header=T)
id_fc <- all_data$Fold.Change
names(id_fc) <- all_data$rn
id_fc_sort <- id_fc[order(-id_fc)]

args <- commandArgs(trailingOnly = TRUE)
pvalue=as.numeric(args[1])
qvalue=as.numeric(args[2])

#GO CC enrichment
egocc <- enrichGO(gene = all_data$rn, OrgDb = org.Hs.eg.db, keyType = 'UNIPROT', ont = "CC", pAdjustMethod = "BH", pvalueCutoff  = pvalue, qvalueCutoff  = qvalue)
write.table(as.data.frame(egocc),"egocc.tsv",sep="\t",row.names = TRUE)
bc <- barplot(egocc,showCategory = 20)
ggplot_alternative <- function(){bc+ theme_bw()}
ggsave("gocc_bar.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
egoccx <- setReadable(egocc, 'org.Hs.eg.db', 'UNIPROT')
p <- cnetplot(egoccx, foldChange=id_fc_sort, circular = TRUE, colorEdge = TRUE)
ggplot_alternative <- function(){p+ theme_bw()}
ggsave("gocc_gene_network.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
write.table(as.data.frame(egoccx),"egocc_gene_net.tsv",sep="\t",row.names = TRUE)
#GO CC gsea
gsecc <- gseGO(geneList = id_fc_sort, OrgDb = org.Hs.eg.db, keyType = 'UNIPROT', ont = "CC", minGSSize = 10, maxGSSize = 500, pvalueCutoff = pvalue, verbose = FALSE)
write.table(as.data.frame(gsecc),"gsecc.tsv",sep="\t",row.names = TRUE)
ridgecc <- ridgeplot(gsecc,25)
ggplot_alternative <- function(){ridgecc+ theme_bw()}
ggsave("gsecc_ridge.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
heatcc<-heatplot(gsecc,showCategory=25,foldChange=id_fc_sort)
ggplot_alternative <- function(){heatcc+ theme_bw()}
ggsave("gsecc_heat.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
gsecc_pair <- pairwise_termsim(gsecc)
p <- treeplot(gsecc_pair,showCategory = 20)
ggplot_alternative <- function(){p+ theme_bw()}
ggsave("gsecc_tree.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)