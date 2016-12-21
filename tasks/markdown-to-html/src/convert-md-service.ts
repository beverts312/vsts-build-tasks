import request = require('request');

const uri = 'https://api.github.com/markdown';

const convertMdToHtml = (markdown: string): Promise<string> => {
    return new Promise<string>((resolve) => {
        request.post(uri,
            {
                headers: { 'User-Agent': 'beverts312' }, body: { text: markdown }, json: true
            }, (err, res, body) => {
                resolve(body);
            });
    });
};

export = convertMdToHtml;