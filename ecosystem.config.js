module.exports = {
  apps: [
    {
      script: "./src/server/server.js",
      instances: "max",
      exec_mode: "cluster",
      env_dev: {
        NODE_ENV: "dev",
        SMTP_USER: "/CONTACT/USER",
        SMTP_PASSWORD: "/CONTACT/PASSWORD",
        RECAPTCHA_SECRET_KEY: "/RECAPTCHA/SECRET_KEY",
        DIFFERENTIAL_S3_BUCKET: "hspw-data-dev-v2",
        R_SCRIPT_PATH: "/home/ec2-user/r4test1/test",
      },
      env_prod: {
        NODE_ENV: "prod",
      },
    },
  ],
};
