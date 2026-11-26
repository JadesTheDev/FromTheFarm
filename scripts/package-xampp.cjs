const fs=require('fs'),path=require('path');
// Keep PHP sources intact; replace only the generated interface assets.
fs.cpSync('build/static','php/static',{recursive:true});
fs.copyFileSync('build/index.html','php/app.html');
fs.copyFileSync('build/asset-manifest.json','php/asset-manifest.json');
console.log('Updated php/app.html and php/static from the existing React app.');
