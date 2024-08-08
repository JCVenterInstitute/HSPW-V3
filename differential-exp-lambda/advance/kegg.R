library("org.Hs.eg.db")
library(clusterProfiler)
library(enrichplot)
library(ggupset)
library(ggplot2)
all_data <- read.table("all_data.tsv",sep="\t",header=T)
id_fc <- all_data$log2.FC.
names(id_fc) <- all_data$rn
id_fc_sort <- id_fc[order(-id_fc)]

args <- commandArgs(trailingOnly = TRUE)
pvalue=as.numeric(args[1])
qvalue=as.numeric(args[2])

#Converting ids to ENTREZID for analysis
id_chng = bitr(all_data$rn, fromType="UNIPROT", toType="ENTREZID", OrgDb="org.Hs.eg.db")
colnames(id_chng) <- c("rn", "ENTREZID")
new_all <- merge(all_data, id_chng[, c("rn", "ENTREZID")], by="rn")
eid_fc <- new_all$log2.FC.
names(eid_fc) <- new_all$ENTREZID
id_fc_sort <- eid_fc[order(-eid_fc)]
#Converting ids to enrichKEGG for analysis
kk <- enrichKEGG(gene = new_all$ENTREZID, organism = 'hsa', pvalueCutoff = pvalue, qvalueCutoff  = qvalue)
write.table(as.data.frame(kk),"kegg.tsv",sep="\t",row.names = TRUE)
bkk <- barplot(kk)
ggplot_alternative <- function(){bkk+ theme_bw()}
ggsave("kegg_pathway_bar.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
#gsea kegg pathway for analysis
gsekk <- gseKEGG(geneList = id_fc_sort, organism	= 'hsa', minGSSize	= 120, pvalueCutoff = pvalue, verbose	= FALSE)
write.table(as.data.frame(gsekk),"gsekk.tsv",sep="\t",row.names = TRUE)
bk <- ridgeplot(gsekk,25)
ggplot_alternative <- function(){bk+ theme_bw()}
ggsave("kegg_pathway_ridge.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
hc<-heatplot(gsekk,showCategory=25,foldChange=id_fc_sort)
ggplot_alternative <- function(){hc+ theme_bw()}
ggsave("kegg_pathway_heat.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
#Converting ids to enrichMKEGG for analysis
mkk <- enrichMKEGG(gene = new_all$ENTREZID, organism = 'hsa', pvalueCutoff = pvalue, qvalueCutoff  = qvalue)
write.table(as.data.frame(mkk),"kegg.tsv",sep="\t",row.names = TRUE)
bmkk <- barplot(mkk)
ggplot_alternative <- function(){bmkk+ theme_bw()}
ggsave("kegg_module_bar.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
write.table(as.data.frame(mkk),"kegg.tsv",sep="\t",row.names = TRUE)
#gsea kegg pathway for analysis
gsemkk <- gseKEGG(geneList = id_fc_sort, organism	= 'hsa', minGSSize	= 120, pvalueCutoff = pvalue, verbose	= FALSE)
write.table(as.data.frame(gsemkk),"gsemkk.tsv",sep="\t",row.names = TRUE)
bc <- ridgeplot(gsemkk,25)
ggplot_alternative <- function(){bc+ theme_bw()}
ggsave("kegg_module_ridge.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)
hc<-heatplot(gsemkk,showCategory=25,foldChange=id_fc_sort)
ggplot_alternative <- function(){hc+ theme_bw()}
ggsave("kegg_module_heat.jpeg",ggplot_alternative(),width = 11.25,height = 6.25,dpi = 600)