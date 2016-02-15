import csv
import sys
import re

'''
Extract names from uredb
Make lists for editing

match with pleiades names



'''

namesfile = "data/pleiades/pleiades-names-latest.csv"
datafile = "data/ure_1_long.tsv"
surrogatefile = "data/fabric_names.csv"
def getData(datafile):
    out = []
    with open(datafile,'rU') as tsv:
        reader = csv.DictReader(tsv,delimiter="\t")
        for row in reader:
            out.append(row);
    return out 


def getSurrogates(surrogateFile):
    out = {}
    with open(surrogateFile) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            out[row['fabric']] = row['place']
    return out

def getNames(namesfile):
    pleiad = {}
    with open(namesfile) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            title = row['title']
            uid = row['uid']
            pleiad[title] =  uid
    return pleiad



pleiad = getNames(namesfile);
data = getData(datafile);


# make a list from field names

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
            if token in surrogates:
                sur = surrogates[token]
                if sur in names:
                    print names[sur]
                    out.append([id,token,sur,names[sur])

        
    pass
def makeSurrogates(entBundle):
    pass
ents = makeEntityBundle(data,'fabric')
surrogates = getSurrogates(surrogatefile);
#print surrogates
checkPleiades(ents,pleiad,surrogates)

