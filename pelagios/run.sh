echo "creating pleiades name matches..."
python named_entity_id.py   > data/ure_pleiades_matches.csv
echo "creating date file.."
python make_dates.py > data/ure_dates.csv
echo "making media list..."
python media.py "data/private/uremeta_accnum_id.tsv" \
    "data/private/uremeta_media.tsv"  \
    "data/private/media.tsv" > data/record_media.tsv

echo "making n3 file..."
python convert2n3.py "data/ure_1.tsv" \
    "data/ure_pleiades_matches.csv" \
    'data/record_media.tsv' > data/uredb.n3

echo "parsing n3 file..."
python parse.py data/uredb.n3
