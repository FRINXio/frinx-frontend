const Router = require('express');
const http = require('../../server/HttpServerSide').HttpClient;

const router = new Router();
const odlBaseURL = "http://localhost:8181";
const odlConfigURL = odlBaseURL + "/restconf/config/network-topology:network-topology/topology";
const odlOperURL = odlBaseURL + "/restconf/operational/network-topology:network-topology/topology";
const authToken = "Basic YWRtaW46YWRtaW4=";


router.get('/getstatus', async (req, res) => {
    console.log("request payload");
    console.log(req);

    const result = await http.get(odlOperURL + "/cli/node/xr5", authToken);
    res.status(200).send(result);

});


module.exports = router;
