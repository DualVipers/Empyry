# Quick Start

## Installing

### Docker

Empyry's container is currently hosted on Docker Hub.

```bash
docker pull dualvs/empyry:latest

docker run -it \
    -p 9000:9000 \
    --name empyry \
    -v EmpyryData:/root/.local/share/Empyry \
    -v EmpyryConfig:/root/.config/Empyry \
    -v EmpyryLogs:/root/.local/state/Empyry \
    dualvs/empyry initiate
```

This creates a container to hold an Empyry instance. The command `initiate` automatically migrates the database before starting Empyry.

## Setting Up

At the moment, only helm (read its documentation [here](managers/helm.md)) is supported.

First, go to `http://swagger.localhost:9000` and set the url as `http://api.localhost:9000/v1/api-docs`.
Open the option to POST `/plugins` and execute with the body:

```json
{
    "name": "@empyry/helm",
    "type": "npm",
    "location": "https://registry.npmjs.org",
    "version": "0.1.0"
}
```

Once you restart the server, a fully working helm server will be on `helm.localhost:9000`.
You can also use `swagger.localhost:9000` to look inside the brain of Empyry.
