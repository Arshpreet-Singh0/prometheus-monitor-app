import express from 'express';
import client from "prom-client";
import { monitorMiddleware } from './middleware';
import { requestCounterMiddleware } from './promClient';
const app = express();


// app.use(monitorMiddleware);

app.use(requestCounterMiddleware);

app.get('/cpu', (req, res) => {
    for(let i=0; i < 100000; i++) {
        Math.random();
    }
    res.json({ message: 'CPU load generated' });
});


app.get('/metrics', async(req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})

app.listen(3000);