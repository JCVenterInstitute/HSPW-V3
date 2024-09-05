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

#GO MF enrichment plot
set.seed(1234)
egomf <- enrichGO(gene = all_data$rn, OrgDb = org.Hs.eg.db, keyType = 'UNIPROT', ont = "CC", pAdjustMethod = "BH", pvalueCutoff  = pvalue, qvalueCutoff  = qvalue)
write.table(as.data.frame(egomf),"egomf.tsv",sep="\t",row.names = TRUE)
bm <- barplot(egomf,showCategory = 20)
ggplot_alternative <- function(){bm+ theme_bw()}
ggsave("egomf_bar.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
set.seed(1234)
egomfx <- setReadable(egomf, 'org.Hs.eg.db', 'UNIPROT')
p <- cnetplot(egomfx, foldChange=id_fc_sort, circular = TRUE, colorEdge = TRUE)
ggplot_alternative <- function(){p+ theme_bw()}
ggsave("gomf_gene_network.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
write.table(as.data.frame(egomfx),"egomf_gene_net.tsv",sep="\t",row.names = TRUE)
#GO MF	GSEA
set.seed(1234)
gsemf <- gseGO(geneList = id_fc_sort, OrgDb = org.Hs.eg.db, keyType = 'UNIPROT', ont = "CC", minGSSize = 10, maxGSSize = 500, pvalueCutoff = pvalue, verbose = FALSE,seed = TRUE)
write.table(as.data.frame(gsemf),"gsemf.tsv",sep="\t",row.names = TRUE)
ridgemf <- ridgeplot(gsemf,25)
ggplot_alternative <- function(){ridgemf+ theme_bw()}
ggsave("gsemf_ridge.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
heatmf<-heatplot(gsemf,showCategory=25,foldChange=id_fc_sort)
ggplot_alternative <- function(){heatmf+ theme_bw()}
ggsave("gsemf_heat.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
gsemf_pair <- pairwise_termsim(gsemf)
p <- treeplot(gsemf_pair,showCategory = 20)
ggplot_alternative <- function(){p+ theme_bw()}
ggsave("gsemf_tree.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)