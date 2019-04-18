# my-retail-api

### Setup ###
1. Install Node.js here: https://nodejs.org/en/

2. Add `/usr/local/bin` to your $PATH variable (if not already present)
   * cd /etc
   * vim paths
   * add `/usr/local/bin` to the file

3. Add the `.env` file (see repo owner)

4. Add the `firebase-key.json` file (see repo owner)

5. Run `npm install` to install dependencies

6. Run `npm start` to start the node server

7. Access the endpoint locally at this address: http://localhost:3232/products/:id

### Tests ###

Currently this project only includes unit tests. Integration tests were left out but could be easily integrated.

1. Run `npm test` to kick off unit tests