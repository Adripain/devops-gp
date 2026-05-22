const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { createApp } = require('../src/app');

test('GET /health returns ok', async () => {
  const response = await request(createApp()).get('/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
});
