# Certificates
Place certificate and key inside this folder in format:
* key.pem
* cert.pem

Either use passphrase directly and place key and certificate here decrypted, 
or provide passphrase as environment variable for Nodejs in format: 
* in docker-compose: `PASSPHRASE: <passphrase>`
* as nodejs arg: `PASSPHRASE=<passphrase> node server.js`
