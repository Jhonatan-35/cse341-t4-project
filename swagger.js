const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Movies API',
        description: 'Movies API'
    },
    host: ['cse341-t4-project-9zue.onrender.com'],
    schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);