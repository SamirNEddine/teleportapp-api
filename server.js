require('dotenv').config();
const {connectToDb} = require('./utils/mongoose');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const {getGraphqlCORS, getStatusCORS} = require('./utils/cors');
const {httpRequestAuth} = require('./middleware/authentication');
const {httpTimezoneCheck} = require('./middleware/timezone');
const {integrationsCheck} = require('./middleware/integrations');
const bodyParser = require('body-parser');

/** Connect to the database **/
connectToDb();

/** Express app **/
const app = express();

/** graphQL setup **/
//Graphql Schema
const schema = require('./graphql/schema');
//Add it to the express app as a middleware
app.use(
    '/graphql',
    bodyParser.json(),
    getGraphqlCORS(),
    httpRequestAuth,
    httpTimezoneCheck,
    integrationsCheck,
    graphqlHTTP( req => ({
        schema,
        context: {
            jwtUser: req.jwtUser,
            IANATimezone: req.IANATimezone,
            error: req.error
        },
        graphiql: (process.env.GRAPHIQLE_ENABLED === 1)
    }))
);

/** Server status endpoint **/
app.use('/status', getStatusCORS(), function (req, res) {
    res.status(200).send("200 OK: Server is up and running!");
});

/** Start server **/
const port = process.env.MAIN_SERVER_PORT ? process.env.MAIN_SERVER_PORT : 4000;
const server = app.listen(port, function(){
    console.info('Server is successfully launched and can be reached on port:' + port);
});
