module.exports = {
  apps: [
    {
      script: "./src/server/server.js",
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
        NODE_HELLO: "This is dev",
      },
    },
  ],
};
