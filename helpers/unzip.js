const fs = require('fs');
const mkdirp = require('mkdirp');

/**
 * Base directory that files from the archive will be extracted to
 *
 * @type {string}
 */
const basePath = './library';

/**
 * The files that will be extracted from an archive
 *
 * @type {Array}
 */
const extractFiles = [
  'h5p.json'
];

/**
 * Unzip all files from zip archive that are named in the extractFiles archive
 *
 * @param zip
 * @return {Promise.<*>}
 */
module.exports = function unzipAll(zip) {
  const toBeUnzipped = Object.keys(zip.files)
    .filter(file => extractFiles.includes(file))
    .map(file => unzipFile(file, zip));

  return Promise.all(toBeUnzipped);
};

/**
 * Unzips a single file from the zip object with a given file path
 *
 * @param filePath Path of file within zip
 * @param zip Zip object read from an archive
 * @return {Promise} Resolves when file has been unzipped
 */
function unzipFile(filePath, zip) {
  const dirs = filePath.split('/').slice(0, -1).join('/');
  mkdirp.sync(`${basePath}/${dirs}`);

  // Create file
  return new Promise(resolve => {
    const fileData = zip.file(filePath).nodeStream();
    const write = fs.createWriteStream(`${basePath}/${filePath}`);

    write.on('close', () => {
      resolve(filePath);
    });

    write.on('open', () => {
      fileData.pipe(write);
    });
  });
}
