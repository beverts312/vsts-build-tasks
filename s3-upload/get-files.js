var fs = require('fs');
var p = require('path');


function getFilesInDirectory(path, callback) {
  var list = [];
  fs.readdir(path, function(err, files) {
    if (err) {
      return callback(err);
    }
    var pending = files.length;
    if (!pending) {
      return callback(null, list);
    }
    files.forEach(function(file) {
      fs.lstat(p.join(path, file), function(_err, stats) {
        if (_err) {
          return callback(_err);
        }

        file = p.join(path, file);
        if (stats.isDirectory()) {
            getFilesInDirectory(file, function(__err, res) {
                if (__err) {
                    return callback(__err);
                 }
                 list = list.concat(res);
                 pending -= 1;
                 if (!pending) {
                    return callback(null, list)
                 }
            });
        } else {
          list.push(file);
          pending -= 1;
          if (!pending) {
            return callback(null, list);
          }
        }

      })
    })
  })
}

module.exports = getFilesInDirectory;