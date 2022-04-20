# create solana secrets directory
mkdir -p secrets/solana

# decrypt id.json
gpg --quiet --batch --yes --decrypt --passphrase="$ID_JSON_SECRET_PASSPHRASE" \
--output secrets/solana/id.json encrypted-keypairs/id.json.gpg
