module.exports = {
  apps: [
    {
      name: "hspw",
      script: "./src/server.js",
      env_production: {
        NODE_ENV: "prod",
      },
      env_development: {
        NODE_ENV: "dev",
      },
    },
  ],
};
