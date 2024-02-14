module.exports = {
  apps: [
    {
      name: "hspw",
      script: "./src/server/server.js",
      instances: "2",
      exec_mode: "cluster",
      env_dev: {
        SMTP_USER: "/CONTACT/USER",
        SMTP_PASSWORD: "/CONTACT/PASSWORD",
        RECAPTCHA_SECRET_KEY: "/RECAPTCHA/SECRET_KEY",
        DIFFERENTIAL_S3_BUCKET: "hspw-data-dev-v2",
        R_SCRIPT_PATH: "/home/ec2-user/r4test1/test",
        CONTACT_TABLE: "hspw-dev-contact-detail",
      },
      env_prod: {
        SMTP_USER: "/CONTACT/USER",
        SMTP_PASSWORD: "/CONTACT/PASSWORD",
        RECAPTCHA_SECRET_KEY: "/RECAPTCHA/SECRET_KEY",
        DIFFERENTIAL_S3_BUCKET: "hspw-data-prod-v2",
        R_SCRIPT_PATH: "/home/ec2-user/r4test1/test",
        CONTACT_TABLE: "hspw-prod-contact-detail",
      },
    },
  ],
};
