import covid from "./hero-coronavirus.jpg";
import main_feature from "./main-featured.png";
import salivary_protein from "./salivary_proteins.png";
import pubmed from "./pubmed-logo.png"
import hero from "./hero.jpeg"
import first_bg from "./first_bg.png"
import second_bg from './second_bg.png'
import third_bg from './third_bg.png'

export const images = [
  { index:0,
    title: "THE HUMAN SALIVARY PROTEOME WIKI (HSPW)", 
    subtitle: "HSPW is a collaborative, community-based Web portal to more than 1,000 unique human saliva proteins identified by high-throughput proteomic technologies. The wiki is developed for the research community and the public to harness the knowledge in the data and to further enhance the value of the proteome. You are very welcome to share your thoughts in the forums; add your own data to the growing database; annotate the proteins; or just explore the site.",
    subtitle1: "" , 
    img:first_bg,
  },
  {
    index:1,
    title: "Clinical Application: Sars-CoV-2 in Saliva",
    subtitle: "Via shotgun proteomics, we have mapped salivary proteomes of COVID-19 and healthy subjects. We aim to understand further the molecular cues of the virus on the context of health and disease.",
    img: second_bg,
  },
  {
    index:2,
    title: "Salivary Protein Map",
    subtitle: 'The chord diagram on left provides salivary protein catalog with each arc in the diagram represents the set of proteins found in the connected tissue or sample types. Click on Chord image to go to salivary protein catalog page that provides the interactive chord diagram and salivary protein search capability.',
    img: third_bg,
  },
];
