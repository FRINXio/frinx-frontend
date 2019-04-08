const request = require('superagent');

function getUrl(path) {
    if (path.startsWith('http')) {
        return path;
    }
}

const HttpClient = {

    get: (path, token) =>
        new Promise((resolve, reject) => {
            const req = request.get(getUrl(path)).accept('application/json');
            if (token) {
                req.set('Authorization', token);
                console.log("test");
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
            const req = request.post(path, data).set('Content-Type', 'application/json');
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
};

exports.HttpClient = HttpClient;

