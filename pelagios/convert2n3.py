from string import Template
import csv

preface = '''
@prefix cnt: <http://www.w3.org/2011/content#> . 
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix oa: <http://www.w3.org/ns/oa#> .
@prefix pelagios: <http://pelagios.github.io/vocab/terms#> .
@prefix relations: <http://pelagios.github.io/vocab/relations#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema> .
'''

record = '''
<http://uredb.reading.ac.uk/ure/n3/uredb.n3#$accnum> a pelagios:AnnotatedThing ;
  dcterms:title "$title" ;
  dcterms:identifier <http://uredb.reading.ac.uk/record/$accnum> ;
  foaf:homepage <http://uredb.reading.ac.uk/cgi-bin/ure/uredb.cgi> ;
  dcterms:description "$description" ;
.
'''
uredata = []
with open("ure_1.tsv",'rU') as tsv:
      i = 0;
      for line in csv.reader(tsv, delimiter="\t"):
          if (i > 0 ):
              uredata.append(line)
          i = i + 1;


rec = Template(record)
def fillInRecord(s,title,description,accnum):
    return  s.safe_substitute(title=title, description=description,accnum=accnum)
print preface

for d in uredata: 
    accnum,title,description = "","",""
    accnum = d[0]

    if (len(d) > 1):
        title = d[1].replace('\n', ' ').replace('\r', '')
    if (len(d) > 2):
        description = d[2].replace('\n', ' ').replace('\r', ' ')
    print fillInRecord(rec,title,description,accnum)
    



'''

<http://edh-www.adw.uni-heidelberg.de/edh.inscriptions.n3#HD057360> a pelagios:AnnotatedThing ;
 dcterms:title "Inscription of Andros (modern Andros) HD057360" ;
 dcterms:identifier <http://edh-www.adw.uni-heidelberg.de/edh/inschrift/HD057360> ;
 foaf:homepage <http://edh-www.adw.uni-heidelberg.de/edh/inschrift/HD057360> ;
 dcterms:temporal "-99/-70" ;
 dcterms:language "lat" ;

'''
