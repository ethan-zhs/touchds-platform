// https
const HTTP = 'http://';
// const HTTPS = 'https://';

// domain
const DOMAIN_TEST = `${HTTP}127.0.0.1:8999`;
const DOMAIN_PROD = `${HTTP}192.168.31.74:8080`;

const HOST_LOCAL = `${HTTP}${process.env.LOCALHOST || '127.0.0.1:8999'}`;

const localhostIp = process.env.LOCALHOST ? process.env.LOCALHOST.split(':')[0] : 'localhost';

const baseName: any = {
    'localhost': HOST_LOCAL,
    [`${localhostIp}`]: HOST_LOCAL
};

const apiBaseName = baseName[window.location.hostname];

export const getApiBaseName = {
    api: apiBaseName + '/api'
};
