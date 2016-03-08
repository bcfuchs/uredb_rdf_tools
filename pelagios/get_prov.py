import csv
import sys

ure_file= sys.argv[1]     # "data/private/ure_1_long.csv"
print ure_file

'''
make a tsv file 
for provenience. 

'''

def getTSVDict(dataFile,key):
    out = {}
    with open(dataFile,'rU') as tsvfile:
        reader = csv.DictReader(tsvfile)
        for row in reader:
            
            out[row[key]]= row
            pass
        
    return out

uremeta = getTSVDict(ure_file,'accession_number');

out = {}
for id in uremeta:
    words =  uremeta[id]['provenience'].split();
    for w in words:
        out[w] =""
    
pass

for w in out:
    print w+"," + w
