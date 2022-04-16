import { OpenAPIBackend } from "openapi-backend";
import { Router } from "express";

import operations from "./operations/all.js";

const v1Router = Router();

const api = new OpenAPIBackend({
    definition: "./src/api/api-v1/empyry-v1.yaml",
});

api.register(operations);

api.init();

v1Router.use((req, res) => api.handleRequest(req, req, res));

export default v1Router;
