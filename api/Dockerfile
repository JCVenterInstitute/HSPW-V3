# Install dependencies only when needed
FROM public.ecr.aws/lambda/nodejs:16 

RUN npm install -g npm@8.19.2

# Install dependencies based on the preferred package manager
COPY package.json lambda.js server.js package-lock.json ./
COPY . .
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ENV NEXT_TELEMETRY_DISABLED 1  
# ENV NODE_ENV production
# ENV DEPLOY_ENV DEV

RUN npm install


RUN ls -l 
RUN pwd
CMD ["lambda.handler"]