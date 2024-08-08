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

#GO BP Enrichment plot
egobp <- enrichGO(gene = all_data$rn, OrgDb = org.Hs.eg.db, keyType = 'UNIPROT', ont = "BP", pAdjustMethod = "BH", pvalueCutoff  = pvalue, qvalueCutoff  = qvalue)
write.table(as.data.frame(egobp),"egobp.tsv",sep="\t",row.names = TRUE)
bb <- barplot(egobp,showCategory = 20)
ggplot_alternative <- function(){bb+ theme_bw()}
ggsave("gobp_bar.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
egobpx <- setReadable(egobp, 'org.Hs.eg.db', 'UNIPROT')
p <- cnetplot(egobpx, foldChange=id_fc_sort, circular = TRUE, colorEdge = TRUE)
ggplot_alternative <- function(){p+ theme_bw()}
ggsave("gobp_gene_network.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
write.table(as.data.frame(egobpx),"egobp_gene_net.tsv",sep="\t",row.names = TRUE)
#GO BP GSEA
gsebp <- gseGO(geneList = id_fc_sort, OrgDb = org.Hs.eg.db, keyType = 'UNIPROT', ont = "BP", minGSSize = 10, maxGSSize = 500, pvalueCutoff = pvalue, verbose = FALSE)
write.table(as.data.frame(gsebp),"gsebp.tsv",sep="\t",row.names = TRUE)
ridgebp <- ridgeplot(gsebp,25)
ggplot_alternative <- function(){ridgebp+ theme_bw()}
ggsave("gsebp_ridge.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
heatbp<-heatplot(gsebp,showCategory=25,foldChange=id_fc_sort)
ggplot_alternative <- function(){heatbp+ theme_bw()}
ggsave("gsebp_heat.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
gsebp_pair <- pairwise_termsim(gsebp)
p <- treeplot(gsebp_pair,showCategory = 20)
ggplot_alternative <- function(){p+ theme_bw()}
ggsave("gsebp_tree.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600