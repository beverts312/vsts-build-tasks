import fs = require('fs');
import mkdirp = require('mkdirp');

import convertMdService = require('./convert-md-service');

const mkFilePromise = (path: string, data: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        fs.writeFile(path, JSON.stringify(data), (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}

const convertMdFile = (path: string, outputPath: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        fs.readFile(path, '', (err, mdText) => {
            if (err) {
                reject(err);
            }
            else {
                convertMdService(mdText.toString()).then((htmlText) => {
                    let outputDir = outputPath.replace(outputPath.split('/')[outputPath.split('/').length - 1], '');
                    if (fs.existsSync(outputDir) != true) {
                        mkdirp(outputDir, (err, made) => {
                            if (err) {
                                reject(err)
                            }
                            else {
                                mkFilePromise(outputPath, htmlText).then((res) => { resolve(res) })
                                    .catch((res) => { reject(res) });
                            }
                        });
                    }
                    else {
                        mkFilePromise(outputPath, htmlText).then((res) => { resolve(res) })
                            .catch((res) => { reject(res) });
                    }
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    });
};

export = convertMdFile;