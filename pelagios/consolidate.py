import csv
import sys

wiki_file= sys.argv[1]     # "data/private/adjectives_wikipedia.csv"
ure_file= sys.argv[2]     # "data/fabric_names.csv"


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
fabric = getTSVDict(ure_file,'fabric');
wiki = getTSVDict(wiki_file,'Adjective');

out = fabric.keys() + wiki.keys()
myset = set(out)

out2 = {}
for x in out:
    y = ""
    if (x in wiki):
        y = wiki[x]['Name']
    else:
        if (x in fabric):
            y = fabric[x]['place']
    if (x in out2):
        
        print >> sys.stderr,"OOOO"
        print >> sys.stderr,x + " " + out2[x] + " " + y
    out2[x] = y

for a in sorted(out2.iterkeys()):
    print a + "," + out2[a];

        
