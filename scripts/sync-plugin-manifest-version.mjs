#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJsonPath = resolve(root, 'package.json');
const pluginManifestPath = resolve(root, '.github', 'plugin', 'plugin.json');

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Failed to read or parse JSON at ${filePath}: ${error.message}`);
    process.exit(1);
  }
}

const packageJson = readJson(packageJsonPath);
const pluginManifest = readJson(pluginManifestPath);
const version = packageJson.version;

if (typeof version !== 'string' || version.trim() === '') {
  console.error(`Invalid package.json version: ${version}`);
  process.exit(1);
}

if (pluginManifest.version === version) {
  console.log(`Plugin manifest version already synced: ${pluginManifest.version}`);
  process.exit(0);
}

pluginManifest.version = version;
try {
  writeFileSync(pluginManifestPath, JSON.stringify(pluginManifest, null, 2) + '\n');
} catch (error) {
  console.error(`Failed to write plugin manifest at ${pluginManifestPath}: ${error.message}`);
  process.exit(1);
}
console.log(`Synced plugin manifest version to ${version}`);
