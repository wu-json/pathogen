# remove existing pathogen-keypair.json
rm target/deploy/pathogen-keypair.json

# decrypt pathogen-keypair.json
gpg --quiet --batch --yes --decrypt --passphrase="$PATHOGEN_KEYPAIR_JSON_PASSPHRASE" \
--output target/deploy/pathogen-keypair.json encrypted-keypairs/pathogen-keypair.json.gpg
