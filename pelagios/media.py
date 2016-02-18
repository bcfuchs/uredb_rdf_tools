import csv
import sys

accnum_id = sys.argv[1]     # "data/private/uremeta_accnum_id.tsv"
media_id_file = sys.argv[2] # "data/private/uremeta_media.tsv"
mediafile = sys.argv[3]     # "data/private/media.tsv"


'''
make a tsv file 
accnum , jpg , caption

'''

def getTSVDict(dataFile,key):
    out = {}
    with open(dataFile) as tsvfile:
        reader = csv.DictReader(tsvfile,delimiter="\t")
        for row in reader:

            out[row[key]]= row



            
    return out

uremeta_media = getTSVDict(media_id_file,'uremeta_media_id')
rec_id = getTSVDict(accnum_id,"id")
media = getTSVDict(mediafile,"id")

# accnum -> [mediaid, mediaid2,..]
# rec_id : accnum -> id
# media :  id -> mediaid

print "id\tsmall\tthumb\tcap"
for r in rec_id:
    id  = r
    accnum  =   rec_id[r]['accession_number']

    if id in uremeta_media:
        mediaid =  uremeta_media[id]['media_id']

        m =  media[mediaid]
        small = m['uri_local'] + "/sm/" +  m['uri']
        thumb = m['uri_local'] + "/thumb/" +  m['uri']
        cap = m['caption']
        print accnum + "\t" + small + "\t" + thumb + "\t" + cap


    
