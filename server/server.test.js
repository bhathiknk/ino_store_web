const request = require('supertest');
const express = require('express');

const app = express();

// This is a mock route for demonstration. Replace it with your actual routes.
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

describe('GET /', () => {
    it('responds with Hello World!', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello World!');
    });
});
