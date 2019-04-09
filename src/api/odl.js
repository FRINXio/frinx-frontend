const Router = require('express');
const http = require('../server/HttpServerSide').HttpClient;

const router = new Router();
const odlBaseURL = "http://localhost:8181";
const odlConfigURL = odlBaseURL + "/restconf/config/network-topology:network-topology/topology";
const odlOperURL = odlBaseURL + "/restconf/operational/network-topology:network-topology/topology";
const authToken = "Basic YWRtaW46YWRtaW4=";

router.put('/mount/:topology/:node', async (req, res, next) => {
    try {
        const result = await http.put(odlConfigURL + "/" + req.params.topology + "/node/" + req.params.node, req.body, authToken);
        res.status(200).send({result: res.statusCode});
    } catch (e) {
        next(e);
    }
});

//xhr.open("GET", "http://localhost:8181/restconf/operational/network-topology:network-topology/topology/cli/node/xr5");
router.get('/get/status/:topology/:node', async (req, res, next) => {
    try {
        const result = await http.get(odlOperURL + "/" + req.params.topology + "/node/" + req.params.node, authToken);
        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
