# Empyry Helm Support

`@empyry/helm` is the official Helm support for Empyry, used as a simple example of Empyry's Plugin API capabilities.

This plugin mirrors [chartmuseum](https://github.com/helm/chartmuseum)'s API for uploading charts. That means you can POST `/api/charts` and `/api/prov` to upload charts and use [helm-push Plugin](https://github.com/chartmuseum/helm-push).
