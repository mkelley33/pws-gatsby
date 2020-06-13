const axios = jest.genMockFromModule('axios');
const defaultResponse = { data: {} };

axios.doMockReset = () => {
  Object.assign(axios, {
    create: jest.fn(() => axios),
    get: jest.fn().mockImplementationOnce(() => Promise.resolve(defaultResponse)),
    put: jest.fn().mockImplementationOnce(() => Promise.resolve(defaultResponse)),
    post: jest.fn().mockImplementationOnce(() => Promise.resolve(defaultResponse)),
    delete: jest.fn().mockImplementationOnce(() => Promise.resolve(defaultResponse)),
    defaults: { headers: { common: {} } },
  });
};

axios.doMockReset();

module.exports = axios;
