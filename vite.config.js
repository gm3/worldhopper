// vite.config.js
import { defineConfig } from 'vite';

const isRepoDeployment = true; // Set this to true if you are deploying to https://<USERNAME>.github.io/<REPO>/
const repoName = 'REPO'; // Replace 'REPO' with your actual repository name

export default defineConfig({
  base: isRepoDeployment ? `/<REPO>/` : '/',
  // ... other configuration options
});