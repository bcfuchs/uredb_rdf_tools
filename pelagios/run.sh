python named_entity_id.py   > data/ure_pleiades_matches.csv
python convert2n3.py "data/ure_1.tsv" "data/ure_pleiades_matches.csv" 'data/record_media.tsv' > data/uredb.n3
python parse.py data/uredb.n3
