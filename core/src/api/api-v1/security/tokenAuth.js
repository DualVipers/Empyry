import { Token } from "../../../database.js";

export default async (c, req) => {
    const authToken = req.headers["x-api-token"];

    if (!authToken) {
        throw new Error("Missing authorization header");
    }

    const token = await Token.query()
        .findOne("token", authToken)
        .select("user_id", "admin");

    if (!token) {
        return false;
    }

    req.user = token.user_id;
    req.admin = token.admin;

    return true;
};
