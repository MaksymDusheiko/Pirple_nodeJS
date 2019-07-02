let environments = {};

//staging

environments.staging = {
    httpPort: 6002,
    httpsPort: 6004,
    'envName': 'staging'
};


environments.production = {
    httpPort: 5002,
    httpsPort: 5004,
    envName: 'production'
}


const currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

const envToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = envToExport;