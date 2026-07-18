import '@testing-library/jest-dom';

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new Map(Object.entries(init?.headers || {}));
      this.headers.get = (key) => {
        const lowerKey = key.toLowerCase();
        for (const [k, v] of this.headers.entries()) {
          if (k.toLowerCase() === lowerKey) return v;
        }
        return null;
      };
    }
    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
    }
  };
}
