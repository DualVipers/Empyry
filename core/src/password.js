import { hash as argon2hash, verify as argon2verify } from "argon2";

export const hash = (password) => argon2hash(password, {});

export const verify = (hash, guess) => argon2verify(hash, guess);
