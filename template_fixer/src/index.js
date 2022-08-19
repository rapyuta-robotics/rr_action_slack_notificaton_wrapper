const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const mappingFormat = /(.+?)="(.+?)"/;

const run = async () => {
    const inputFile = core.getInput('template-input-path');
    const outputFile = core.getInput('template-output-path');
    const replacements = core.getInput('replacements');
    let data = fs.readFileSync(path.resolve(inputFile), 'utf-8');
    let map = new Map();
    let regex = new RegExp(mappingFormat);
    replacements.split('\n').forEach((replacement) => {
        let match = regex.exec(replacement);
        if (match && match.length == 3) {
            map.set(`%${match[1]}`, match[2]);
        } else {
            core.warning(`Wrong format of replacement "${replacement}"`);
        }
    });
    let out = data;
    map.forEach((key, val) => {
        out = out.replaceAll(val, key);
    });
    fs.writeFileSync(path.resolve(outputFile), out);
    core.setOutput('template-output-path', outputFile);
}

run()
    .catch(err => {
        core.error(`Fatal: ${err}`);
        process.exit(1);
    });