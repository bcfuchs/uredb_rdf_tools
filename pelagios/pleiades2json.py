import csv
import sys
import json

def getTSVDict(dataFile,key):
    out = {}
    with open(dataFile) as tsvfile:
        reader = csv.DictReader(tsvfile)
        for row in reader:
            if (row[key] in out):
                out[row[key]].append(row)
            else: 
                out[row[key]] = [row]
#                out[row[key]].append(row)
                
            
    return out

pleiadesfile = sys.argv[1]
pleiad = getTSVDict(pleiadesfile,'title')
print json.dumps(pleiad)
