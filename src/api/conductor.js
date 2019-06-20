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

router.post('/workflow/:workflowName', async (req, res, next) => {
    try {
        const result = await http.post(baseURLWorkflow + req.params.workflowName, req.body);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

router.get('/executions', async (req, res, next) => {
    try {

        let freeText = [];
        if (req.query.freeText !== '') {
            freeText.push(req.query.freeText);
        } else {
            freeText.push('*');
        }

        let h = '-1';
        if (req.query.h !== 'undefined' && req.query.h !== '') {
            h = req.query.h;
        }
        if (h !== '-1') {
            freeText.push('startTime:[now-' + h + 'h TO now]');
        }
        let start = 0;
        if (!isNaN(req.query.start)) {
            start = req.query.start;
        }

        let query = req.query.q;

        //TODO query wfs in batch of 100 for better performance
        const url = baseURLWorkflow + 'search?size=1000&sort=startTime:DESC&freeText=' + encodeURIComponent(freeText.join(' AND ')) + '&start=' + start + '&query=' +
            encodeURIComponent(query);
        const result = await http.get(url, req.token);
        const hits = result.results;
        res.status(200).send({ result: { hits: hits, totalHits: result.totalHits } });
    } catch (err) {
        next(err);
    }
});

router.delete('/bulk/terminate', async (req, res, next) => {
    try {
        const result = await http.delete(baseURLWorkflow + "bulk/terminate", req.body, req.token);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

router.put('/bulk/pause', async (req, res, next) => {
    try {
        const result = await http.put(baseURLWorkflow + "bulk/pause", req.body, req.token);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

router.put('/bulk/resume', async (req, res, next) => {
    try {
        const result = await http.put(baseURLWorkflow + "bulk/resume", req.body, req.token);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

router.post('/bulk/retry', async (req, res, next) => {
    try {
        const result = await http.post(baseURLWorkflow + "bulk/retry", req.body, req.token);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

router.post('/bulk/restart', async (req, res, next) => {
    try {
        const result = await http.post(baseURLWorkflow + "bulk/restart", req.body, req.token);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

router.delete('/workflow/:workflowId', async (req, res, next) => {
    try {
        const result = await http.delete(baseURLWorkflow + req.params.workflowId + '/remove', req.body, req.token);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

router.get('/id/:workflowId', async (req, res, next) => {
    try {
        const result = await http.get(baseURLWorkflow + req.params.workflowId + '?includeTasks=true', req.token);
        let meta = result.workflowDefinition;
        if (!meta) {
            meta = await http.get(
                baseURLMeta + 'workflow/' + result.workflowType + '?version=' + result.version,
                req.token
            );
        }
        res.status(200).send({ result, meta });
    } catch (err) {
        next(err);
    }
});



module.exports = router;
