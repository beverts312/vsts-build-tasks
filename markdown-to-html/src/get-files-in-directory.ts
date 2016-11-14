import fs = require('fs');
import p = require('path');


const getFilesInDirectory = (path): Promise<string[]> => {
    let list = [];
    return new Promise<string[]>((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
            }
            let pending = files.length;
            if (!pending) {
                resolve(list);
            }
            files.forEach((file) => {
                fs.lstat(p.join(path, file), (err, stats) => {
                    if (err) {
                        reject(err);
                    }
                    file = p.join(path, file);
                    if (stats.isDirectory()) {
                        getFilesInDirectory(file).then((res) => {
                            list = list.concat(res);
                            pending -= 1;
                            if (!pending) {
                                resolve(list);
                            }
                        }).catch((err) => {
                            reject(err);
                        })
                    }
                    else {
                        list.push(file);
                        pending -= 1;
                        if (!pending) {
                            resolve(list);
                        }
                    }
                });
            });
        });
    });
}

export = getFilesInDirectory;