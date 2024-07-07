const glob = require('glob');
const path = require('path');
const fs = require('fs');

// Check if both arguments are provided
if (process.argv.length !== 4) {
  console.error('Usage: adsemble-rename <oldFolderName> <newFolderName>');
  process.exit(1);
}

// Get the arguments
const oldFolderName = process.argv[2];
const newFolderName = process.argv[3];

const files = glob.sync('./*/', {
  ignore: ['./node_modules', `${process.cwd()}/node_modules`, './build'],
});

files.forEach((file) => {
  let filePath = path.resolve(process.cwd(), file);
  let newFilePath = ``;

  if (filePath.includes(oldFolderName)) {
    newFilePath = filePath.replace(oldFolderName, newFolderName);
    fs.renameSync(filePath, newFilePath);
    console.log(`Renamed: ${filePath} -> ${newFilePath}`);
  }
});
