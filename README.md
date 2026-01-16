# Vulnerable Test Application

> **WARNING: This application contains INTENTIONAL security vulnerabilities.**
> **DO NOT deploy to production or use in any real environment.**

This repository is designed for testing the [Riskanator](https://github.com/divvi12/Riskanator) CVE Scanner.

## Purpose

This test application demonstrates various vulnerability types that Riskanator can detect:

### Dependency Vulnerabilities (SCA)
- **JavaScript/Node.js**: Outdated packages with known CVEs (lodash, axios, express, etc.)
- **Python**: Vulnerable packages (Django, Flask, requests, PyYAML, etc.)

### Code Vulnerabilities (SAST)
- SQL Injection
- Command Injection
- Path Traversal
- Cross-Site Scripting (XSS)
- Server-Side Template Injection (SSTI)
- Hardcoded Secrets
- Weak Cryptography
- Insecure Deserialization
- Open Redirects

### Container Vulnerabilities
- Outdated base image (Ubuntu 18.04)
- Running as root
- Exposed sensitive environment variables
- Unnecessary packages installed

### Infrastructure as Code (IaC)
- **Terraform**: Public S3 buckets, open security groups, unencrypted databases
- **Kubernetes**: Privileged containers, host path mounts, exposed secrets

## Vulnerability Count

This application is designed to trigger approximately:
- 20-30 dependency vulnerabilities (npm audit + pip-audit)
- 15-25 code vulnerabilities (Semgrep)
- 5-10 container issues (Trivy)
- 10-15 IaC misconfigurations (Checkov/tfsec)

## Usage with Riskanator

1. Start Riskanator (frontend + backend)
2. Click "Scan Repository"
3. Enter this repo URL: `https://github.com/divvi12/testAppRisk`
4. Complete the context wizard
5. View results on the dashboard

## Files Structure

```
testAppRisk/
├── package.json          # Vulnerable npm dependencies
├── requirements.txt      # Vulnerable Python packages
├── Dockerfile           # Insecure container configuration
├── src/
│   ├── index.js         # Vulnerable Node.js code
│   └── app.py           # Vulnerable Python code
├── config/
│   └── secrets.json     # Hardcoded secrets
├── terraform/
│   └── main.tf          # Insecure AWS resources
└── kubernetes/
    └── deployment.yaml  # Insecure K8s deployment
```

## Disclaimer

This code is provided for **educational and testing purposes only**. The vulnerabilities are intentional and should never be used as examples of good coding practices.
