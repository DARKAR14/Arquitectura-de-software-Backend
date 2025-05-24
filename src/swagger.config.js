const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Generador de Tests Educativos con IA",
    version: "1.0.0",
    description: "API para generar tests desde PDFs usando IA, responder preguntas y gestionar resultados"
  },
  servers: [
    {
      url: "https://xdzpxn5h-4000.use2.devtunnels.ms/api",
      description: "Servidor Local"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "664f2c1b2e4f926a0d123456" },
          username: { type: "string", example: "johndoe" },
          email: { type: "string", example: "john@example.com" }
        }
      },
      Test: {
        type: "object",
        properties: {
          _id: { type: "string", example: "664f2c1b2e4f926a0d123456" },
          topic: { type: "string", example: "Inteligencia Artificial" },
          difficulty: { type: "string", example: "medio" },
          questions: {
            type: "array",
            items: { $ref: "#/components/schemas/Question" }
          },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Question: {
        type: "object",
        properties: {
          _id: { type: "string" },
          text: { type: "string" },
          options: {
            type: "array",
            items: { $ref: "#/components/schemas/Option" }
          },
          correctAnswer: { type: "string", enum: ["A", "B", "C", "D"] }
        }
      },
      Option: {
        type: "object",
        properties: {
          letter: { type: "string", example: "A" },
          text: { type: "string", example: "Respuesta correcta" }
        }
      },
      Result: {
        type: "object",
        properties: {
          _id: { type: "string" },
          score: { type: "number", example: 4 },
          total: { type: "number", example: 5 },
          percentage: { type: "string", example: "80.00%" },
          test: { $ref: "#/components/schemas/Test" },
          details: {
            type: "array",
            items: { $ref: "#/components/schemas/AnswerDetail" }
          }
        }
      },
      AnswerDetail: {
        type: "object",
        properties: {
          question: { type: "string", example: "¿Qué es IA?" },
          correctAnswer: { type: "string", example: "A" },
          userAnswer: { type: "string", example: "A" },
          isCorrect: { type: "boolean", example: true }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrar nuevo usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string", example: "johndoe" },
                  email: { type: "string", format: "email", example: "john@example.com" },
                  password: { type: "string", format: "password", example: "P@ssw0rd123" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Usuario registrado exitosamente" },
          500: { description: "Error en el servidor" }
        }
      }
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
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "P@ssw0rd123" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Login exitoso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          400: { description: "Credenciales inválidas" }
        }
      }
    },
    "/tests": {
      post: {
        tags: ["Tests"],
        summary: "Crear test desde PDF",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file", "difficulty"],
                properties: {
                  file: { type: "string", format: "binary" },
                  difficulty: { type: "string", example: "medio" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Test creado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Test" }
              }
            }
          }
        }
      },
      get: {
        tags: ["Tests"],
        summary: "Obtener tests del usuario",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de tests",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Test" }
                }
              }
            }
          }
        }
      }
    },
    "/tests/{id}": {
      get: {
        tags: ["Tests"],
        summary: "Obtener test por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }],
        responses: {
          200: {
            description: "Detalle del test",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Test" }
              }
            }
          }
        }
      }
    },
    "/results": {
      get: {
        tags: ["Results"],
        summary: "Obtener historial de resultados",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Historial de resultados",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Result" }
                }
              }
            }
          }
        }
      }
    },
    "/results/{testId}/submit": {
      post: {
        tags: ["Results"],
        summary: "Enviar respuestas de test",
        security: [{ bearerAuth: [] }],
        parameters: [{
          name: "testId",
          in: "path",
          required: true,
          schema: { type: "string" }
        }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  answers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        questionId: { type: "string" },
                        selectedOption: { 
                          type: "string", 
                          enum: ["A", "B", "C", "D"] 
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Resultados calculados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Result" }
              }
            }
          }
        }
      }
    },
    "/results/{id}": {
      get: {
        tags: ["Results"],
        summary: "Obtener detalle de resultado",
        security: [{ bearerAuth: [] }],
        parameters: [{
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }],
        responses: {
          200: {
            description: "Detalle del resultado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Result" }
              }
            }
          }
        }
      }
    }
  }
};

export default swaggerDocument;