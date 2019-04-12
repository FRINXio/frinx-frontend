const request = require('superagent');

function getUrl(path) {
    if (path.startsWith('http')) {
        return path;
    }
    return process.env.REACT_APP_WEBSITE_HOSTNAME
        ? `http://${process.env.REACT_APP_WEBSITE_HOSTNAME}${path}`
        : `http://localhost:${process.env.REACT_APP_PORT}${path}`;
}


const HttpClient = {

    get: (path, token) =>
        new Promise((resolve, reject) => {
            console.log(path);

            const req = request.get(getUrl(path)).accept('application/json');
            if (token) {
                req.set('Authorization', token);
                console.log(getUrl(path));
            }
            req.end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.body);
                }
            });
        }),

    delete: (path, token) =>
        new Promise((resolve, reject) => {
            console.log(path);

            const req = request.delete(path).accept('application/json');
            if (token) {
                req.set('Authorization', token);
                console.log(getUrl(path));
            }
            req.end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.body);
                }
            });
        }),

    post: (path, data, token) =>
        new Promise((resolve, reject) => {
            const req = request.post(getUrl(path), data).set('Content-Type', 'application/json');
            if (token) {
                req.set('Authorization', token);
            }
            req.end((err, res) => {
                if (err || !res.ok) {
                    console.error('Error on post! ' + res);
                    reject(err);
                } else {
                    if (res) {
                        resolve(res);
                    }
                }
            });
        }),

    put: (path, data, token) =>
        new Promise((resolve, reject) => {

            const req = request.put(path, data).set('Accept', 'application/json');
            if (token) {
                req.set('Authorization', token);
            }
            req.end((err, res) => {
                if (err || !res.ok) {
                    console.error('Error on post! ' + res);
                    reject(err);
                } else {
                    if (res.body) {
                        resolve(res.body);
                    } else {
                        resolve(res);
                    }
                }
            });
        }),
};

exports.HttpClient = HttpClient;

