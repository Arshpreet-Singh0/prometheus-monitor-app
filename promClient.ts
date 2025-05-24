import client from "prom-client";
import type { NextFunction, Request, Response } from "express";

const requestCounter = new client.Counter({
    name : "http_requests_total",
    help : "Total number of requests",
    labelNames : ["method", "route", "status_code"],
});

const activeRequestsGauge = new client.Gauge({
    name: 'active_requests',
    help: 'Number of active requests'
    // can add labels here as well
    // labelNames: ['method', 'route']
});

const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000] // Define your own buckets here
});



export const requestCounterMiddleware = async(req : Request, res : Response, next : NextFunction) => {
    if (req.path !== "/metrics") {
        activeRequestsGauge.inc();
    }
    const startTime = Date.now();
    res.on("finish", ()=>{
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`Request to ${req.path} took ${endTime - startTime}ms with method ${req.method}`);

        requestCounter.inc({
            method : req.method,
            route : req.route ? req.route.path : req.path,
            status_code : res.statusCode,
        });

        httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, duration);

        if (req.path !== "/metrics") {
            activeRequestsGauge.dec();
        }
    })

    next();
}

