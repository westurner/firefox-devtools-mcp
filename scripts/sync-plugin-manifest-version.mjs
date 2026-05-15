#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJsonPath = resolve(root, 'package.json');
const pluginManifestPath = resolve(root, '.github', 'plugin', 'plugin.json');

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const pluginManifest = JSON.parse(readFileSync(pluginManifestPath, 'utf8'));

if (pluginManifest.version === packageJson.version) {
  console.log(`Plugin manifest version already synced: ${pluginManifest.version}`);
  process.exit(0);
}

pluginManifest.version = packageJson.version;
writeFileSync(pluginManifestPath, JSON.stringify(pluginManifest, null, 2) + '\n');
console.log(`Synced plugin manifest version to ${packageJson.version}`);
