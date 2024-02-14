module.exports = {
  apps: [
    {
      script: "./src/server/server.js",
      instances: "max",
      exec_mode: "cluster",
      env_dev: {
        NODE_ENV: "dev",
      },
      env_prod: {
        NODE_ENV: "prod",
      },
    },
  ],
};
