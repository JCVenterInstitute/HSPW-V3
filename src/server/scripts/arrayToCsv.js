const pubMedIds = [
  "8294494",
  "1886711",
  "14702039",
  "15057824",
  "15489334",
  "8375503",
  "12221131",
  "15837803",
  "17081983",
  "18329369",
  "18669648",
  "19413330",
  "20643351",
  "20890297",
  "19864458",
  "20068231",
  "21269460",
  "22159412",
  "21282656",
  "21406692",
  "21255211",
  "21844891",
  "22543976",
  "23186163",
  "24275569",
  "26209634",
  "25860027",
  "25944712",
  "26824392",
  "27103069",
  "29125462",
  "30398148",
  "32344433",
  "21378754",
  "27552051",
  "8312365",
  "7796987",
  "10906760",
  "14702039",
  "17974005",
  "15815621",
  "15489334",
  "12665801",
  "11399775",
  "11739654",
  "11564868",
  "12226088",
  "15705855",
  "18586956",
  "18669648",
  "19377461",
  "24336203",
  "21269460",
  "22223895",
  "22814378",
  "23186163",
  "20516061",
  "20926688",
  "20354225",
  "20424263",
  "21712997",
  "23396208",
  "25944712",
  "27264673",
  "27681385",
  "27868344",
  "28211982",
  "28296156",
  "30368668",
  "2719964",
  "2910856",
  "2719646",
  "18824694",
  "1988031",
  "12761501",
  "15461802",
  "14702039",
  "10591208",
  "15489334",
  "3065332",
  "12665801",
  "3611046",
  "1386213",
  "2383549",
  "7501023",
  "10369126",
  "10764829",
  "11146440",
  "14617626",
  "19497882",
  "19608861",
  "21269460",
  "22905912",
  "22223895",
  "22814378",
  "23131994",
  "24945728",
  "24275569",
  "26091039",
  "25944712",
  "32272059",
  "15476813",
  "18796645",
  "19128029",
  "15016833",
  "16421571",
  "15489334",
  "14702039",
  "12853948",
  "10810093",
  "11230166",
  "14702039",
  "16710414",
  "15489334",
  "12505151",
  "11001948",
  "14654843",
  "17081983",
  "17924679",
  "18632687",
  "18669648",
  "19413330",
  "19690332",
  "19608861",
  "21269460",
  "23186163",
  "24275569",
  "24129315",
  "25218447",
  "25114211",
  "25772364",
  "25755297",
  "25944712",
  "28882895",
  "28695742",
  "28112733",
  "36691768",
  "23636399",
  "32687489",
  "1846807",
  "8135813",
  "14702039",
  "16641997",
  "15489334",
  "14654843",
  "21269460",
  "23186163",
  "24524803",
  "24275569",
  "25944712",
  "23636399",
  "32669547",
  "2479552",
  "1697583",
  "1710112",
  "1712312",
  "1376411",
  "15815621",
  "15489334",
  "1726837",
  "19081843",
  "24275569",
  "17020769",
  "8628263",
  "10198631",
  "12857789",
  "14654843",
  "15193260",
  "14607843",
  "15891768",
  "16684779",
  "18084006",
  "18650427",
  "19608861",
  "19380881",
  "20412299",
  "20921139",
  "21269460",
  "21402792",
  "22167198",
  "22965910",
  "24275569",
  "24682284",
  "25741013",
  "28112733",
  "31505170",
  "29955062",
  "33323470",
  "10426949",
  "23482567",
  "11741952",
  "12901880",
  "16710414",
  "15489334",
  "12681488",
  "3365256",
  "2169566",
  "8425765",
  "14702039",
  "15815621",
  "15489334",
  "18669648",
  "19413330",
  "19608861",
  "21269460",
  "22814378",
  "23186163",
  "14702039",
  "15815621",
  "15489334",
  "10318872",
  "11170744",
  "12975309",
  "16554811",
  "15489334",
  "12705872",
  "12648213",
  "15489334",
  "15191570",
  "10811918",
  "14702039",
  "11780052",
  "15489334",
  "7539799",
  "9736737",
  "9628581",
  "17261078",
  "14760718",
  "16335952",
  "19159218",
  "19139490",
  "9545571",
  "10541589",
  "9653160",
  "15489334",
  "19608861",
  "21269460",
  "25944712",
  "3778496",
  "2903158",
  "15057824",
  "15489334",
  "1690725",
  "3031982",
  "10089465",
  "9099727",
  "15154080",
  "10830953",
  "15489334",
  "10987144",
  "18691976",
  "19369195",
  "21269460",
  "23186163",
  "24275569",
  "28716709",
  "16600635",
  "17766369",
  "19351586",
  "22879864",
  "31187503",
  "10022510",
  "11110697",
  "14702039",
  "15164054",
  "15489334",
  "12665801",
  "10861853",
  "10753915",
  "15144186",
  "15592455",
  "17924679",
  "18088087",
  "18669648",
  "19413330",
  "19690332",
  "20068231",
  "21269460",
  "21406692",
  "22814378",
  "23186163",
  "24275569",
  "10488123",
  "15087120",
  "14702039",
  "16710414",
  "15489334",
  "11435484",
  "12833157",
  "15339660",
  "15345777",
  "15629448",
  "15731352",
  "18209087",
  "20201080",
  "15247907",
  "16567635",
  "17002273",
  "21245532",
  "21882827",
  "22004374",
  "15338034",
  "12416996",
  "15087120",
  "16710414",
  "15489334",
  "30044909",
  "27393304",
  "16710414",
  "10470851",
  "15489334",
  "14654994",
  "29262337",
  "3198605",
  "14702039",
  "15057823",
  "15489334",
  "2912382",
  "3131762",
  "8517882",
  "2584229",
  "2243102",
  "2022921",
  "8323299",
  "7685349",
  "12754519",
  "16335952",
  "16176980",
  "17897319",
  "19159218",
  "21269460",
  "22641697",
  "24088571",
  "23847195",
  "23632890",
  "24275569",
  "24970085",
  "25972533",
  "25944712",
  "27605678",
  "28448640",
  "29295909",
  "32295904",
  "37390818",
  "8371983",
  "9360842",
  "9341872",
  "14702039",
  "15772651",
  "15489334",
  "8439294",
  "9393982",
  "9756848",
  "10858305",
  "11525732",
  "11897684",
  "12403470",
  "15590677",
  "16148043",
  "17081983",
  "16964243",
  "16767080",
  "17924679",
  "17693683",
  "18220336",
  "18691976",
  "18669648",
  "18655028",
  "19413330",
  "19690332",
  "19608861",
  "20068231",
  "21269460",
  "21406692",
  "22002106",
  "23186163",
  "24275569",
  "24129315",
  "25218447",
  "26030138",
  "25944712",
  "28712728",
  "28112733",
  "30270045",
  "22416126",
  "26571461",
  "2550906",
  "11004498",
  "14702039",
  "14574404",
  "15489334",
  "1309697",
  "21269460",
  "22356826",
  "24275569",
  "25944712",
  "28844695",
  "30030519",
  "14702039",
  "16641997",
  "15489334",
  "14654843",
  "18669648",
  "19369195",
  "21269460",
  "21612406",
  "21406692",
  "23186163",
  "24524803",
  "25255805",
  "25944712",
  "28112733",
  "23636399",
  "32669547",
  "23812780",
  "10514543",
  "12620401",
  "15498874",
  "14702039",
  "15057824",
  "15489334",
  "14565974",
  "18669648",
  "23186163",
  "1737748",
  "14702039",
  "15815621",
  "15489334",
  "1530588",
  "11279160",
  "12804766",
  "21269460",
  "10903868",
  "11717497",
  "7698762",
  "1718316",
  "1703300",
  "1483685",
  "14702039",
  "16710414",
  "15489334",
  "8300590",
  "7642518",
  "10706581",
  "14563822",
  "19608861",
  "21269460",
  "24275569",
  "25944712",
  "8243660",
  "17157249",
  "16685654",
  "16959974",
  "3021205",
  "3030286",
  "12914573",
  "17974005",
  "16541075",
  "15489334",
  "3036070",
  "6303394",
  "2820791",
  "8635594",
  "2831944",
  "16335952",
  "19159218",
  "24275569",
  "27745832",
  "9477945",
  "11823416",
  "12429092",
  "8162045",
  "22028381",
  "3194209",
  "2726492",
  "1679347",
  "16641997",
  "15489334",
  "2882519",
  "11734571",
  "19690332",
  "21269460",
  "22057399",
  "24275569",
  "25944712",
  "25538232",
  "9737970",
  "9850599",
  "14702039",
  "15815621",
  "15489334",
  "19608861",
  "20068231",
  "21269460",
  "24275569",
  "21595445",
  "21961565",
  "21502315",
  "21984906",
  "23106432",
  "22123821",
  "25478983",
  "27966912",
  "30420606",
  "30457329",
  "32001716",
  "2388839",
  "15489334",
  "8786106",
  "18535205",
  "19608861",
  "21269460",
  "24524803",
  "25944712",
  "23636399",
  "32669547",
  "1620121",
  "8464478",
  "8810274",
  "15133129",
  "17074883",
  "17875742",
  "20679435",
  "21269460",
  "23186163",
  "24905543",
  "25944712",
  "33513601",
  "3171483",
  "2323577",
  "3199069",
  "1565101",
  "7531438",
  "14702039",
  "16554811",
  "15489334",
  "8507662",
  "7685339",
  "7539791",
  "3410852",
  "2501794",
  "3422083",
  "7508748",
  "2584934",
  "7524900",
  "8137941",
  "7526035",
  "10491647",
  "10913121",
  "12421832",
  "18694936",
  "25326458",
  "32337544",
  "36213313",
  "37453717",
  "11319227",
  "16959974",
  "7663511",
  "14702039",
  "15815621",
  "15489334",
  "9244443",
  "9111049",
  "10025964",
  "11801738",
  "19608861",
  "21269460",
  "23186163",
  "25944712",
  "21552258",
  "2764886",
  "11566270",
  "15815621",
  "15489334",
  "2777083",
  "3405773",
  "2780304",
  "557335",
  "8317500",
  "7487954",
  "7864881",
  "687591",
  "1672129",
  "6246925",
  "2145268",
  "3357782",
  "3211760",
  "7016180",
  "6096827",
  "3754462",
  "3858826",
  "2579949",
  "9101290",
  "19455184",
  "25205403",
  "28742248",
  "28258187",
  "22905912",
  "24275569",
  "18805790",
  "23001006",
  "8514866",
  "2235526",
  "2243125",
  "1370809",
  "8411057",
  "2492273",
  "7749417",
  "1352273",
  "2808425",
  "2349939",
  "1895316",
  "1357232",
  "1496983",
  "8098182",
  "8255472",
  "7912131",
  "7833919",
  "8019562",
  "8680408",
  "8884076",
  "9147870",
  "8664902",
  "8990011",
  "9036918",
  "9452103",
  "10819545",
  "10923041",
  "10706896",
  "11168790",
  "12694234",
  "12786757",
  "16959974",
  "18272325",
  "8586434",
  "10428822",
  "11780052",
  "15489334",
  "9164858",
  "10090888",
  "11308397",
  "24273071",
  "30450842",
  "11565064",
  "25381065",
  "31090205",
  "33570243",
  "16269234",
  "11085516",
  "15489334",
  "15082785",
  "16698020",
  "21269460",
  "24275569",
  "25944712",
  "3422434",
  "2829172",
  "2526519",
  "21098726",
  "15164054",
  "15489334",
  "2565035",
  "2251250",
  "3118366",
  "1939225",
  "1540191",
  "8245774",
  "7929073",
  "8615788",
  "8631361",
  "11844797",
  "15280375",
  "17114001",
  "16275640",
  "19022417",
  "19233132",
  "18978352",
  "19807693",
  "21200133",
  "21206090",
  "23246375",
  "24282679",
  "24893149",
  "26210919",
  "31664810",
  "21233389",
  "22516296",
  "32404334",
  "15308583",
  "14702039",
  "15616553",
  "15489334",
  "27637550",
  "8432552",
  "15489334",
  "8706699",
  "14654843",
  "17289661",
  "18669648",
  "19413330",
  "19690332",
  "21269460",
  "23186163",
  "24524803",
  "24275569",
  "25255805",
  "25944712",
  "28112733",
  "23636399",
  "34516797",
  "3839598",
  "14702039",
  "15489334",
  "2834252",
  "17081065",
  "18245775",
  "18347014",
  "18691976",
  "19449892",
  "19349973",
  "20068231",
  "21269460",
  "21406692",
  "22814378",
  "23219802",
  "23186163",
  "23563491",
  "24275569",
  "25957687",
  "25982116",
  "35810171",
  "24847886",
  "27078104",
  "10227690",
  "10980529",
  "11603379",
  "11136715",
  "12325075",
  "14605501",
  "15622525",
  "18451999",
  "19798636",
  "19901175",
  "19630075",
  "20221955",
  "20129935",
  "21204808",
  "20621801",
  "20574033",
  "21791420",
  "20830593",
  "21832227",
  "23280796",
  "22492876",
  "22282645",
  "30197081",
  "10085124",
  "10358058",
  "16617059",
  "14702039",
  "16572171",
  "8530085",
  "10520747",
  "15489334",
  "18703769",
  "21269460",
  "8666798",
  "15326478",
  "16554811",
  "15489334",
  "10653850",
  "21269460",
  "23955712",
  "14528293",
  "32272059",
  "33883744",
  "25261253",
  "25500532",
  "9889007",
  "11167005",
  "11146656",
  "11511094",
  "14702039",
  "16625196",
  "15489334",
  "15116257",
  "15837787",
  "15915442",
  "17296554",
  "18318008",
  "21695558",
  "24275569",
  "17546647",
  "15029247",
  "23479728",
  "25588830",
  "29020630",
  "30389919",
  "12359730",
  "15028290",
  "10830953",
  "15489334",
  "15850461",
  "16710414",
  "15489334",
  "19367720",
  "19369195",
  "19690332",
  "21269460",
  "23186163",
  "24275569",
  "2590215",
  "1989602",
  "14702039",
  "15489334",
  "3378624",
  "3017751",
  "3840370",
  "4033666",
  "14760718",
  "16335952",
  "19159218",
  "24275569",
  "24600566",
  "6222381",
  "16330538",
  "7615630",
  "7627554",
  "14702039",
  "16625196",
  "15489334",
  "8617227",
  "8692944",
  "9405152",
  "9670026",
  "9687515",
  "10228156",
  "10209022",
  "9891055",
  "9891056",
  "11682607",
  "11229403",
  "12095920",
  "11891849",
  "12764225",
  "15297880",
  "16171404",
  "15836774",
  "15629770",
  "16704975",
  "17209048",
  "18691976",
  "18669648",
  "19413330",
  "19386897",
  "19608861",
  "20701745",
  "20147401",
  "21269460",
  "22500989",
  "22084111",
  "22223895",
  "22701565",
  "22814378",
  "23186163",
  "24275569",
  "25944712",
  "10367892",
  "10353244",
  "10929717",
  "12504010",
  "18187419",
  "20476751",
  "24699649",
  "10462544",
  "11681623",
  "11912132",
  "10931946",
  "14702039",
  "16710414",
  "15489334",
  "8313870",
  "1286669",
  "19608861",
  "21269460",
  "23416111",
  "24275569",
  "28112733",
  "15163660",
  "8314870",
  "16541075",
  "15489334",
  "15703217",
  "17081983",
  "17030514",
  "17567679",
  "18296695",
  "18669648",
  "19144824",
  "20068231",
  "21269460",
  "24275569",
  "26091039",
  "25944712",
  "32075961",
  "9074930",
  "10359819",
  "10931946",
  "14702039",
  "16541075",
  "15489334",
  "11302691",
  "14654843",
  "15592455",
  "18691976",
  "19496786",
  "19640993",
  "19608861",
  "19906925",
  "21269460",
  "21328542",
  "20959514",
  "21746876",
  "22997079",
  "22814378",
  "24003225",
  "23186163",
  "24275569",
  "25904163",
  "25944712",
  "28017329",
  "32276428",
  "31522117",
  "6328444",
  "2835369",
  "10520737",
  "14702039",
  "15489334",
  "2985493",
  "166984",
  "4369340",
  "2897845",
  "17339654",
  "28757862",
  "25160599",
  "24275569",
  "DOI:10.4236/ojmn.2018.83021",
  "7779782",
  "9300485",
  "10545169",
  "10391210",
  "16981907",
  "12376540",
  "17974005",
  "15489334",
  "14702039",
  "11001876",
  "18220336",
  "18669648",
  "19690332",
  "20068231",
  "21269460",
  "21406692",
  "23186163",
  "24275569",
  "16710414",
  "15489334",
  "3000358",
  "708376",
  "486087",
  "6981411",
  "6208566",
  "12847249",
  "19006321",
  "6286235",
  "12960167",
  "9777412",
  "9476130",
  "16959974",
  "9271077",
  "15489334",
  "19369195",
  "22223895",
  "22814378",
  "25944712",
  "10591208",
  "5532228",
  "4415202",
  "11872955",
  "17576170",
  "20176268",
  "22158414",
  "24600447",
  "2515285",
  "3323886",
  "11875025",
  "16572171",
  "15489334",
  "14997482",
  "16807684",
  "19413330",
  "21269460",
  "22223895",
  "24524803",
  "25944712",
  "36638793",
  "22135285",
  "23636399",
  "2108320",
  "1855255",
  "8421051",
  "10400640",
  "11042152",
  "14702039",
  "15489334",
  "1961752",
  "8276887",
  "7819259",
  "7891706",
  "8896452",
  "8636225",
  "8692944",
  "9323133",
  "9351834",
  "9428644",
  "9822603",
  "9837918",
  "10209022",
  "10408446",
  "10679025",
  "11571268",
  "11425870",
  "14500717",
  "12194828",
  "12808100",
  "14612415",
  "14654843",
  "14684163",
  "15574331",
  "16428860",
  "17081065",
  "17209048",
  "18591255",
  "18617507",
  "18266911",
  "19413330",
  "19753112",
  "19608861",
  "20485264",
  "21269460",
  "22223895",
  "22814378",
  "23878195",
  "23186163",
  "24275569",
  "25331866",
  "26304119",
  "25944712",
  "28112733",
  "29130391",
  "29040603",
  "31075303",
  "7885480",
  "10367892",
  "10353245",
  "10078529",
  "11336674",
  "11832950",
  "18611384",
  "19505478",
  "19389996",
  "24915079",
  "24449914",
  "26349033",
  "26272610",
  "27306458",
  "28282025",
  "11230159",
  "16710414",
  "15489334",
  "7607214",
  "14702039",
  "16541075",
  "15489334",
  "12414943",
  "14654843",
  "17081983",
  "17924679",
  "18691976",
  "18669648",
  "19369195",
  "19881509",
  "19029303",
  "19690332",
  "20068231",
  "21269460",
  "21406692",
  "23186163",
  "24275569",
  "24371074",
  "25944712",
  "28112733",
  "35322803",
  "16186123",
  "17426136",
  "17526645",
  "18701464",
  "12450215",
  "10931946",
  "11230166",
  "14702039",
  "15489334",
  "16641372",
  "19570034",
  "19608861",
  "20576682",
  "20937701",
  "21269460",
  "21248164",
  "22908308",
  "23263280",
  "24891604",
  "25944712",
  "26824392",
  "29125462",
  "28067790",
  "29127255",
  "30398148",
  "29212815",
  "29562525",
  "31540829",
  "30635421",
  "32344433",
  "27552051",
  "14702039",
  "15372022",
  "15489334",
  "11278427",
  "11883899",
  "11883939",
  "16132846",
  "17045351",
  "16957052",
  "17889823",
  "18256029",
  "19520058",
  "19864416",
  "21269460",
  "21122810",
  "21893193",
  "22223895",
  "25944712",
  "27716508",
  "27813252",
  "18997320",
  "18940611",
  "20691033",
  "25667979",
  "27784779",
  "16959974",
  "1740433",
  "7686132",
  "1439582",
  "16554811",
  "15489334",
  "8783012",
  "16335952",
  "19159218",
  "22028381",
  "8332508",
  "8920921",
  "14702039",
  "15489334",
  "8706699",
  "15592455",
  "18691976",
  "19608861",
  "21269460",
  "23186163",
  "24524803",
  "24275569",
  "25944712",
  "28112733",
  "36638793",
  "23636399",
  "34516797",
  "9693030",
  "15057824",
  "15489334",
  "16335952",
  "23063620",
  "3198605",
  "8517882",
  "8407947",
  "7999007",
  "7488019",
  "14702039",
  "15772651",
  "15489334",
  "2912382",
  "15340161",
  "2243102",
  "8323299",
  "8662539",
  "11082038",
  "12754519",
  "15894275",
  "16335952",
  "16190986",
  "17897319",
  "18644871",
  "19159218",
  "20518820",
  "21269460",
  "22641697",
  "24880125",
  "25944712",
  "27628032",
  "26856698",
  "32295904",
  "36586411",
  "36481789",
  "37390818",
  "25342746",
  "15673802",
  "15907287",
  "16269234",
  "15147942",
  "14702039",
  "15489334",
  "9115270",
  "14702039",
  "11572484",
  "12853948",
  "15489334",
  "8547642",
  "11568009",
  "19666531",
  "26365202",
  "1968462",
  "7584026",
  "14702039",
  "16710414",
  "15489334",
  "2690933",
  "11773414",
  "18005724",
  "15827605",
  "19413330",
  "19608861",
  "21269460",
  "22223895",
  "22814378",
  "24275569",
  "26202976",
  "25944712",
  "29192674",
  "16892359",
  "16684881",
  "19309137",
  "12139950",
  "14702039",
  "15489334",
  "2425263",
  "3600768",
  "9790760",
  "3600769",
  "10578014",
  "19028840",
  "19159218",
  "24275569",
  "28351984",
  "9224653",
  "2556453",
  "1710153",
  "8101486",
  "7927345",
  "8182143",
  "8916969",
  "9111587",
  "9585602",
  "9856476",
  "9794433",
  "9667376",
  "10089913",
  "9888386",
  "10914676",
  "11462241",
  "11997083",
  "15338276",
  "18773283",
  "21278736",
  "22125116",
  "23910690",
  "27666509",
  "16269234",
  "2300173",
  "1673682",
  "15057823",
  "15489334",
  "8440384",
  "8245774",
  "14770184",
  "17304054",
  "19233132",
  "21269460",
  "25944712",
  "17600184",
  "2587267",
  "8948452",
  "16541075",
  "15489334",
  "2803268",
  "2714801",
  "2081599",
  "3021582",
  "1637314",
  "2355003",
  "1999183",
  "8660302",
  "8529631",
  "7847372",
  "2987845",
  "2753125",
  "3857598",
  "1429602",
  "1905723",
  "2543071",
  "2339128",
  "2825137",
  "3840017",
  "3800925",
  "6320112",
  "3002437",
  "9354468",
  "15466413",
  "26183434",
  "2010058",
  "9101290",
  "2572591",
  "1975693",
  "1985108",
  "1374906",
  "8317498",
  "8507190",
  "8486375",
  "8244341",
  "8325895",
  "8423604",
  "7977371",
  "7874117",
  "8019561",
  "7757081",
  "7757086",
  "7829510",
  "7550321",
  "8723098",
  "8863156",
  "9800905",
  "9711874",
  "11007540",
  "10678662",
  "10797431",
  "10745044",
  "11746045",
  "12205109",
  "15054848",
  "15316962",
  "14729840",
  "15643621",
  "16088915",
  "15671297",
  "15930420",
  "16752401",
  "17994563",
  "17394019",
  "18553548",
  "18272325",
  "17721977",
  "19764028",
  "20513134",
  "21671384",
  "21922596",
  "28887846",
  "12837268",
  "11780052",
  "11971875",
  "2820472",
  "14702039",
  "16710414",
  "15489334",
  "3651397",
  "7440581",
  "10551839",
  "16335952",
  "19159218",
  "24275569",
  "21454577",
  "8131848",
  "2430973",
  "2918029",
  "14702039",
  "16572171",
  "15489334",
  "3030396",
  "3461443",
  "2544587",
  "101549",
  "6777381",
  "6341993",
  "6489349",
  "6693501",
  "2478219",
  "1371676",
  "8550562",
  "10613822",
  "11067851",
  "11134179",
  "12450399",
  "14568985",
  "16335952",
  "16740002",
  "16263699",
  "18285447",
  "18042364",
  "19004835",
  "19159218",
  "21269460",
  "24511121",
  "24275569",
  "27742621",
  "29042481",
  "32679764",
  "12391027",
  "15014436",
  "16407063",
  "18065761",
  "1540973",
  "8244394",
  "14702039",
  "16625196",
  "15489334",
  "11302691",
  "14500729",
  "19640993",
  "19608861",
  "19906925",
  "21269460",
  "20959514",
  "21746876",
  "22997079",
  "24003225",
  "24275569",
  "25944712",
  "28017329",
  "31522117",
  "31899195",
  "1542694",
  "7622061",
  "14702039",
  "12853948",
  "15489334",
  "17370265",
  "19608861",
  "21269460",
  "24495017",
  "25210035",
  "28435050",
  "24275569",
  "25944712",
  "29211711",
  "32792488",
  "18973345",
  "7997261",
  "7696354",
  "7479834",
  "10727080",
  "11866441",
  "19906316",
  "14702039",
  "14574404",
  "15489334",
  "12665801",
  "7923354",
  "7535770",
  "7493921",
  "8622669",
  "9687510",
  "9430721",
  "9792677",
  "10391943",
  "9858528",
  "10330143",
  "10943842",
  "10838079",
  "10747897",
  "11010976",
  "11278799",
  "11359773",
  "11154262",
  "11333986",
  "11847341",
  "15284239",
  "15905572",
  "15592455",
  "15735648",
  "15735649",
  "16751104",
  "16932740",
  "17003045",
  "16352664",
  "17724032",
  "17525332",
  "18088087",
  "18691976",
  "18669648",
  "19369195",
  "19690332",
  "19893488",
  "20932473",
  "20188673",
  "20068231",
  "21269460",
  "21224381",
  "21586573",
  "21444723",
  "21283629",
  "12452429",
  "20626350",
  "23186163",
  "24275569",
  "25944712",
  "30878395",
  "35857590",
  "8910361",
  "9095200",
  "9753691",
  "10633045",
  "11896401",
  "12482439",
  "14561090",
  "12897767",
  "14726206",
  "16342939",
  "15837335",
  "16169718",
  "15658854",
  "17255097",
  "17344846",
  "1764025",
  "1397333",
  "14574404",
  "15489334",
  "1587271",
  "2037056",
  "1743401",
  "11839302",
  "9101290",
  "8304336",
  "8004099",
  "7876225",
  "7607655",
  "8782043",
  "9067753",
  "9837818",
  "9852679",
  "15880705",
  "10531326",
  "14656967",
  "15146197",
  "14574404",
  "15489334",
  "16335952",
  "17525477",
  "18279674",
  "18460466",
  "19159218",
  "21269460",
  "11418126",
  "19733574",
  "2618861",
  "2001709",
  "14702039",
  "15489334",
  "2115998",
  "2118648",
  "15489334",
  "8424780",
  "11877431",
  "12444546",
  "15143162",
  "16540189",
  "17509819",
  "21269460",
  "25944712",
  "12697302",
  "14702039",
  "15489334",
  "12886250",
  "18280249",
  "18779414",
  "18088087",
  "19617577",
  "19064721",
  "19234463",
  "19234460",
  "19690332",
  "21269460",
  "23186163",
  "25944712",
  "26359933",
  "16710414",
  "15489334",
  "21152083",
  "21269460",
  "25301951",
  "25944712",
  "28826475",
  "17604275",
  "15489334",
  "17081983",
  "16964243",
  "18669648",
  "20068231",
  "21269460",
  "21406692",
  "21742010",
  "24275569",
  "26042198",
  "7498485",
  "10231361",
  "14702039",
  "15815621",
  "15489334",
  "12226088",
  "18318008",
  "19413330",
  "20068231",
  "21269460",
  "21406692",
  "23186163",
  "24275569",
  "15815621",
  "2914927",
  "11566270",
  "1820205",
  "1571108",
  "8181482",
  "3029669",
  "15489334",
  "2985598",
  "3858826",
  "2411731",
  "3224983",
  "9425231",
  "21757687",
  "9783710",
  "11940702",
  "27656288",
  "14702039",
  "17974005",
  "15815621",
  "15489334",
  "24498351",
  "9837776",
  "9755858",
  "9671755",
  "12893833",
  "14702039",
  "12853948",
  "12690205",
  "15489334",
  "10942756",
  "11301322",
  "18669648",
  "19807924",
  "23186163",
  "24275569",
  "21719704",
  "9144386",
  "18155631",
  "14702039",
  "16554811",
  "15489334",
  "19413330",
  "20068231",
  "21269460",
  "21406692",
  "23186163",
  "15572112",
  "9375793",
  "14702039",
  "15489334",
  "9582194",
  "14654843",
  "19608861",
  "21269460",
  "24524803",
  "25944712",
  "28112733",
  "23636399",
  "32669547",
  "7918633",
  "14702039",
  "16710414",
  "8013624",
  "2306472",
  "7811265",
  "1286667",
  "8610016",
  "8692272",
  "9344905",
  "11571290",
  "12097147",
  "12181345",
  "14550573",
  "15244466",
  "15660529",
  "15592455",
  "17323924",
  "17367606",
  "19139490",
  "21269460",
  "22223895",
  "22814378",
  "23186163",
  "24275569",
  "26524591",
  "25944712",
  "27176742",
  "26133119",
  "25599644",
  "27428775",
  "27342858",
  "27493187",
  "34711951",
  "2954545",
  "2956252",
  "15815621",
  "9479036",
  "6444659",
  "7360115",
  "6327681",
  "2141838",
  "7672128",
  "9291131",
  "9605165",
  "12055245",
  "14760718",
  "16335952",
  "17320177",
  "18544012",
  "19159218",
  "19139490",
  "19838169",
  "21768352",
  "28671664",
  "8613545",
  "12562389",
  "15173250",
  "16621965",
  "17018561",
  "17106690",
  "20513133",
  "23685748",
  "24275569",
  "10092216",
  "15164053",
  "15489334",
  "11551898",
  "17081983",
  "18088087",
  "18669648",
  "18318008",
  "19413330",
  "19807924",
  "19690332",
  "20068231",
  "21269460",
  "21406692",
  "22814378",
  "24275569",
  "25944712",
  "1692159",
  "7903171",
  "12207919",
  "14702039",
  "16710414",
  "15489334",
  "11278853",
  "12716910",
  "15642721",
  "17290225",
  "11090627",
  "12169629",
  "12887891",
  "8286749",
  "9070911",
  "10498624",
  "10598813",
  "11112388",
  "16937026",
  "18625437",
  "19624736",
  "20167518",
  "23910690",
  "27535533",
  "8068206",
  "7933116",
  "14702039",
  "12853948",
  "15489334",
  "3525578",
  "8647875",
  "9362073",
  "9571235",
  "8999969",
  "18669648",
  "20137952",
  "21269460",
  "22155786",
  "21406692",
  "22223895",
  "21706053",
  "23186163",
  "24275569",
  "25218447",
  "20434460",
  "20393565",
  "DOI:10.1038/nature10281",
  "21685497",
  "23184945",
  "8573080",
  "14702039",
  "15164053",
  "15489334",
  "8947836",
  "15340161",
  "21037097",
  "20400674",
  "17148457",
  "17897951",
  "20032467",
  "16959974",
  "3258820",
  "2963335",
  "2528541",
  "14702039",
  "15372022",
  "15489334",
  "2139657",
  "15242332",
  "14654843",
  "17081065",
  "19690332",
  "19608861",
  "21269460",
  "22814378",
  "24275569",
  "25944712",
  "8709144",
  "9150425",
  "12420295",
  "15772651",
  "15489334",
  "18669648",
  "18469038",
  "20068231",
  "23338946",
  "23186163",
  "25713288",
  "27476656",
  "23092983",
  "28397838",
  "3368442",
  "15616553",
  "15489334",
  "2243141",
  "2469497",
  "12716910",
  "15585859",
  "15561711",
  "15824103",
  "15927447",
  "17140397",
  "19948736",
  "22808130",
  "23186163",
  "16326715",
  "1415254",
  "1763037",
  "8168815",
  "7964505",
  "10910929",
  "10759707",
  "10914676",
  "18422995",
  "19388116",
  "23910690",
  "8088784",
  "8051117",
  "1307247",
  "1567409",
  "1469284",
  "1871109",
  "8499916",
  "2537292",
  "19269366",
  "9375848",
  "21269460",
  "2653224",
  "8513326",
  "8170945",
  "8541842",
  "7861014",
  "8644729",
  "8592061",
  "8618018",
  "8757758",
  "9326325",
  "9444387",
  "9215684",
  "9008239",
  "9668111",
  "9740253",
  "9804332",
  "9856843",
  "9856844",
  "10232406",
  "10232407",
  "10232408",
  "10084325",
  "10233777",
  "10383749",
  "10469344",
  "10504458",
  "10836608",
  "11142768",
  "10620140",
  "11167698",
  "11843659",
  "11874498",
  "12787275",
  "16959974",
  "20108428",
  "20598510",
  "9714763",
  "14702039",
  "16710414",
  "15489334",
  "19508227",
  "15498874",
  "11214971",
  "14702039",
  "16421571",
  "15489334",
  "15659642",
  "19690332",
  "24275569",
  "2428011",
  "2430261",
  "1708673",
  "1696200",
  "14702039",
  "15164053",
  "15489334",
  "6198962",
  "6164372",
  "7506257",
  "2408638",
  "1469060",
  "1898736",
  "7682553",
  "7676539",
  "7513643",
  "6171497",
  "3890890",
  "2476436",
  "1694784",
  "1714898",
  "7535251",
  "9183005",
  "10480954",
  "10631976",
  "11877257",
  "15452109",
  "15037615",
  "15683711",
  "15917224",
  "16140784",
  "16873769",
  "20463016",
  "21356557",
  "22096585",
  "22171320",
  "23157686",
  "23642167",
  "25301953",
  "24275569",
  "25698971",
  "25326458",
  "32337544",
  "32823731",
  "32092412",
  "36213313",
  "37453717",
  "9566199",
  "22512701",
  "11058759",
  "12359730",
  "10830953",
  "15489334",
  "6548561",
  "2410860",
  "6585824",
  "2830249",
  "3016456",
  "15164053",
  "2649152",
  "6689266",
  "18000879",
  "24275569",
  "35122041",
  "11679716",
  "8535439",
  "3383242",
  "1967768",
  "8299883",
  "7717389",
  "8162030",
  "2336380",
  "10024431",
  "10970798",
  "12205126",
  "15532022",
  "15880727",
  "20848650",
  "15617563",
  "16625196",
  "15489334",
  "15085952",
  "17301834",
  "7685034",
  "16710414",
  "7686953",
  "27866708",
  "21248752",
  "12975309",
  "15164053",
  "15489334",
  "9174053",
  "9053841",
  "15815621",
  "8122112",
  "17625570",
  "11387242",
  "11121404",
  "11278720",
  "12112524",
  "11809760",
  "12107166",
  "12122009",
  "15226403",
  "15938644",
  "15908427",
  "16317043",
  "15592455",
  "16161041",
  "17274988",
  "17681947",
  "16878150",
  "19459784",
  "22327622",
  "25605972",
  "30061385",
  "33411331",
  "20632993",
  "20695522",
  "20454865",
  "21575866",
  "22932897",
  "34646012",
  "34819673",
  "17344846",
  "18724359",
  "18923523",
  "18923525",
  "21242967",
  "2481229",
  "2154602",
  "10942113",
  "20603636",
  "14702039",
  "10830953",
  "15489334",
  "2607176",
  "2161946",
  "8411374",
  "9060610",
  "9933640",
  "11880649",
  "15047845",
  "14752052",
  "15355513",
  "14687945",
  "15757897",
  "16413306",
  "16009940",
  "16978069",
  "16202617",
  "17374778",
  "18062906",
  "18668195",
  "19109387",
  "20538602",
  "21269460",
  "21859714",
  "21900240",
  "21166595",
  "21992152",
  "25772364",
  "20428112",
  "21962493",
  "17033959",
  "12853948",
  "9799793",
  "11239002",
  "9126492",
  "14759258",
  "9367678",
  "7788527",
  "14702039",
  "16710414",
  "15489334",
  "21269460",
  "22467853",
  "25135935",
  "23606741",
  "24275569",
  "25944712",
  "29765154",
  "31831667",
  "22305527",
  "8445646",
  "2605182",
  "8106441",
  "15489334",
  "2561247",
  "4066659",
  "7578066",
  "9398177",
  "20632143",
  "23934049",
  "16959974",
  "8245017",
  "9244440",
  "14702039",
  "15489334",
  "2375755",
  "9492324",
  "16472595",
  "17160890",
  "19414556",
  "20558631",
  "20051317",
  "12775711",
  "12851408",
  "18403759",
  "8812460",
  "11003705",
  "7584026",
  "14702039",
  "15489334",
  "12665801",
  "9516461",
  "10585411",
  "11418588",
  "16014927",
  "15592455",
  "19413330",
  "19690332",
  "20068231",
  "21269460",
  "21406692",
  "22223895",
  "22814378",
  "23186163",
  "24275569",
  "24129315",
  "25944712",
  "10542310",
  "10931946",
  "15164054",
  "15489334",
  "19413330",
  "19608861",
  "20068231",
  "21269460",
  "22223895",
  "22814378",
  "24275569",
  "16959974",
  "12975309",
  "16625196",
  "15489334",
  "15340161",
  "10384126",
  "12079290",
  "14656967",
  "12975309",
  "14574404",
  "15489334",
  "17008713",
  "11085516",
  "11342557",
  "10833516",
  "11230166",
  "15498874",
  "14702039",
  "15489334",
  "11816564",
  "11470154",
  "18220336",
  "18669648",
  "19464326",
  "21269460",
  "22366786",
  "23186163",
  "15122253",
  "15565283",
  "17344846",
  "28144995",
  "2808363",
  "2789218",
  "8512929",
  "15372022",
  "15489334",
  "2468158",
  "9366265",
  "10551839",
  "16335952",
  "24275569",
  "22267737",
  "8101442",
  "15565285",
  "1550342",
  "12853948",
  "15489334",
  "2513880",
  "21269460",
  "23186163",
  "24275569",
  "25944712",
  "10048323",
  "19483672",
  "21808038",
  "15264278",
  "15483095",
  "15220035",
  "14758361",
  "27610946",
  "3365686",
  "2171551",
  "1993697",
  "1339263",
  "1599482",
  "14702039",
  "16541075",
  "15489334",
  "7682577",
  "4062294",
  "1939168",
  "10793155",
  "12754519",
  "15351990",
  "16917503",
  "17897319",
  "19159218",
  "19640571",
  "21269460",
  "21803846",
  "21962903",
  "22431521",
  "22660413",
  "23632027",
  "24635319",
  "25944712",
  "1998338",
  "14702039",
  "17974005",
  "16572171",
  "15489334",
  "2336361",
  "9101289",
  "21269460",
  "24275569",
  "25944712",
  "1401056",
  "8364576",
  "8318997",
  "7942842",
  "7977370",
  "8005583",
  "7757089",
  "7550234",
  "8557261",
  "9633815",
  "11196105",
  "11476670",
  "11278491",
  "20003495",
  "27535533",
  "8570618",
  "15772651",
  "15489334",
  "8590280",
  "7981673",
  "16417406",
  "18669648",
  "19690332",
  "23186163",
  "24275569",
  "25944712",
  "10524232",
  "19169850",
  "15815621",
  "15489334",
  "17525332",
  "18669648",
  "21269460",
  "23186163",
  "9618483",
  "9837935",
  "11350124",
  "15489334",
  "21558561",
  "22441738",
  "11773004",
  "15629692",
  "16116617",
  "19131948",
  "19890349",
  "1738601",
  "15164053",
  "15489334",
  "2172968",
  "1903202",
  "1946430",
  "1281544",
  "8041788",
  "19762596",
  "19762597",
  "20053667",
  "21269460",
  "23891004",
  "29320706",
  "24275569",
  "16407072",
  "23033978",
  "11062687",
  "12752121",
  "14702039",
  "16303743",
  "14574404",
  "15489334",
  "30321533",
  "31361044",
  "31898316",
  "9218461",
  "9712717",
  "10930526",
  "14702039",
  "16641997",
  "15489334",
  "8663431",
  "10770950",
  "11390389",
  "9572851",
  "9485382",
  "12564925",
  "15308695",
  "16091359",
  "17567603",
  "18629440",
  "21269460",
  "21806988",
  "22789739",
  "22052202",
  "23501106",
  "23659204",
  "23590222",
  "24648509",
  "24343571",
  "24275569",
  "25365352",
  "27206388",
  "26745724",
  "29748552",
  "29352288",
  "31434743",
  "32110987",
  "35138119",
  "35595813",
  "37438530",
  "15611084",
  "7999070",
  "9126610",
  "12508121",
  "15489334",
  "19608861",
  "21269460",
  "22814378",
  "3220478",
  "3337731",
  "2830274",
  "14702039",
  "15057824",
  "15489334",
  "15340161",
  "2803308",
  "2317824",
  "2022629",
  "1378450",
  "8776764",
  "10436421",
  "10910050",
  "11590190",
  "14724575",
  "16204051",
  "16740002",
  "19159218",
  "26483485",
  "18318008",
  "2473157",
  "2387583",
  "2745977",
  "11102386",
  "12508121",
  "15489334",
  "3458170",
  "2501794",
  "18694936",
  "19450231",
  "20690710",
  "25944712",
  "10606511",
  "10903870",
  "12356310",
  "10681516",
  "14702039",
  "16625196",
  "15489334",
  "12234672",
  "18669648",
  "19690332",
  "21269460",
  "23186163",
  "17985935",
  "4018030",
  "15489334",
  "6095282",
  "3219351",
  "9634479",
  "4055801",
  "8603752",
  "9212048",
  "10551839",
  "14760718",
  "16335952",
  "16263699",
  "19159218",
  "19139490",
  "24275569",
  "2395434",
  "22832194",
  "26841934",
  "30111885",
  "24036952",
  "8954801",
  "15057824",
  "15489334",
  "21269460",
  "25944712",
  "28289220",
  "2760028",
  "2308937",
  "14702039",
  "15489334",
  "2211668",
  "7957065",
  "8605992",
  "2212941",
  "8031790",
  "8621488",
  "1537839",
  "7882982",
  "10026262",
  "12145306",
  "15075319",
  "14704337",
  "15561718",
  "15758953",
  "17396150",
  "17353262",
  "19690332",
  "19608861",
  "23972994",
  "23689425",
  "27063109",
  "20383123",
  "21269460",
  "22002106",
  "22442688",
  "22266820",
  "23186163",
  "24610814",
  "24275569",
  "24598253",
  "25114211",
  "25852083",
  "25941166",
  "25670504",
  "26359349",
  "26030138",
  "25944712",
  "25574025",
  "26502055",
  "27601299",
  "28712728",
  "28112733",
  "28959974",
  "29769340",
  "29490055",
  "32103174",
  "11493912",
  "34352203",
  "33854234",
  "16710414",
  "1710976",
  "16740002",
  "15299664",
  "12527308",
  "9345902",
  "10682683",
  "15489334",
  "11325528",
  "11268000",
  "12429849",
  "12682367",
  "15064750",
  "15583694",
  "17081983",
  "16964243",
  "16832058",
  "18669648",
  "19413330",
  "19037095",
  "19690332",
  "20068231",
  "21269460",
  "21406692",
  "22223895",
  "22814378",
  "23186163",
  "24275569",
  "25944712",
  "27346687",
  "28112733",
  "17765895",
  "10591208",
  "5087637",
  "500108",
  "3922791",
  "11872955",
  "17576170",
  "20176268",
  "22158414",
  "24600447",
  "11785964",
  "16641997",
  "15489334",
  "12923058",
  "34702854",
  "36228039",
  "36735681",
  "36757924",
  "16177791",
  "15722956",
  "10523508",
  "16177791",
  "15489334",
  "9657962",
  "9920726",
  "11511104",
  "16143324",
  "16895911",
  "19289470",
  "19608861",
  "21269460",
  "21976701",
  "21957124",
  "23601107",
  "24105263",
  "23186163",
  "24275569",
  "25447204",
  "25944712",
  "29858488",
  "30741634",
  "30659099",
  "32344433",
  "20178991",
  "33124732",
  "14702039",
  "16710414",
  "15489334",
  "17974005",
  "11483580",
  "19818707",
  "21269460",
  "27753622",
  "23827681",
  "14756420",
  "14702039",
  "15489334",
  "32707087",
  "9253601",
  "10395801",
  "15489334",
  "12665801",
  "15020713",
  "15592455",
  "16251358",
  "17233914",
  "18691976",
  "18669648",
  "18331452",
  "19864458",
  "19690332",
  "20801876",
  "20068231",
  "21269460",
  "21406692",
  "22814378",
  "24019528",
  "23186163",
  "23596323",
  "24275569",
  "25686250",
  "25944712",
  "20106972",
  "17899392",
  "2901990",
  "2564851",
  "16572171",
  "15489334",
  "1675638",
  "7576235",
  "8102610",
  "6149934",
  "1705556",
  "1350662",
  "7902291",
  "8105105",
  "8887485",
  "9056417",
  "9367365",
  "10605003",
  "10676659",
  "11384645",
  "11559807",
  "12473585",
  "12551991",
  "15084671",
  "16335952",
  "19159218",
  "21269460",
  "24275569",
  "25944712",
  "22932899",
  "9452074",
  "9245787",
  "7584044",
  "12168954",
  "14702039",
  "17974005",
  "15164054",
  "15489334",
  "15144186",
  "15592455",
  "17194709",
  "17525332",
  "18088087",
  "18669648",
  "19413330",
  "19690332",
  "20068231",
  "21406692",
  "23186163",
  "24275569",
  "28112733",
  "11230166",
  "15489334",
  "14702039",
  "19367720",
  "30683861",
  "8764072",
  "11042152",
  "14702039",
  "11780052",
  "15489334",
  "8610016",
  "10748218",
  "11389899",
  "11713272",
  "11574696",
  "12119296",
  "12181345",
  "14550573",
  "15244466",
  "14759258",
  "14998988",
  "15987638",
  "16251969",
  "16678104",
  "17323924",
  "18202793",
  "19362550",
  "19734229",
  "19442227",
  "19608861",
  "21269460",
  "24275569",
  "25944712",
  "27176742",
  "26133119",
  "25599644",
  "27428775",
  "27342858",
  "27493187",
  "34711951",
  "23033978",
];

const fs = require("fs");
const path = require("path");

// Join all strings with a newline character to create a CSV string
const csvContent = pubMedIds.join("\n");

// Specify the path to the file you want to save the CSV content to
const filePath = path.join(__dirname, "output.csv");

// Write the CSV content to a file
fs.writeFile(filePath, csvContent, "utf8", (err) => {
  if (err) {
    console.error("An error occurred while writing the CSV file:", err);
  } else {
    console.log("CSV file has been saved successfully to:", filePath);
  }
});