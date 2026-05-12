# 🚀 AWS EC2 Deployment Guide — AQI Dashboard

## Prerequisites
- AWS account (free tier eligible)
- Key pair (.pem file)
- This project pushed to GitHub

---

## Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Settings:
   - **Name**: aqi-dashboard
   - **AMI**: Ubuntu Server 24.04 LTS (free tier)
   - **Instance type**: t2.micro (free tier)
   - **Key pair**: Create or select existing (.pem)
   - **Security group rules**:
     - SSH (port 22) — Your IP
     - Custom TCP (port 5000) — 0.0.0.0/0

3. Click **Launch Instance**

---

## Step 2: Connect to Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```

---

## Step 3: Install Docker on EC2

```bash
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose-v2

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group (no sudo needed)
sudo usermod -aG docker ubuntu
newgrp docker

# Verify
docker --version
```

---

## Step 4: Install Node.js (for building React)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
```

---

## Step 5: Transfer Project to EC2

**Option A — Git (recommended):**
```bash
git clone https://github.com/YOUR_USERNAME/aqi-dashboard.git
cd aqi-dashboard
```

**Option B — SCP from local machine:**
```bash
# Run this on your LOCAL machine
scp -i your-key.pem -r ./aqi-dashboard ubuntu@<EC2-PUBLIC-IP>:~/
```

---

## Step 6: Build and Run

```bash
cd aqi-dashboard
chmod +x build.sh
./build.sh
```

---

## Step 7: Access Your App

Open browser: `http://<EC2-PUBLIC-IP>:5000`

---

## Step 8 (Optional): Push Image to ECR

```bash
# Install AWS CLI
sudo apt install -y awscli
aws configure  # Enter your access key, secret, region

# Create ECR repository
aws ecr create-repository --repository-name aqi-backend --region ap-south-1

# Get login token
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin \
  <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

# Tag and push
docker tag aqi-dashboard-backend:latest \
  <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/aqi-backend:latest

docker push <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/aqi-backend:latest

echo "✅ Image pushed to ECR!"
```

---

## Useful Commands

```bash
# View running containers
docker ps

# View logs
docker logs aqi-backend -f

# Stop everything
docker compose down

# Re-seed data
docker exec aqi-backend node seed/seed.js

# Restart
docker compose restart
```

---

## Architecture on AWS

```
Internet
    ↓
EC2 Instance (t2.micro, Ubuntu)
    ↓ port 5000
┌─────────────────────────────────┐
│  Docker Compose                 │
│  ┌──────────────────────────┐   │
│  │  container: aqi-backend  │   │
│  │  Express + React build   │   │
│  │  port 5000               │   │
│  └────────────┬─────────────┘   │
│               │ internal        │
│  ┌────────────▼─────────────┐   │
│  │  container: aqi-mongodb  │   │
│  │  MongoDB 7.0             │   │
│  │  port 27017 (internal)   │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```
