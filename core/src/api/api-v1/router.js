import { OpenAPIBackend } from "openapi-backend";
import { Router } from "express";
import tokenAuth from "./security/tokenAuth.js";

import operations from "./operations/all.js";

const v1Router = Router();

const api = new OpenAPIBackend({
    definition: "./src/api/api-v1/empyry-v1.yaml",
});

api.register(operations);

api.registerSecurityHandler("tokenAuth", tokenAuth);

api.init();

v1Router.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-API-Token"
    );

    next();
});

v1Router.use((req, res) => api.handleRequest(req, req, res));

export default v1Router;
