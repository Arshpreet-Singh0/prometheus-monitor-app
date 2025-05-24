import type { NextFunction, Request, Response } from "express";

export const monitorMiddleware = async(req : Request, res : Response, next : NextFunction) => {
    const start = Date.now();
    next();
    const end = Date.now();

    console.log(`Request to ${req.path} took ${end - start}ms with method ${req.method}`);
}