export declare const swaggerSpec: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
        schemas: {
            ApiResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                    };
                    message: {
                        type: string;
                    };
                    data: {
                        type: string;
                    };
                    timestamp: {
                        type: string;
                    };
                    correlationId: {
                        type: string;
                    };
                };
            };
        };
    };
    paths: {
        '/health': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/auth/register': {
            post: {
                summary: string;
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    email: {
                                        type: string;
                                    };
                                    phone: {
                                        type: string;
                                    };
                                    password: {
                                        type: string;
                                    };
                                    role: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/auth/login': {
            post: {
                summary: string;
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    email: {
                                        type: string;
                                    };
                                    password: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/home/discovery': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/restaurants': {
            get: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/orders': {
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
            get: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/payments/create-intent': {
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/payments/verify': {
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
    };
};
