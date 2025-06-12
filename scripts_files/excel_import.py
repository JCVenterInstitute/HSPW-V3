def split_import(ex):
    seperate = ex.split("\n,")
    return seperate
    
def count_trailing_commas(header):
    num_of_commas = header.count(',')
    trailing_commas = num_of_commas - header.rstrip(',').count(',')
    return trailing_commas
    
def clean_split(split):
    cleansed_split = split.split('\n')
    cleansed_split.pop(0)
    trailing_commas = count_trailing_commas(cleansed_split[0])
    cleansed_split = [string[:-trailing_commas] for string in cleansed_split]
    print(cleansed_split)

split_array = split_import(example)
print(split_array)
for x in split_array[1:]:
    clean_split(x)