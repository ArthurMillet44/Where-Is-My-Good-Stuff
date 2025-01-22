import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv'
dotenv.config()

const serverPort = process.env.PORT || 8080
const APIPATH = process.env.API_PATH || '/api/v1'

const outputFile = './swagger.json';
const endpointsFiles = ['./src/MVC/route/*.mjs'];

const config = {
    info: {
        title: 'User API Documentation',
        description: '',
    },
    tags: [ ],
    host: 'localhost:'+serverPort+APIPATH,
    schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);
