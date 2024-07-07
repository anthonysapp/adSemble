const glob = require('glob');
const path = require('path');
const fs = require('fs');

const cwd = process.cwd();

async function rename(oldFolderName, newFolderName) {
  const files = glob.sync(`${cwd}/src/*/`, {
    ignore: ['./node_modules', `${cwd}/node_modules`, './build'],
  });

  files.forEach((file) => {
    let filePath = path.resolve(cwd, file);
    let newFilePath = ``;

    if (filePath.includes(oldFolderName)) {
      newFilePath = filePath.replace(oldFolderName, newFolderName);
      fs.renameSync(filePath, newFilePath);
      console.log(`Renamed: ${filePath} -> ${newFilePath}`);
    }
  });

  return Promise.resolve();
}

(async function () {
  // Check if both arguments are provided
  if (process.argv.length !== 4) {
    console.error('Usage: adsemble-rename <oldFolderName> <newFolderName>');
    process.exit(1);
  }

  // Get the arguments
  const oldFolderName = process.argv[2];
  const newFolderName = process.argv[3];

  console.log(
    chalk.black.bold.bgGreen(
      ` AdSemble Rename Utility:: Renaming ${oldFolderName} to ${newFolderName} in ./src...`
    )
  );
  await rename(oldFolderName, newFolderName);
  console.log(chalk.black.bold.bgGreen(' Renaming complete! '));
})();
