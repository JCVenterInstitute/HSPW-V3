# HSPW

This repo contains all things HSP related.

## Local Development

### HSPW Frontend

- Run `npm i` in HSPW-V3 root folder to install required packages
- Run `npm run dev` in HSPW-V3 root folder to start the application on `localhost:3000`

### HSPW Backend

- Route to `./src/server` folder
- Run `npm i` to install required packages
- Run `npm run dev` to start the server on `localhost:8000`

## Deployment

- `ssh` to the ec2 instance
- Install git on ec2 instance using command `sudo yum install git -y`
- Install pip & mkdocs for documentation using command:
  - `sudo yum install python3-pip -y`
  - `pip install mkdocs`
  - `pip install markupsafe==2.0.1`
    - Needed to fix an import issue when running `mkdocs build`
- Make sure `node` is installed in the ec2 instance, substitute the command `nvm install 18.15.0` (Instruction: [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html))
- Make sure `pm2` is installed in the ec2 instance (Instruction: [here](https://pm2.keymetrics.io/))
- Clone the repo
- `cd` into `HSPW-V3` folder
- Frontend
  - Run `npm i` in HSPW-V3 root folder to install required packages
- Backend
  - `cd` into `./HSPW-V3/src/server`
  - Run `npm i` to install required packages
- `cd` back to HSPW-V3 root folder
- Build the static frontend file by running
  - DEV
    - Run `npm run build:dev`
    - Run `pm2 start ecosystem.config.js --env dev`
  - PROD
    - Run `npm run build:prod`
    - Run `pm2 start ecosystem.config.js --env prod`
- Build static documentation site
  - Navigate to documentation directory
    - Run: `npm run build`

### To restart, reload, stop, or delete the server

- `pm2 restart hspw`
- `pm2 reload hspw`
- `pm2 stop hspw`
- `pm2 delete hspw`

### Check log

- Run `pm2 logs`

### To edit the environment

#### Frontend

- Local
  - Edit `.env.local`
- DEV
  - Edit `.env.development`
- PROD
  - Edit `.env.production`

#### Backend

- Local
  - `cd` into `./src/server`
  - Edit `.env`
- DEV
  - Edit `env_dev` section in `ecosystem.config.js`
- PROD
  - Edit `end_prod` section in `ecosystem.config.js`

### Documentation Deployment

In documentation directory:

- Navigate to `./documentation`
- Run `mkdocs build`
  - This will create a static build for the documentation in `./src/server/site`
