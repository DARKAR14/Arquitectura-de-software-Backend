const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Generador de Preguntas con IA",
    version: "1.0.0",
    description: "API que permite a usuarios subir un PDF, generar preguntas automáticamente usando IA, responderlas y ver su calificación.",
  },
  servers: [
    {
      url: "https://xdzpxn5h-4000.use2.devtunnels.ms/api",
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
    schemas: {
      Test: {
        type: "object",
        properties: {
          id: { type: "string", example: "664f2c1b2e4f926a0d123456" },
          topic: { type: "string", example: "Matemáticas" },
          difficulty: { type: "string", example: "fácil" },
          createdAt: { type: "string", format: "date-time" },
          questionCount: { type: "integer", example: 10 }
        }
      }
    }
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
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string", example: "johndoe" },
                  email: { type: "string", format: "email", example: "john@example.com" },
                  password: { type: "string", format: "password", example: "P@ssw0rd123" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Usuario registrado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Usuario registrado exitosamente" }
                  }
                }
              }
            }
          },
          500: { description: "Error interno en el servidor" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Iniciar sesión de usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "john@example.com" },
                  password: { type: "string", format: "password", example: "P@ssw0rd123" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Inicio de sesión exitoso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Inicio de sesión exitoso" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "60f5a3c2b1e4f926a0d12345" },
                        username: { type: "string", example: "johndoe" },
                        email: { type: "string", format: "email", example: "john@example.com" }
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: "Email no registrado o contraseña incorrecta" },
          500: { description: "Error interno en el servidor" },
        },
      },
    },
    "/auth/logout": {
      get: {
        tags: ["Auth"],
        summary: "Cerrar sesión (eliminar cookie JWT)",
        responses: {
          200: {
            description: "Sesión cerrada correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Sesión cerrada" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users/profile": {
      get: {
        tags: ["Users"],
        summary: "Obtener el perfil del usuario autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Perfil del usuario obtenido exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      properties: {
                        _id: { type: "string" },
                        username: { type: "string" },
                        email: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          401: { description: "No autorizado (token inválido o no enviado)" }
        }
      }
    },
    "/tests": {
      post: {
        tags: ["Tests"],
        summary: "Crear un test analizando un PDF con IA",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file", "difficulty"],
                properties: {
                  file: { type: "string", format: "binary", description: "PDF con el contenido a analizar" },
                  difficulty: { type: "string", description: "Dificultad del test (p.ej. fácil, medio, difícil)", example: "fácil" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Test generado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    test: { $ref: "#/components/schemas/Test" },
                    pdfMeta: {
                      type: "object",
                      properties: {
                        originalName: { type: "string", example: "documento.pdf" },
                        size: { type: "number", example: 123456 },
                        pages: { type: "number", example: 5 }
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: "PDF no proporcionado o formato inválido" },
          500: { description: "Error interno generando el test" }
        }
      },
      get: {
        tags: ["Tests"],
        summary: "Obtener tests creados por el usuario autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de tests del usuario",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tests: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Test" }
                    }
                  }
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
        summary: "Obtener un test por ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID del test"
          }
        ],
        responses: {
          200: {
            description: "Test encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    test: { $ref: "#/components/schemas/Test" }
                  }
                }
              }
            }
          },
          404: { description: "Test no encontrado" }
        }
      }
    },
    "/questions": {
      get: {
        tags: ["Questions"],
        summary: "Obtener todas las preguntas disponibles",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de preguntas obtenida exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      _id: { type: "string" },
                      text: { type: "string" },
                      type: { type: "string" },
                      options: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            text: { type: "string" },
                            isCorrect: { type: "boolean" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: { description: "Token inválido o no enviado" }
        }
      }
    },
    "/results": {
      post: {
        tags: ["Results"],
        summary: "Guardar el resultado de un test",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["testId", "score", "answers"],
                properties: {
                  testId: { type: "string", description: "ID del test realizado" },
                  score: { type: "number", description: "Puntaje obtenido" },
                  answers: {
                    type: "array",
                    description: "Respuestas del usuario",
                    items: {
                      type: "object",
                      properties: {
                        questionId: { type: "string" },
                        selectedOption: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Resultado guardado exitosamente" },
          400: { description: "Datos inválidos" },
          401: { description: "No autorizado" }
        }
      }
    }
  }
};

export default swaggerDocument;