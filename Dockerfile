# VULNERABLE DOCKERFILE
# WARNING: Contains intentional security issues for testing

# VULNERABILITY: Using outdated base image with known CVEs
FROM ubuntu:18.04

# VULNERABILITY: Running as root
USER root

# VULNERABILITY: Installing packages without version pinning
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    nodejs \
    npm \
    curl \
    wget \
    netcat \
    telnet \
    && rm -rf /var/lib/apt/lists/*

# VULNERABILITY: Exposing sensitive info in environment variables
ENV DATABASE_PASSWORD=admin123
ENV API_KEY=FAKE_API_KEY_supersecret123
ENV AWS_ACCESS_KEY_ID=FAKE_AKIAIOSFODNN7EXAMPLE
ENV AWS_SECRET_ACCESS_KEY=FAKE_wJalrXUtnFEMI_K7MDENG

# VULNERABILITY: Copying secrets into image
COPY config/secrets.json /app/secrets.json
COPY .env /app/.env

WORKDIR /app

# VULNERABILITY: Installing dependencies as root
COPY package.json requirements.txt ./
RUN npm install
RUN pip3 install -r requirements.txt

COPY . .

# VULNERABILITY: Exposing unnecessary ports
EXPOSE 22 3000 5000 8080 9090

# VULNERABILITY: Running application as root
CMD ["npm", "start"]
