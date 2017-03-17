import test from 'ava';
import fetch from 'node-fetch';
import * as fs from 'fs';
import JSZip from 'jszip';
import unzipAll from '../helpers/unzip';
import rimraf from 'rimraf';

// Get H5P
test.cb.before(t => {
  const dest = fs.createWriteStream('./library.h5p');

  fetch('https://api.h5p.org/v1/content-types/H5P.InteractiveVideo')
    .then(res => res.body.pipe(dest));

  dest.on('close', () => {
    t.end();
  });
});

// Extract information from H5P
test.cb.before(t => {
  const data = fs.readFileSync('./library.h5p');
  const zip = new JSZip();
  zip.loadAsync(data)
    .then(data => unzipAll(data))
    .then(unzipped => t.end());
});

test.cb('Content type download should return a writable file', t => {
  fs.stat('./library.h5p', (err, stats) => {
    t.truthy(stats.isFile());
    t.end();
  })
});

test.cb('Content type download should return a valid extractable archive', t => {
  fs.stat('./library', (err, stats) => {
    t.truthy(stats.isDirectory());
    t.end();
  })
});

test.cb('Content type download should extract with a valid h5p.json', t => {
  fs.readFile('./library/h5p.json', 'utf8', (err, data) => {
    const json = JSON.parse(data.toString());
    t.truthy(json.mainLibrary === 'H5P.InteractiveVideo');
    t.end();
  })
});

// Clean up extracted files
test.cb.after(t => {
  rimraf('./library', () => {
    t.end();
  })
});

// Clean up H5P file
test.cb.after(t => {
  fs.unlink('./library.h5p', () => {
    t.end();
  });
});
