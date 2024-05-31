#!/usr/bin/env node
process.env.NODE_ENV = "development";
process.env.PARCEL_AUTOINSTALL = "false";
const wd = process.cwd().toString();
process.env.PROJECT_DIR = wd;
const chalk = require("chalk");
const path = require("path");
const watch = require("glob-watcher");
const Bundler = require("parcel-bundler");
const cmd = require("node-cmd");
const opn = require("opn");
const Promise = require("bluebird").Promise;
const glob = require("glob");
const fs = require("fs-extra");

const generateFrontMatter = require("./generateFrontMatter");
const generateIndex = require("./generateIndex");
const generateAssetCss = require("./generateAssetCss");
const setup = require("./setup");

const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });
process.chdir(__dirname);

const bundles = [
  `${wd}/src/**/index.hbs`,
  `${wd}/src/**/sprite-*.png`,
  `!${wd}/src/**/sprite/*`,
];

const bundler = new Bundler(bundles, {
  cache: false,
  detailedReport: true,
  autoInstall: false,
  outDir: `${wd}/dist`,
  hmr: true,
});

let regenTimeout = {};
let reloadTimeout;

async function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function correctWindowsFilePaths() {
  const outDir = path.resolve(wd, `./dist`);
  const pattern = path.join(outDir, "**/*.css");
  const files = glob.sync(pattern);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const contents = fs.readFileSync(file, "utf-8");
    const newContents = contents.replace(/\\/g, "/");
    await fs.writeFileSync(file, newContents);
  }
}

bundler.on("bundled", async (bundle) => {
  try {
    console.log(chalk.yellow.bold("info"), "generating dev index file...");
    await generateIndex();
    console.log(chalk.green.bold("success"), "index file generated!");
    await correctWindowsFilePaths();
    console.log(chalk.green.bold("success"), "windows file paths corrected!");
  } catch (e) {
    console.log(chalk.red.bold("error"), "error generating dev index file");
    console.log(e);
  }
});

async function run() {
  await bundler.serve(3000, false);
  runWatcher(bundler);
  opn("http://localhost:3000/index.html");
}

async function regenerateAssetCss(filepath) {
  const spriteFolderPath = path.dirname(filepath);
  const bannerFolderPath = path.dirname(spriteFolderPath);
  generateAssetCss(`${bannerFolderPath}/`);
  clearTimeout(regenTimeout[bannerFolderPath]);
  regenTimeout[filepath] = null;
}

function regen(msg, filepath) {
  console.warn(chalk.yellow.bold("info"), msg, filepath);
  const spriteFolderPath = path.dirname(filepath);
  const bannerFolderPath = path.dirname(spriteFolderPath);
  if (regenTimeout[bannerFolderPath]) {
    clearTimeout(regenTimeout[bannerFolderPath]);
  }
  regenTimeout[bannerFolderPath] = setTimeout(() => {
    regenerateAssetCss(filepath);
  }, 300);
}

function runWatcher(bundler) {
  const watchPath = path
    .resolve(wd, `./src/*/img/*.{png,gif,jpg,svg}`)
    .replace(/\\/g, "/");
  const watcher = watch([watchPath]);
  watcher.on("add", (file) => {
    if (file.indexOf("sprite-") === -1) {
      regen("image added", file);
      return;
    }
    reloadBrowsers(bundler);
  });

  watcher.on("change", (file) => {
    if (file.indexOf("sprite-") === -1) {
      regen("image changed", file);
      return;
    }
    reloadBrowsers(bundler);
  });

  watcher.on("unlink", (file) => {
    if (file.indexOf("sprite-") === -1) {
      regen("image removed", file);
      return;
    }
    reloadBrowsers(bundler);
  });

  const spriteWatchPath = path
    .resolve(wd, `./src/*/sprite/*.{png,gif,jpg}`)
    .replace(/\\/g, "/");
  const spriteWatcher = watch([spriteWatchPath]);
  spriteWatcher.on("add", (filepath) => {
    regen("sprite image added", filepath);
  });
  spriteWatcher.on("change", (filepath) => {
    regen("sprite image changed", filepath);
  });
  spriteWatcher.on("unlink", (filepath) => {
    regen("sprite image removed", filepath);
  });
}

function reloadBrowsers(bundler) {
  clearTimeout(reloadTimeout);
  reloadTimeout = setTimeout(() => {
    try {
      bundler.hmr.broadcast({
        type: "reload",
      });
    } catch (e) {
      console.log(chalk.red.bold("error reloading"), e);
    }
  }, 500);
}

(async function () {
  const rootDir = wd;
  const cacheDir = `${rootDir}/.cache`;
  const distDir = `${rootDir}/dist`;

  await getAsync(`rm -r ${cacheDir} || true && rm -r ${distDir} || true`);
  await setup();
  await generateFrontMatter();
  await generateAssetCss();

  run();
})();
