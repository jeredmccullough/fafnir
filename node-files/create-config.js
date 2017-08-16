import glob from 'glob';
import yaml from 'js-yaml';
import _ from  'lodash';
import fs from  'fs';
// import matter from  'gray-matter';

const tmpPath = 'node-files/tmp';

function rmrfSync(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(file => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        rmrfSync(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function getVariants(partner) {
  return new Promise((res, rej) => {
    glob(`partners/${partner}/archetypes/*.md`, (err, files) => {
      err && rej(err);
      files = _.map(files, file => file.replace(`partners/${partner}/archetypes/`, '').replace('.md', ''));
      res(files);
    });
  });
}

fs.readFile(`partners/${process.env.PARTNER}/config.yml`, 'utf8', (err, file) => {
  const entry = yaml.safeLoad(file);

  getVariants(entry.partner).then(templates => {
    entry.templates = templates;
    const vals = JSON.stringify(entry);
    rmrfSync(tmpPath);
    fs.mkdirSync(tmpPath);
    fs.writeFileSync(`${tmpPath}/partner.js`, `export default ${vals}`, 'utf8');
  });
});
