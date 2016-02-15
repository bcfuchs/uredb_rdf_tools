import csv
import sys
import re

'''
Extract names from uredb
Make lists for editing

match with pleiades names
output a list of matches as csv for use with convert2n3.py


'''

namesfile = "data/pleiades/pleiades-names-latest.csv"
datafile = "data/private/ure_1_long.tsv"
surrogatefile = "data/fabric_names.csv"


# <- uredb tsv dump
def getData(datafile):
    out = []
    with open(datafile,'rU') as tsv:
        reader = csv.DictReader(tsv,delimiter="\t")
        for row in reader:
            out.append(row);
    return out 

# <- surrogates csv 
# -> { fabric_token:surrogate,...}
def getSurrogates(surrogateFile):
    out = {}
    with open(surrogateFile) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            out[row['fabric']] = row['place']
    return out

# <- pleiades names dump csv
# -> {Pleiades name:pleides pid,...}
def getNames(namesfile):
    pleiad = {}
    with open(namesfile) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            title = row['title']
            pid = row['pid']
            if (title == 'Attica'):

                pid = '579888'
            pleiad[title] =  pid
    return pleiad




# make a list from names found in a uredb field
# <- data=uredb data from tsv; field=uredb field
# -> [name1,name2,...]    sorted+uniqued
def makeEntityList(data,field):
    names = []
    for d in data:
        fab = d[field]
        if (fab):
            words = []
            fab = fab.replace(" (?)",'').replace('?','').replace('\\','').replace('Perhaps','')
            fab = re.sub(r'[\)\(\;\:\,]','',fab)
            if (re.match(r'(North|South|East|West|Minor)',fab)):
                words.append(fab)
            else:
                words = fab.split()
                for w in words:
                    if (re.match(r'[A-Z]',w)):
                            names.append(w.rstrip())
               
    return sorted(set(names))
        
# [[entity -> record id],..]
def makeEntityBundle(data,field):
    names = []
    for d in data:
        id = d['accession_number']
        fab = d[field]
        if (fab):
            words = []
            fab = fab.replace(" (?)",'').replace('?','').replace('\\','').replace('Perhaps','')
            fab = re.sub(r'[\)\(\;\:\,]','',fab)
            if (re.match(r'(North|South|East|West|Minor)',fab)):
                words.append(fab)
            else:
                words = fab.split()
            for w in words:
                if (re.match(r'[A-Z]',w)):
                    names.append({w:id})
               
    return names

# get the guid for each token, using surrogates
# return [[id,token,surrogate,guid],...]
def checkPleiades(data,names,surrogates):
    out =[]
    for item in data:
        for token in item:
            rec = item[token]
            if token in surrogates:
                sur = surrogates[token]
                if sur in names:

                    out.append([rec,token,sur,names[sur]])

    return out
    pass

pleiad = getNames(namesfile);
data = getData(datafile);
ents = makeEntityBundle(data,'fabric')
surrogates = getSurrogates(surrogatefile);

checked = checkPleiades(ents,pleiad,surrogates)


# create a csv file for use with convert2n3.py
print  "record,token,surrogate,guid"
for c in checked:
    print c[0] + "," + c[1] + "," + c[2] + "," + c[3] 
