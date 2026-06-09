const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hotel API",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api`,
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./routes/*.js"],
}

module.exports = swaggerJsdoc(options)