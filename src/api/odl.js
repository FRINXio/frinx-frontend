const Router = require("express");
const http = require("../server/HttpServerSide").HttpClient;

const router = new Router();
const odlBaseURL = process.env.ODL_HOST;
const odlConfigURL =
  odlBaseURL + "/restconf/config/network-topology:network-topology/topology";
const odlOperURL =
  odlBaseURL +
  "/restconf/operational/network-topology:network-topology/topology";
const odlOperationsURL = odlBaseURL + "/restconf/operations";
const authToken = "Basic YWRtaW46YWRtaW4=";

/*********** MOUNT AND UNMOUNT ***********/
router.put("/mount/:topology/:node", async (req, res, next) => {
  try {
    await http.put(
      odlConfigURL + "/" + req.params.topology + "/node/" + req.params.node,
      req.body,
      authToken
    );
    res.status(200).send({ result: res.statusCode });
  } catch (e) {
    next(e);
  }
});

router.delete("/unmount/:topology/:node", async (req, res, next) => {
  try {
    const result = await http.delete(
      odlConfigURL + "/" + req.params.topology + "/node/" + req.params.node,
      req.body,
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

/*********** CONFIGURATIONAL AND OPERATIONAL STATUS OF NODE ***********/
router.get("/conf/status/:topology/:node", async (req, res, next) => {
  try {
    const result = await http.get(
      odlConfigURL + "/" + req.params.topology + "/node/" + req.params.node,
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

router.get("/oper/status/:topology/:node", async (req, res, next) => {
  try {
    const result = await http.get(
      odlOperURL + "/" + req.params.topology + "/node/" + req.params.node,
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

/*********** OPERATIONAL AND CONFIGURATIONAL STATUS OF ALL NODES ***********/
router.get("/oper/all/status/:topology", async (req, res, next) => {
  let result = null;
  try {
    if (req.params.topology === "cli") {
      result = await http.get(odlOperURL + "/cli", authToken);
    } else {
      result = await http.get(odlOperURL + "/topology-netconf", authToken);
    }
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

router.get("/conf/all/status/:topology", async (req, res, next) => {
  let result = null;
  try {
    if (req.params.topology === "cli") {
      result = await http.get(odlConfigURL + "/cli", authToken);
    } else {
      result = await http.get(odlConfigURL + "/topology-netconf", authToken);
    }
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

router.get("/oper/registry/cli-devices", async (req, res, next) => {
  try {
    const result = await http.get(
      odlBaseURL +
        "/restconf/operational/cli-translate-registry:available-cli-device-translations/?depth=2",
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

/*********** UNICONFIG ***********/
router.get("/conf/uniconfig/:node", async (req, res, next) => {
  try {
    const result = await http.get(
      odlConfigURL +
        "/uniconfig/node/" +
        req.params.node +
        "/frinx-uniconfig-topology:configuration",
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

router.get("/oper/uniconfig/:node", async (req, res, next) => {
  try {
    const result = await http.get(
      odlOperURL +
        "/uniconfig/node/" +
        req.params.node +
        "/frinx-uniconfig-topology:configuration",
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

router.put("/conf/uniconfig/:node", async (req, res, next) => {
  try {
    const result = await http.put(
      odlConfigURL +
        "/uniconfig/node/" +
        req.params.node +
        "/frinx-uniconfig-topology:configuration",
      req.body,
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

/*********** SNAPSHOTS ***********/
router.get("/conf/snapshots/:node", async (req, res, next) => {
  try {
    const result = await http.get(
      odlBaseURL + "/restconf/config/network-topology:network-topology",
      authToken
    );
    let topologies = ["cli", "uniconfig", "topology-netconf", "unitopo"];
    let snapshots = result["network-topology"]["topology"].filter(
      topology =>
        topology["node"] &&
        topology["node"]["0"]["node-id"] === req.params.node &&
        !topologies.includes(topology["topology-id"])
    );

    res.status(200).send(snapshots);
  } catch (e) {
    next(e);
  }
});

router.get("/conf/snapshots/:name/:node", async (req, res, next) => {
  try {
    const result = await http.get(
      odlConfigURL +
        "/" +
        req.params.name +
        "/node/" +
        req.params.node +
        "/frinx-uniconfig-topology:configuration/",
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

router.post("/conf/snapshots/delete-snapshot", async (req, res, next) => {
  try {
    const result = await http.post(
      odlOperationsURL + "/snapshot-manager:delete-snapshot",
      req.body,
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

/*********** UNICONFIG NATIVE ***********/
router.put("/conf/native/whitelist/:node", async (req, res, next) => {
  try {
    const result = await http.put(
      odlBaseURL +
        "/restconf/config/direct-unit-matcher:direct-unit-matchers/direct-unit-matcher/" +
        req.params.node,
      req.body,
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

router.put("/conf/native/blacklist/:node", async (req, res, next) => {
  try {
    const result = await http.put(
      odlBaseURL +
        "/restconf/config/uniconfig-manager:blacklisted-reads/blacklisted-read/" +
        req.params.node,
      req.body,
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

/*********** OPERATIONS ON TARGET NODE ***********/
router.post("/operations/calculate-diff", async (req, res, next) => {
  try {
    const result = await http.post(
      odlOperationsURL + "/uniconfig-manager:calculate-diff",
      req.body,
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

router.post("/operations/dry-run", async (req, res, next) => {
  try {
    const result = await http.post(
      odlOperationsURL + "/dryrun-manager:dryrun-commit",
      req.body,
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

router.post("/operations/commit", async (req, res, next) => {
  try {
    const result = await http.post(
      odlOperationsURL + "/uniconfig-manager:commit",
      req.body,
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

router.post("/operations/create-snapshot", async (req, res, next) => {
  try {
    const result = await http.post(
      odlOperationsURL + "/snapshot-manager:create-snapshot",
      req.body,
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

router.post(
  "/operations/replace-config-with-operational",
  async (req, res, next) => {
    try {
      const result = await http.post(
        odlOperationsURL + "/uniconfig-manager:replace-config-with-operational",
        req.body,
        authToken
      );
      res.status(200).send(result);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/operations/replace-config-with-snapshot",
  async (req, res, next) => {
    try {
      const result = await http.post(
        odlOperationsURL + "/snapshot-manager:replace-config-with-snapshot",
        req.body,
        authToken
      );
      res.status(200).send(result);
    } catch (e) {
      next(e);
    }
  }
);

router.post("/operations/sync-from-network", async (req, res, next) => {
  try {
    const result = await http.post(
      odlOperationsURL + "/uniconfig-manager:sync-from-network",
      req.body,
      authToken
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
