const axios = jest.genMockFromModule('axios');
const defaultResponse = { data: {} };

axios.doMockReset = () => {
  Object.assign(axios, {
    get: jest.fn().mockImplementationOnce(() => Promise.resolve(defaultResponse)),
    put: jest.fn().mockImplementationOnce(() => Promise.resolve(defaultResponse)),
    post: jest.fn().mockImplementationOnce(() => Promise.resolve(defaultResponse)),
    delete: jest.fn().mockImplementationOnce(() => Promise.resolve(defaultResponse)),
    defaults: { headers: { common: {} } },
  });
};

axios.create = jest.fn(() => axios);

module.exports = axios;
