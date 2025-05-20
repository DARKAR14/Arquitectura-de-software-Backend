const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Generador de Preguntas con IA",
    version: "1.0.0",
    description: "API que permite a usuarios subir un PDF, generar preguntas automáticamente usando IA, responderlas y ver su calificación.",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Servidor local",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrar un nuevo usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Usuario registrado exitosamente" },
          400: { description: "Error en los datos enviados" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Iniciar sesión",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login exitoso, devuelve token" },
          401: { description: "Credenciales inválidas" },
        },
      },
    },
    "/user/profile": {
      get: {
        tags: ["User"],
        summary: "Obtener perfil del usuario autenticado",
        responses: {
          200: { description: "Perfil obtenido" },
          401: { description: "No autorizado" },
        },
      },
    },
    "/user/tests": {
      get: {
        tags: ["User"],
        summary: "Obtener tests creados por el usuario autenticado",
        responses: {
          200: { description: "Lista de tests del usuario" },
        },
      },
    },
    "/test": {
      post: {
        tags: ["Test"],
        summary: "Crear un test a partir de un PDF",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  pdf: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Test creado exitosamente" },
          500: { description: "Error interno al crear el test" },
        },
      },
    },
    "/test/{id}": {
      get: {
        tags: ["Test"],
        summary: "Obtener un test por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Test obtenido" },
          404: { description: "Test no encontrado" },
        },
      },
    },
    "/question/{testId}": {
      get: {
        tags: ["Question"],
        summary: "Obtener preguntas de un test",
        parameters: [
          {
            name: "testId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Preguntas devueltas" },
          404: { description: "Test no encontrado" },
        },
      },
    },
    "/result/submit": {
      post: {
        tags: ["Result"],
        summary: "Enviar respuestas de un test y obtener nota",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  testId: { type: "string" },
                  answers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        questionId: { type: "string" },
                        selected: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Resultado del test enviado" },
          400: { description: "Error de validación" },
        },
      },
    },
    "/result/history": {
      get: {
        tags: ["Result"],
        summary: "Ver historial de resultados del usuario",
        responses: {
          200: { description: "Historial obtenido" },
        },
      },
    },
  },
};

export default swaggerDocument;