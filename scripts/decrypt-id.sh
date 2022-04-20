# create solana secrets directory
mkdir secrets/solana

# decrypt id.json
gpg --quiet --batch --yes --decrypt --passphrase="$ID_JSON_SECRET_PASSPHRASE" \
--output secrets/solana/id.json encrypted-keypairs/id.json.gpg
