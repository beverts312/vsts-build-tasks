import tl = require('vsts-task-lib/task');
import fs = require('fs');

import convertMdFile = require('./convert-md-file');
import getMdFilesInDirectory = require('./get-md-files-in-directory');

const inputLocation = tl.getPathInput('inputLocation', false);
const outputLocation = tl.getPathInput('outputLocation', false);

const errors = [];

const getPath = (filePath: string): string => {
    const tmpPath = filePath.replace(inputLocation, outputLocation);
    return tmpPath.replace('md', 'html');
};

fs.mkdir(outputLocation, (err) => {
    getMdFilesInDirectory(inputLocation).then((files) => {
        let pending = files.length;
        if (!pending) {
            tl.debug('No md files in inputLocation');
            process.exit(0);
        }
        files.forEach((file) => {
            const outputPath = getPath(file);
            convertMdFile(file, outputPath).then(() => {
                tl.debug('Converted ' + file + ' output file at ' + outputPath);
                pending -= 1;
            }).catch((err) => {
                tl.error('Error converting ' + file);
                errors.push(err);
                pending -= 1;
            });
            while (pending < 0) {
                setTimeout(() => {
                    console.log('.');
                }, 1000);
            }
        });
    }).catch((err) => {
        tl.error('Failed to retrieve files in ' + inputLocation);
        tl.error(err);
        process.exit(1);
    });
});