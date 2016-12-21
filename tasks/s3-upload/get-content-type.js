function getContentType(extension) {
    switch(extension){
        case 'html': return 'text/html';
        case 'css': return 'text/css';
        case 'js': return 'application/javascript';
        case 'ts': return 'application/typescript';
        case 'gif': return 'image/gif';
        case 'jpg': return 'image/jpeg';
        case 'png': return 'image/png';
        default: return 'application/octet-stream';
    }
}

module.exports = getContentType;