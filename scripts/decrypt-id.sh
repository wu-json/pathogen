# decrypt id.json
gpg --quiet --batch --yes --decrypt --passphrase="$ID_JSON_SECRET_PASSPHRASE" \
--output ~/.config/solana/id.json encrypted-keypairs/id.json.gpg
