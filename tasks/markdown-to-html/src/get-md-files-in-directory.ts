import getFilesInDirectory = require('./get-files-in-directory');

const getMdFilesInDirectory = (path: string): Promise<string[]> => {
    const list = [];
    return new Promise<string[]>((resolve, reject) => {
        getFilesInDirectory(path).then((files) => {
            let pending = files.length;
            if (!pending) {
                resolve(files);
            }
            files.forEach((file) => {
                if (file.slice(-3) === '.md') {
                    list.push(file);
                }
                pending -= 1;
                if (!pending) {
                    resolve(list);
                }
            });
        }).catch((err) => {
            reject(err);
        });
    });
};

export = getMdFilesInDirectory;