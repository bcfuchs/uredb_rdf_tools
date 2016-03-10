import csv
import sys

adj_file= sys.argv[1]     # "data/adj_place_checked.csv"
perseus_file= sys.argv[2]     # "data/perseus_adjs.csv""


'''
consolidate hand-checked combo from wikipedia and uredb with perseus NE adj data. 

'''

def getTSVDict(dataFile,key,delim):
    out = {}
    with open(dataFile,'rU') as tsvfile:
        reader = csv.DictReader(tsvfile,delimiter=delim)
        for row in reader:
            
            out[row[key]]= row
            pass
        
    return out
adj = getTSVDict(adj_file,'adjective',',');
perseus = getTSVDict(perseus_file,'def',"\t");


    
comb = sorted(set(adj.keys() + perseus.keys()))


for n in comb:
    y = ""
    if (n in adj):
        y = adj[n]['place']
    print n + ',' + y

    
    

def process(adj,perseus):    
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

    pass


        
