import request = require('request');

const convertMdToHtml = (markdown: string): Promise<string> => {
    let uri = "https://api.github.com/markdown";
    return new Promise<string>((resolve) => {
        request.post(uri,
            {
                headers: { 'User-Agent': 'beverts312' }, body: { text: markdown }, json: true
            }, (err, res, body) => {
                resolve(body);
            });
    });
}

export = convertMdToHtml;