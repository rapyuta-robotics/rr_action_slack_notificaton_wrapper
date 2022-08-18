const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const markup = require("markup-js");
const _ = require('lodash');

const contextNames = ['github', 'job', 'runner', 'strategy', 'matrix'];
const mappingFormat = /(.+?)="(.+?)"/;

const performAdHocReplacements = (replacements, data) => {
    let out = data;
    let map = new Map();
    let arr = replacements.split('\n');
    let regex = new RegExp(mappingFormat);
    arr.forEach((replacement) => {
        let match = regex.exec(replacement);
        if (match.length == 3) {
            map.set(`%${match[1]}`, match[2]);
        } else {
            core.warning(`Wrong format of ad-hoc replacement "${replacement}"`);
        }
    });
    map.forEach((key, val) => {
        out = out.replace(val, key);
    });
    return out;
}

const run = async () => {
    const context = {};
    const inputFile = core.getInput('template-input-path');
    const outputFile = core.getInput('template-output-path');
    contextNames.forEach(name => {
        try {
            let json = core.getInput(`${name}-context`);
            _.set(context, name, JSON.parse(json));
        } catch (error) {
            core.warning(`Unable to read ${name} context: ${error}`);
        }
    });
    let data = fs.readFileSync(path.resolve(inputFile), 'utf-8');
    data = data.replace(/\$\{\{/g, '{{');
    data = markup.up(data, context);
    let adHocReplacements = core.getInput('ad-hoc-replacements');
    if (adHocReplacements) {
        data = performAdHocReplacements(adHocReplacements, data);
    }
    fs.writeFileSync(path.resolve(outputFile), data);
    core.setOutput('template-output-path', outputFile);
}

run()
    .catch(err => {
        core.error(`Fatal: ${err}`);
        process.exit(1);
    });