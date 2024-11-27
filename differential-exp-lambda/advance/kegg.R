library("org.Hs.eg.db")
library(clusterProfiler)
library(enrichplot)
library(ggupset)
library(ggplot2)

args <- commandArgs(trailingOnly = TRUE)
pvalue=as.numeric(args[1])
qvalue=as.numeric(args[2])

all_data <- read.table("all_data.tsv",sep="\t",header=T)
#Converting ids to ENTREZID for analysis
id_chng = bitr(all_data$rn, fromType="UNIPROT", toType="ENTREZID", OrgDb="org.Hs.eg.db")
colnames(id_chng) <- c("rn", "ENTREZID")
new_all <- merge(all_data, id_chng[, c("rn", "ENTREZID")], by="rn")
eid_fc <- new_all$log2.FC.
names(eid_fc) <- new_all$ENTREZID
id_fc_sort <- eid_fc[order(-eid_fc)]
write.table(as.data.frame(new_all),"kegg_id_convert.tsv",sep="\t",row.names = FALSE)
#doing enrichment analysis
set.seed(1234)
kk <- enrichKEGG(gene = new_all$ENTREZID, organism = 'hsa', pvalueCutoff = pvalue, qvalueCutoff = qvalue)
write.table(as.data.frame(kk),"keggpathway.tsv",sep="\t",row.names = TRUE)
bkk <- barplot(kk)
ggplot_alternative <- function(){bkk+ theme_bw()}
ggsave("kegg_pathway_bar.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
set.seed(1234)
kkx <- setReadable(kk, 'org.Hs.eg.db', 'ENTREZID')
p <- cnetplot(kkx, foldChange=id_fc_sort, circular = TRUE, colorEdge = TRUE)
ggplot_alternative <- function(){p+ theme_bw()}
ggsave("keggpathway_gene_network.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
write.table(as.data.frame(kkx),"keggpathway_gene_net.tsv",sep="\t",row.names = TRUE)
#gsea kegg pathway for analysis
set.seed(1234)
gsekk <- gseKEGG(geneList = id_fc_sort, organism = 'hsa', minGSSize = 10, pvalueCutoff = pvalue, verbose = FALSE,seed = TRUE)
write.table(as.data.frame(gsekk),"gsekk.tsv",sep="\t",row.names = TRUE)
bk <- ridgeplot(gsekk,25)
ggplot_alternative <- function(){bk+ theme_bw()}
ggsave("kegg_pathway_ridge.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
set.seed(1234)
hc<-heatplot(gsekk,showCategory=25,foldChange=id_fc_sort)
ggplot_alternative <- function(){hc+ theme_bw()}
ggsave("kegg_pathway_heat.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
gsekk_pair <- pairwise_termsim(gsekk)
p <- treeplot(gsekk_pair,showCategory = 20)
ggplot_alternative <- function(){p+ theme_bw()}
ggsave("gsekk_tree.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)

#Kegg module analysis
set.seed(1234)
mkk <- enrichMKEGG(gene = new_all$ENTREZID, organism = 'hsa', pvalueCutoff = pvalue, qvalueCutoff  = qvalue)
write.table(as.data.frame(mkk),"keggmodule.tsv",sep="\t",row.names = TRUE)
bmkk <- barplot(mkk)
ggplot_alternative <- function(){bmkk+ theme_bw()}
ggsave("kegg_module_bar.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
write.table(as.data.frame(mkk),"kegg.tsv",sep="\t",row.names = TRUE)
set.seed(1234)
mkkx <- setReadable(mkk, 'org.Hs.eg.db', 'ENTREZID')
p <- cnetplot(mkkx, foldChange=id_fc_sort, circular = TRUE, colorEdge = TRUE)
ggplot_alternative <- function(){p+ theme_bw()}
ggsave("keggmodule_gene_network.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
write.table(as.data.frame(kkx),"keggmodule_gene_net.tsv",sep="\t",row.names = TRUE)
#gsea kegg pathway for analysis
set.seed(1234)
gsemkk <- gseKEGG(geneList = id_fc_sort, organism = 'hsa', minGSSize = 120, pvalueCutoff = pvalue, verbose = FALSE,seed = TRUE)
write.table(as.data.frame(gsemkk),"gsemkk.tsv",sep="\t",row.names = TRUE)
bc <- ridgeplot(gsemkk,25)
ggplot_alternative <- function(){bc+ theme_bw()}
ggsave("kegg_module_ridge.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
hc<-heatplot(gsemkk,showCategory=25,foldChange=id_fc_sort)
ggplot_alternative <- function(){hc+ theme_bw()}
ggsave("kegg_module_heat.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
gsemkk_pair <- pairwise_termsim(gsekk)
p <- treeplot(gsemkk_pair,showCategory = 20)
ggplot_alternative <- function(){p+ theme_bw()}
ggsave("gsemkk_tree.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)