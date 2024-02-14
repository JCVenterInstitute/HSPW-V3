module.exports = {
  apps: [
    {
      script: "./src/server/server.js",
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "prod",
      },
      env_development: {
        NODE_ENV: "dev",
      },
    },
  ],
};
