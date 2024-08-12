library(VennDiagram)
library(plyr)
library(dplyr)
source("../../function/home/resources/rscripts/metaboanalystr/general_data_utils.R")
source("../../function/home/resources/rscripts/metaboanalystr/general_norm_utils.R")
source("../../function/home/resources/rscripts/metaboanalystr/general_proc_utils.R")
source("../../function/home/resources/rscripts/metaboanalystr/stats_chemometrics.R")
source("../../function/home/resources/rscripts/metaboanalystr/stats_clustering.R")
source("../../function/home/resources/rscripts/metaboanalystr/stats_univariates.R")
source("../../function/home/resources/rscripts/metaboanalystr/general_misc_utils.R")
source("../../function/home/resources/rscripts/metaboanalystr/stats_classification.R")

args <- commandArgs(trailingOnly = TRUE)
log=args[1]
fc=as.numeric(args[2])
pvalue=as.numeric(args[3])
fdr=args[4]
tst=args[5]

set.seed(123)
mSet<-InitDataObjects("conc", "stat", FALSE)

inputdata<-read.table("inputdata.txt",sep="\t",header=TRUE,row.names=1)
un<-unique(inputdata$Group)
set1=inputdata[inputdata$Group == un[1],]
set2=inputdata[inputdata$Group == un[2],]
set1$Group<-NULL
set2$Group<-NULL
list1<-as.data.frame(colnames(set1[,colSums(set1) != 0]))
list2<-as.data.frame(colnames(set2[,colSums(set2) != 0]))
colnames(list1)<-"V1"
colnames(list2)<-"V1"
lista <- c(list1,list2)
venn.diagram(x=lista, filename = "venn-dimensions.png",category.names = c(un[1] , un[2]), fill = c("#999999", "#E69F00"),imagetype="png",disable.logging=TRUE)
cm<-inner_join(list1, list2)
s1<-setdiff(list1, list2)
s2<-setdiff(list2, list1)
colnames(cm)<-paste("Common",un[1],un[2])
colnames(s1)<-paste("Unique",un[1])
colnames(s2)<-paste("Unique",un[2])
venn_out_data<-rbind.fill(cm,s1,s2)
write.table(venn_out_data,"venn_out_data.txt",sep="\t",row.names = FALSE)

mSet<-InitDataObjects("conc", "stat", FALSE)
mSet<-Read.TextData(mSet, "inputdata.txt", "rowu", "disc")
mSet<-SanityCheckData(mSet)
mSet<-ReplaceMin(mSet)
mSet<-SanityCheckData(mSet)
mSet<-FilterVariable(mSet, "F", 25, "none")
mSet<-PreparePrenormData(mSet)
mSet<-Normalization(mSet, "NULL", log, "NULL", ratio=FALSE, ratioNum=20)
mSet<-PlotNormSummary(mSet, "norm_0_", "png", 150, width=NA)
mSet<-PlotSampleNormSummary(mSet, "snorm_0_", "png", 150, width=NA)
mSet<-FC.Anal.unpaired(mSet, fc, 0)
mSet<-PlotFC(mSet, "fc_0_", "png", 150, width=NA)
if(tst == "T")
{
mSet<-Ttests.Anal(mSet, T, pvalue, FALSE, TRUE, fdr)
}else if(tst == "F")
{
mSet<-Ttests.Anal(mSet, F, pvalue, FALSE, TRUE, fdr)
}
mSet<-PlotTT(mSet, "tt_0_", "png", 150, width=NA)
mSet<-Volcano.Anal(mSet, FALSE, fc, 0, F, pvalue, TRUE, fdr)
mSet<-PlotVolcano(mSet, "volcano_0_",0, "png", 150, width=NA)
mSet<-PCA.Anal(mSet)
mSet<-PlotPCA2DScore(mSet, "pca_score2d_0_", "png", 150, width=NA, 1,2,0.95,0,0)
mSet<-PlotHeatMap(mSet, "heatmap_0_", "png", 150, width=NA, "norm", "row", "euclidean", "ward.D","bwm", "overview", T, T, NA, T, F)
mSet<-PlotSubHeatMap(mSet, "heatmap_1_", "png", 150, width=NA, "norm", "row", "euclidean", "ward.D","bwm", "tanova", 25, "overview", T, T, T, F)
write.csv(mSet$analSet$pca$cum.var,"pca_variance.csv")
mSet<-RF.Anal(mSet, 500,7,1)
mSet<-PlotRF.Classify(mSet, "rf_cls_0_", "png", 150, width=NA)
mSet<-PlotRF.VIP(mSet, "rf_imp_0_", "png", 150, width=NA)
mSet<-PlotRF.Outlier(mSet, "rf_outlier_0_", "png", 150, width=NA)
mSet<-SaveTransformedData(mSet)
rf <- as.data.frame(mSet$analSet$rf$confusion)
write.csv(rf,"randomforest_confusion.csv")
ndata<-as.data.frame(mSet$dataSet$norm)
ndata$cls <- as.data.frame(mSet$dataSet$cls)
mean <- t(summarise(ndata, across(everything(), mean), .by = c(cls)))
l = list(mean, mSet$analSet$tt$sig.mat, mSet$analSet$fc$sig.mat)
all_data <- Reduce(merge, lapply(l, function(x) data.frame(x, rn = row.names(x))))
write.table(all_data,"all_data.tsv",sep="\t",row.names = FALSE)
