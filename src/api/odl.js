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

router.delete('/unmount/:topology/:node', async (req, res, next) => {
    try {
        const result = await http.delete(odlConfigURL + "/" + req.params.topology + "/node/" + req.params.node, authToken);
        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});

router.get('/get/conf/status/:topology/:node', async (req, res, next) => {
    try {
        const result = await http.get(odlConfigURL + "/" + req.params.topology + "/node/" + req.params.node, authToken);
        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});

router.get('/get/oper/status/:topology/:node', async (req, res, next) => {
    try {
        const result = await http.get(odlOperURL + "/" + req.params.topology + "/node/" + req.params.node, authToken);
        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});

router.get('/get/oper/all/status/:topology', async (req, res, next) => {
    let result = null;
    try {
        if(req.params.topology === "cli"){
            result = await http.get(odlOperURL + "/cli", authToken);
        } else {
            result = await http.get(odlOperURL + "/topology-netconf", authToken);
        }
        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});

router.get('/get/conf/all/status/:topology', async (req, res, next) => {
    let result = null;
    try {
        if(req.params.topology === "cli"){
            result = await http.get(odlConfigURL + "/cli", authToken);
        } else {
            result = await http.get(odlConfigURL + "/topology-netconf", authToken);
        }
        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});

router.get('/get/conf/uniconfig/:node', async (req, res, next) => {
    try {
        const result = await http.get(odlConfigURL + "/uniconfig/node/" + req.params.node + "/frinx-uniconfig-topology:configuration", authToken);
        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});

router.get('/get/oper/uniconfig/:node', async (req, res, next) => {
    try {
        const result = await http.get(odlOperURL + "/uniconfig/node/" + req.params.node + "/frinx-uniconfig-topology:configuration", authToken);
        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});



module.exports = router;
