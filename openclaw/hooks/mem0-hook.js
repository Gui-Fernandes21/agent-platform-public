const http = require('http');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 8888,
      path,
      method,
      headers: { 'Content-Type': 'application/json', ...(data && { 'Content-Length': Buffer.byteLength(data) }) }
    };
    const req = http.request(options, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve(JSON.parse(raw)));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

module.exports = {
  async beforeMessage({ message, userId = process.env.MEM0_USER_ID || 'default' }) {
    try {
      const result = await request('POST', '/search', { query: message, user_id: userId });
      const memories = result.results?.map(r => r.memory).join('\n') || '';
      if (memories) return { context: `Relevant memories about user:\n${memories}` };
    } catch (e) {}
  },

  async afterMessage({ message, userId = process.env.MEM0_USER_ID || 'default' }) {
    try {
      await request('POST', '/memories', {
        messages: [{ role: 'user', content: message }],
        user_id: userId
      });
    } catch (e) {}
  }
};
