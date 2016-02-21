import csv
import sys
import pprint
import re

pp = pprint.PrettyPrinter(indent=4)
uredb_file = "data/ure_1_dates.tsv"

def getTSVDict(dataFile,key):
    out = {}
    with open(dataFile) as tsvfile:
        reader = csv.DictReader(tsvfile,delimiter="\t")
        for row in reader:

            out[row[key]]= row
            
    return out

ure_dates = getTSVDict(uredb_file,'accession_number')

ure_dates = dict((k, v) for k, v in ure_dates.items() if all(x is not " "  for x in v['date']))

'''
dcterms:temporal "151/250" ;
dcterms:temporal "-74" ;
'''
tests = {'600/650':'-650/-600',
         '550/575':'-575/-550',
         '525/550':'-550/-525'}

outdates = {}
for u in ure_dates:
#    pp.pprint(ure_dates[u]['date'])
    date = ure_dates[u]['date']
    didC = False
    if (date == "NULL"):
        continue
    if (re.search(r'c.?',date)):
        
        date = re.sub(r'c.?','00',date) # sometimes c = 00 is used
        didC = True
        
    date = re.sub(r'\.','',date)    # sometimes there's a full stop
    

    d = date.split("-")
    out = ""
    if (len(d) > 1):
        # start end
        start = d[0]
        end = d[1]
        if (didC):
           if (len(start) < len(end)):
               start = start + "00"

        if (len(start) - len(end) > 1):
            # abbreviated date -- probably misses some
            end = date[:2] + end
            pass
        if (int(start) > int(end)):
            out = "-" + start + "/-" + end
        else:
            out = start + "/" + end

            
    else:
       # single date 

        out = "-" + d[0]

    # anomalous stuff
    if (out in tests):
        out = tests[out]            
        print out + " " + u
    if (d is not "-NULL"):
        outdates[u] = out

print "accnum,date"
for u in outdates:
    print u + "," + outdates[u]


