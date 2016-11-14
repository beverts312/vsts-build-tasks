var mkdir = require('./src/mkdir');

mkdir('C:\dev\vsts-extensions\dance\now').catch((err)=>{
    console.log(err);
});