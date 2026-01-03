module.exports = {
  apps: [
    {
      name: "juliancarrillo-ssr",
      script: "dist/neurosurgeon-julian-carrillo/server/server.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    }
  ]
};
