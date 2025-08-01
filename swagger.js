const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Movies API',
        description: 'Movies API'
    },
    host: ['cse341-t4-project.onrender.com'],
    // host: ['localhost:3000'],
    schemes: ['https']
    //   schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);    