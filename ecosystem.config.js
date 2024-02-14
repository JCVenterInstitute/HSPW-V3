module.exports = {
  apps: [
    {
      name: "hspw",
      script: "./src/server/server.js",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
