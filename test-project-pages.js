#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {
  DEFAULT_OG_IMAGE,
  SITE_URL,
  escapeHtml,
  projectMetadata,
  validateProjects
} = require("./generate-project-pages.js");

const root = __dirname;
const enProjects = JSON.parse(fs.readFileSync(path.join(root, "projects/projects.json"), "utf8"));
const frProjects = JSON.parse(fs.readFileSync(path.join(root, "projects/projects.fr.json"), "utf8"));

validateProjects(enProjects, "English projects");
validateProjects(frProjects, "French projects");
assert.deepStrictEqual(frProjects.map(({ id }) => id), enProjects.map(({ id }) => id));

for (const project of enProjects) {
  assert.strictEqual(typeof project.ogImage, "string", `${project.id} needs an ogImage`);
  assert.ok(project.ogImage.startsWith("/"), `${project.id} ogImage must be root-relative`);
  assert.ok(fs.existsSync(path.join(root, project.ogImage)), `${project.id} ogImage does not exist`);
}

function rawProjectHtml(language, id) {
  const prefix = language === "fr" ? "fr/projects" : "projects";
  return fs.readFileSync(path.join(root, prefix, id, "index.html"), "utf8");
}

const fileDropHtml = rawProjectHtml("en", "filedrop");
const remHtml = rawProjectHtml("en", "rem-ai");
const frenchFileDropHtml = rawProjectHtml("fr", "filedrop");
const expectedFileDropDownloads = [
  "https://github.com/rmimpact/FileDrop/releases/download/filedrop-v1.0.1/FileDrop_1.0.1_darwin_universal.dmg",
  "https://github.com/rmimpact/FileDrop/releases/download/filedrop-v1.0.1/FileDrop_1.0.1_windows_x64-setup.exe"
];
const englishFileDrop = enProjects.find(({ id }) => id === "filedrop");
const frenchFileDrop = frProjects.find(({ id }) => id === "filedrop");

assert.ok(fileDropHtml.includes('<meta property="og:title" content="FileDrop — Remy Moscovitz">'));
assert.ok(fileDropHtml.includes('<meta property="og:image" content="https://remymoscovitz.com/media/projects/filedrop-banner.png">'));
assert.ok(fileDropHtml.includes('<script src="/script.js?v=20260901-1" defer></script>'));
assert.ok(remHtml.includes('<meta property="og:title" content="REM — Remy Moscovitz">'));
assert.ok(remHtml.includes('<meta property="og:image" content="https://remymoscovitz.com/media/projects/rem-ai/Rem_Banner.png">'));
assert.notStrictEqual(fileDropHtml.match(/<meta property="og:image" content="([^"]+)">/)[1], remHtml.match(/<meta property="og:image" content="([^"]+)">/)[1]);
assert.ok(frenchFileDropHtml.includes("Un outil pour partager des fichiers entre des Mac et des PC Windows"));
assert.deepStrictEqual(englishFileDrop.links.slice(0, 2).map(({ url }) => url), expectedFileDropDownloads);
assert.deepStrictEqual(frenchFileDrop.links.slice(0, 2).map(({ url }) => url), expectedFileDropDownloads);
assert.ok(!JSON.stringify([englishFileDrop, frenchFileDrop]).includes("filedrop-v1.0.0"));

const fallback = projectMetadata({ title: "Fallback project" }, "/projects/fallback-project/");
assert.strictEqual(fallback.image, `${SITE_URL}${DEFAULT_OG_IMAGE}`);
assert.ok(fallback.description.length > 0);
assert.strictEqual(escapeHtml('Quotes " & <tags>'), "Quotes &quot; &amp; &lt;tags&gt;");
assert.throws(() => validateProjects([{ id: "../unsafe" }], "unsafe test"), /unsafe project id/);

for (const html of [fileDropHtml, remHtml, frenchFileDropHtml]) {
  assert.ok(!/undefined|null|\[object Object\]/.test(html));
}

console.log("Project social metadata tests passed.");
