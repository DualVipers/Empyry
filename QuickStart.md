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

## Creating Your First Regular User

By default, Empyry creates an admin User only. While an admin User can be used to cover all functionality, using a regular User for daily use is recommended for security.

First, go to `http://swagger.localhost:9000` and set the url as `http://api.localhost:9000/v1/api-docs`. Now, open the option to POST `/users`. Execute with this body, replacing the username, email, and password with your choices:

```json
{
    "username": "<YOUR_EMAIL>",
    "password": "<YOUR_PASSWORD>",
    "email": "<YOU_EMAIL>"
}
```

It will return the new `User`'s object. Make sure to remember the id of the new `User`.

## Setting Up

At the moment, only helm (read its documentation [here](managers/helm.md)) is supported.

Revisit the page you used to create the first regular user. Open the option to POST `/plugins` and execute with the body:

```json
{
    "name": "@empyry/helm",
    "type": "npm",
    "location": "https://registry.npmjs.org",
    "version": "0.1.0"
}
```

Once you restart the server, a fully working helm server will be on `helm.localhost:9000`.
You can also continue to use `swagger.localhost:9000` to look inside the brain of Empyry.

## Creating and Pushing a Helm Chart

To quickly create a Helm Chart, create a new dir and run `helm create mychart`. If you do not have helm. download it [here](https://helm.sh/docs/intro/install/).

To add our server to Helm, run `helm repo add empyry http://helm.localhost:9000 --username <your_username> --password <your_password>` replacing `<your_username>` and `<your_password>` with the User's you created earlier.

Now, we can push the chart using the helm-push plugin. Download it by running `helm plugin install https://github.com/chartmuseum/helm-push`.

Run `helm cm-push mychart/ empyry`. Now, if you GET `/packages`, you will see `mychart` has been added to the server!
