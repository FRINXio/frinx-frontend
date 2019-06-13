const Router = require('express');
const http = require('../server/HttpServerSide').HttpClient;

const router = new Router();
const baseURL = process.env.WF_SERVER;
const baseURLWorkflow = baseURL + 'workflow/';
const baseURLMeta = baseURL + 'metadata/';
const baseURLTask = baseURL + 'tasks/';

router.get('/metadata/taskdef', async (req, res, next) => {
    try {
        console.log(res);
        const result = await http.get(baseURLMeta + 'taskdefs', req.token);
        res.status(200).send({ result });
    } catch (err) {
        next(err);
    }
});

router.get('/metadata/workflow', async (req, res, next) => {
    try {
        const result = await http.get(baseURLMeta + 'workflow', req.token);
        res.status(200).send({ result });
    } catch (err) {
        next(err);
    }
});

router.get('/metadata/workflow/:name/:version', async (req, res, next) => {
    try {
        const result = await http.get(
            baseURLMeta + 'workflow/' + req.params.name + '?version=' + req.params.version,
            req.token
        );
        res.status(200).send({ result });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
