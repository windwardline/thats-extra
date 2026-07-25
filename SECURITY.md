# Security Policy

## Reporting a Vulnerability

Do not disclose suspected vulnerabilities or exploit details in a public
issue or pull request.

Use this repository's private vulnerability-reporting workflow (Security →
Report a vulnerability). Include the affected component, reproduction steps,
observed and expected behavior, and potential impact. Do not include real
user data or active credentials.

You should receive a reply within 72 hours.

## Scope

- This repository and the deployment at https://thats-extra.windwardline.com
- Security-relevant surfaces: the `POST /api/generate` route (input
  validation, upstream API key handling) and secret handling in CI.
