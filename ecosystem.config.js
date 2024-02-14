module.exports = {
  apps: [
    {
      script: "./src/server/server.js",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
