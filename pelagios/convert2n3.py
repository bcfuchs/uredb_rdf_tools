from string import Template
import datetime
import csv
import sys

'''
Generate n3 files for uredb

'''

datafile = sys.argv[1]  #"data/ure_1.tsv"
placesFile = sys.argv[2] #"data/ure_pleiades_matches.csv"

preface = '''
@prefix cnt: <http://www.w3.org/2011/content#> . 
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix oa: <http://www.w3.org/ns/oa#> .
@prefix pelagios: <http://pelagios.github.io/vocab/terms#> .
@prefix relations: <http://pelagios.github.io/vocab/relations#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema> .

<http:///http://uredb.reading.ac.uk/ure/n3/uredb.n3#agents/bcf> a foaf:Person ;
 foaf:name "Brian Fuchs" ;
 foaf:workplaceHomepage <http://mobilecollective.co.uk> ; 
.
'''

annotation = '''
<http://uredb.reading.ac.uk/ure/n3/uredb.n3#$accnum/annotations/$ann> a oa:Annotation ;
 oa:hasTarget <http://uredb.reading.ac.uk/ure/n3/uredb.n3#$accnum> ;
 oa:hasBody <http://pleiades.stoa.org/places/$placesid> ;
 pelagios:relation relations:foundAt ;
 oa:annotatedBy <http://uredb.reading.ac.uk/ure/n3/uredb.n3#agents/$agent> ;
 oa:annotatedAt "$date"^^xsd:date ;
.
'''
record = '''
<http://uredb.reading.ac.uk/ure/n3/uredb.n3#$accnum> a pelagios:AnnotatedThing ;
  dcterms:title "$title" ;
  dcterms:identifier <http://uredb.reading.ac.uk/record/$accnum> ;
  foaf:homepage <http://uredb.reading.ac.uk/cgi-bin/ure/uredb.cgi> ;
  dcterms:description "$description" ;
.
'''
def getPlaces(dataFile):
    out = {}
    with open(dataFile) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
              if (row['record'] in out):
                    out[row['record']].append(row)
                    
                    

              out[row['record']] = [row]
    return out


def getTsvFile(datafile):
      out = []
      with open(datafile,'rU') as tsv:
            i = 0;
            for line in csv.reader(tsv, delimiter="\t"):
                  if (i > 0 ):
                        out.append(line)
                  i = i + 1;
      return out





uredata = getTsvFile(datafile);
places = getPlaces(placesFile)
thisdate = datetime.datetime.now().strftime("%Y-%m-%d:%H:%M:%SZ")


rec = Template(record)
ann = Template(annotation)
def fillInRecord(s,title,description,accnum):
    return  s.safe_substitute(title=title, description=description,accnum=accnum)
print preface

for d in uredata: 
    accnum,title,description = "","",""
    accnum = d[0].replace(' ','%20')

    if (len(d) > 1):
        title = d[1].replace('\n', ' ').replace('\r', '').replace('\\','')
    if (len(d) > 2):
        description = d[2].replace('\n', ' ').replace('\r', ' ').replace('\\"','').replace('\\','')
    print fillInRecord(rec,title,description,accnum)

    if (accnum in places):
          i = 0
          for place in places[accnum]:
                i = i + 1

                print ann.safe_substitute(ann=i,accnum=accnum,placesid=place['guid'],agent="bcf",date=thisdate)




'''

<http://edh-www.adw.uni-heidelberg.de/edh.inscriptions.n3#HD057360> a pelagios:AnnotatedThing ;
 dcterms:title "Inscription of Andros (modern Andros) HD057360" ;
 dcterms:identifier <http://edh-www.adw.uni-heidelberg.de/edh/inschrift/HD057360> ;
 foaf:homepage <http://edh-www.adw.uni-heidelberg.de/edh/inschrift/HD057360> ;
 dcterms:temporal "-99/-70" ;
 dcterms:language "lat" ;

'''
