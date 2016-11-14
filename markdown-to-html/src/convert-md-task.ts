import tl = require('vsts-task-lib/task');
import path = require('path');
import fs = require('fs');

import convertMdFile = require('./convert-md-file');
import getMdFilesInDirectory = require('./get-md-files-in-directory');

let inputLocation = tl.getPathInput('inputLocation', false);
let outputLocation = tl.getPathInput('outputLocation', false);

let errors = [];

const getPath = (filePath: string): string => {
    let tmpPath = filePath.replace(inputLocation, outputLocation);
    let newPath = tmpPath.replace('md', 'html');
    return newPath;
};

const finishTask = () => {
    if (errors.length != 0) {
        tl.error('Errors occured converting ' + errors.length + ' files');
        tl.debug(JSON.stringify(errors));
        tl.exit(1);
    }
    else {
        tl.debug('Successfully finished converting files');
        tl.exit(0);
    }
};

fs.mkdir(outputLocation, (err) => {
    getMdFilesInDirectory(inputLocation).then((files) => {
        let pending = files.length
        if (!pending) {
            tl.debug('No md files in inputLocation');
            tl.exit(0);
        }
        files.forEach((file) => {
            let outputPath = getPath(file);
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
        tl.exit(1);
    });
});