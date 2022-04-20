# remove existing pathogen-keypair.json
rm $HOME/target/deploy/pathogen-keypair.json

# decrypt pathogen-keypair.json
gpg --quiet --batch --yes --decrypt --passphrase="$PATHOGEN_KEYPAIR_JSON_PASSPHRASE" \
--output $HOME/target/deploy/pathogen-keypair.json $HOME/encrypted-keypairs/pathogen-keypair.json.gpg

# create solana secrets directory
mkdir $HOME/secrets/solana

# decrypt id.json
gpg --quiet --batch --yes --decrypt --passphrase="$ID_JSON_SECRET_PASSPHRASE" \
--output $HOME/secrets/solana/id.json $HOME/encrypted-keypairs/id.json.gpg
