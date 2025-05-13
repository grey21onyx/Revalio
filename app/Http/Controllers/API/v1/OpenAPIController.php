<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

class OpenAPIController extends Controller
{
    /**
     * Display the OpenAPI documentation
     *
     * @return \Illuminate\Http\Response
     */
    public function documentation()
    {
        $data = $this->generateOpenAPISpec();
        
        return response()->json($data);
    }

    /**
     * Generate OpenAPI specification
     *
     * @return array
     */
    private function generateOpenAPISpec()
    {
        return [
            'openapi' => '3.0.0',
            'info' => [
                'title' => 'Revalio API Documentation',
                'description' => 'RESTful API untuk aplikasi Revalio',
                'version' => '1.0.0',
                'contact' => [
                    'email' => 'admin@revalio.com'
                ],
                'license' => [
                    'name' => 'MIT',
                    'url' => 'https://opensource.org/licenses/MIT'
                ]
            ],
            'servers' => [
                [
                    'url' => url('/api/v1'),
                    'description' => 'Revalio API Server'
                ]
            ],
            'paths' => $this->getPaths(),
            'components' => $this->getComponents(),
            'tags' => $this->getTags(),
        ];
    }

    /**
     * Get API paths
     *
     * @return array
     */
    private function getPaths()
    {
        return [
            // Auth Endpoints
            '/register' => [
                'post' => [
                    'tags' => ['Authentication'],
                    'summary' => 'Register a new user',
                    'description' => 'Create a new user account',
                    'operationId' => 'register',
                    'requestBody' => [
                        'required' => true,
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/RegistrationRequest'
                                ]
                            ]
                        ]
                    ],
                    'responses' => [
                        '201' => [
                            'description' => 'Registration successful',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        '$ref' => '#/components/schemas/RegistrationResponse'
                                    ]
                                ]
                            ]
                        ],
                        '422' => [
                            'description' => 'Validation Error',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        '$ref' => '#/components/schemas/ValidationError'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            '/login' => [
                'post' => [
                    'tags' => ['Authentication'],
                    'summary' => 'User login',
                    'description' => 'Authenticate a user and get access token',
                    'operationId' => 'login',
                    'requestBody' => [
                        'required' => true,
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/LoginRequest'
                                ]
                            ]
                        ]
                    ],
                    'responses' => [
                        '200' => [
                            'description' => 'Login successful',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        '$ref' => '#/components/schemas/LoginResponse'
                                    ]
                                ]
                            ]
                        ],
                        '401' => [
                            'description' => 'Unauthorized',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        '$ref' => '#/components/schemas/ErrorResponse'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            // Waste Types Endpoints
            '/waste-types' => [
                'get' => [
                    'tags' => ['Waste Types'],
                    'summary' => 'Get all waste types',
                    'description' => 'Returns a list of all waste types',
                    'operationId' => 'getWasteTypes',
                    'parameters' => [
                        [
                            'name' => 'search',
                            'in' => 'query',
                            'description' => 'Search term to filter waste types',
                            'required' => false,
                            'schema' => [
                                'type' => 'string'
                            ]
                        ],
                        [
                            'name' => 'category_id',
                            'in' => 'query',
                            'description' => 'Filter by category ID',
                            'required' => false,
                            'schema' => [
                                'type' => 'integer'
                            ]
                        ],
                        [
                            'name' => 'status',
                            'in' => 'query',
                            'description' => 'Filter by status',
                            'required' => false,
                            'schema' => [
                                'type' => 'string',
                                'enum' => ['AKTIF', 'TIDAK_AKTIF']
                            ]
                        ],
                        [
                            'name' => 'per_page',
                            'in' => 'query',
                            'description' => 'Number of items per page',
                            'required' => false,
                            'schema' => [
                                'type' => 'integer',
                                'default' => 15
                            ]
                        ]
                    ],
                    'security' => [
                        ['bearerAuth' => []]
                    ],
                    'responses' => [
                        '200' => [
                            'description' => 'Successful operation',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        '$ref' => '#/components/schemas/WasteTypeCollection'
                                    ]
                                ]
                            ]
                        ],
                        '401' => [
                            'description' => 'Unauthorized',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        '$ref' => '#/components/schemas/ErrorResponse'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ],
                'post' => [
                    'tags' => ['Waste Types'],
                    'summary' => 'Create a new waste type',
                    'description' => 'Creates a new waste type',
                    'operationId' => 'createWasteType',
                    'security' => [
                        ['bearerAuth' => []]
                    ],
                    'requestBody' => [
                        'required' => true,
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/WasteTypeRequest'
                                ]
                            ]
                        ]
                    ],
                    'responses' => [
                        '201' => [
                            'description' => 'Waste type created successfully',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        '$ref' => '#/components/schemas/WasteTypeResponse'
                                    ]
                                ]
                            ]
                        ],
                        '401' => [
                            'description' => 'Unauthorized',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        '$ref' => '#/components/schemas/ErrorResponse'
                                    ]
                                ]
                            ]
                        ],
                        '422' => [
                            'description' => 'Validation Error',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        '$ref' => '#/components/schemas/ValidationError'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            // Add more paths for all endpoints...
        ];
    }

    /**
     * Get components
     *
     * @return array
     */
    private function getComponents()
    {
        return [
            'schemas' => [
                'RegistrationRequest' => [
                    'type' => 'object',
                    'properties' => [
                        'name' => [
                            'type' => 'string',
                            'example' => 'John Doe'
                        ],
                        'email' => [
                            'type' => 'string',
                            'format' => 'email',
                            'example' => 'john@example.com'
                        ],
                        'password' => [
                            'type' => 'string',
                            'format' => 'password',
                            'example' => 'password123'
                        ],
                        'password_confirmation' => [
                            'type' => 'string',
                            'format' => 'password',
                            'example' => 'password123'
                        ]
                    ],
                    'required' => ['name', 'email', 'password', 'password_confirmation']
                ],
                'RegistrationResponse' => [
                    'type' => 'object',
                    'properties' => [
                        'message' => [
                            'type' => 'string',
                            'example' => 'User registered successfully'
                        ],
                        'user' => [
                            '$ref' => '#/components/schemas/User'
                        ],
                        'token' => [
                            'type' => 'string',
                            'example' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
                        ]
                    ]
                ],
                'LoginRequest' => [
                    'type' => 'object',
                    'properties' => [
                        'email' => [
                            'type' => 'string',
                            'format' => 'email',
                            'example' => 'john@example.com'
                        ],
                        'password' => [
                            'type' => 'string',
                            'format' => 'password',
                            'example' => 'password123'
                        ]
                    ],
                    'required' => ['email', 'password']
                ],
                'LoginResponse' => [
                    'type' => 'object',
                    'properties' => [
                        'message' => [
                            'type' => 'string',
                            'example' => 'Login successful'
                        ],
                        'user' => [
                            '$ref' => '#/components/schemas/User'
                        ],
                        'token' => [
                            'type' => 'string',
                            'example' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
                        ]
                    ]
                ],
                'User' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => [
                            'type' => 'integer',
                            'example' => 1
                        ],
                        'name' => [
                            'type' => 'string',
                            'example' => 'John Doe'
                        ],
                        'email' => [
                            'type' => 'string',
                            'format' => 'email',
                            'example' => 'john@example.com'
                        ],
                        'created_at' => [
                            'type' => 'string',
                            'format' => 'date-time',
                            'example' => '2023-05-01T12:00:00Z'
                        ],
                        'updated_at' => [
                            'type' => 'string',
                            'format' => 'date-time',
                            'example' => '2023-05-01T12:00:00Z'
                        ]
                    ]
                ],
                'WasteTypeRequest' => [
                    'type' => 'object',
                    'properties' => [
                        'nama_sampah' => [
                            'type' => 'string',
                            'example' => 'Botol Plastik'
                        ],
                        'deskripsi' => [
                            'type' => 'string',
                            'example' => 'Botol plastik bekas minuman'
                        ],
                        'karakteristik' => [
                            'type' => 'string',
                            'example' => 'Plastik, ringan, tahan air'
                        ],
                        'tingkat_kesulitan' => [
                            'type' => 'string',
                            'enum' => ['MUDAH', 'SEDANG', 'SULIT'],
                            'example' => 'MUDAH'
                        ],
                        'category_id' => [
                            'type' => 'integer',
                            'example' => 1
                        ],
                        'dampak_lingkungan' => [
                            'type' => 'string',
                            'example' => 'Mencemari tanah, air dan laut'
                        ],
                        'status' => [
                            'type' => 'string',
                            'enum' => ['AKTIF', 'TIDAK_AKTIF'],
                            'example' => 'AKTIF'
                        ]
                    ],
                    'required' => ['nama_sampah', 'deskripsi', 'tingkat_kesulitan', 'category_id']
                ],
                'WasteTypeResponse' => [
                    'type' => 'object',
                    'properties' => [
                        'message' => [
                            'type' => 'string',
                            'example' => 'Jenis sampah berhasil dibuat'
                        ],
                        'waste_type' => [
                            '$ref' => '#/components/schemas/WasteType'
                        ]
                    ]
                ],
                'WasteType' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => [
                            'type' => 'integer',
                            'example' => 1
                        ],
                        'nama' => [
                            'type' => 'string',
                            'example' => 'Botol Plastik'
                        ],
                        'deskripsi' => [
                            'type' => 'string',
                            'example' => 'Botol plastik bekas minuman'
                        ],
                        'karakteristik' => [
                            'type' => 'string',
                            'example' => 'Plastik, ringan, tahan air'
                        ],
                        'tingkat_kesulitan' => [
                            'type' => 'string',
                            'example' => 'MUDAH'
                        ],
                        'gambar' => [
                            'type' => 'string',
                            'format' => 'uri',
                            'example' => 'https://revalio.com/storage/app/public/waste_types/waste_1234567890.jpg'
                        ],
                        'dampak_lingkungan' => [
                            'type' => 'string',
                            'example' => 'Mencemari tanah, air dan laut'
                        ],
                        'status' => [
                            'type' => 'string',
                            'example' => 'AKTIF'
                        ],
                        'created_at' => [
                            'type' => 'string',
                            'format' => 'date-time',
                            'example' => '2023-05-01T12:00:00Z'
                        ],
                        'updated_at' => [
                            'type' => 'string',
                            'format' => 'date-time',
                            'example' => '2023-05-01T12:00:00Z'
                        ]
                    ]
                ],
                'WasteTypeCollection' => [
                    'type' => 'object',
                    'properties' => [
                        'data' => [
                            'type' => 'array',
                            'items' => [
                                '$ref' => '#/components/schemas/WasteType'
                            ]
                        ],
                        'links' => [
                            'type' => 'object',
                            'properties' => [
                                'first' => [
                                    'type' => 'string',
                                    'format' => 'uri',
                                    'example' => 'https://revalio.com/api/v1/waste-types?page=1'
                                ],
                                'last' => [
                                    'type' => 'string',
                                    'format' => 'uri',
                                    'example' => 'https://revalio.com/api/v1/waste-types?page=5'
                                ],
                                'prev' => [
                                    'type' => 'string',
                                    'format' => 'uri',
                                    'nullable' => true,
                                    'example' => null
                                ],
                                'next' => [
                                    'type' => 'string',
                                    'format' => 'uri',
                                    'example' => 'https://revalio.com/api/v1/waste-types?page=2'
                                ]
                            ]
                        ],
                        'meta' => [
                            'type' => 'object',
                            'properties' => [
                                'current_page' => [
                                    'type' => 'integer',
                                    'example' => 1
                                ],
                                'from' => [
                                    'type' => 'integer',
                                    'example' => 1
                                ],
                                'last_page' => [
                                    'type' => 'integer',
                                    'example' => 5
                                ],
                                'path' => [
                                    'type' => 'string',
                                    'format' => 'uri',
                                    'example' => 'https://revalio.com/api/v1/waste-types'
                                ],
                                'per_page' => [
                                    'type' => 'integer',
                                    'example' => 15
                                ],
                                'to' => [
                                    'type' => 'integer',
                                    'example' => 15
                                ],
                                'total' => [
                                    'type' => 'integer',
                                    'example' => 75
                                ]
                            ]
                        ]
                    ]
                ],
                'ErrorResponse' => [
                    'type' => 'object',
                    'properties' => [
                        'message' => [
                            'type' => 'string',
                            'example' => 'Unauthorized'
                        ]
                    ]
                ],
                'ValidationError' => [
                    'type' => 'object',
                    'properties' => [
                        'message' => [
                            'type' => 'string',
                            'example' => 'The given data was invalid.'
                        ],
                        'errors' => [
                            'type' => 'object',
                            'additionalProperties' => [
                                'type' => 'array',
                                'items' => [
                                    'type' => 'string'
                                ]
                            ],
                            'example' => [
                                'email' => [
                                    'The email field is required.'
                                ],
                                'password' => [
                                    'The password field is required.'
                                ]
                            ]
                        ]
                    ]
                ]
                // Add more schemas...
            ],
            'securitySchemes' => [
                'bearerAuth' => [
                    'type' => 'http',
                    'scheme' => 'bearer',
                    'bearerFormat' => 'JWT'
                ]
            ]
        ];
    }

    /**
     * Get API tags
     *
     * @return array
     */
    private function getTags()
    {
        return [
            [
                'name' => 'Authentication',
                'description' => 'Endpoints for user authentication'
            ],
            [
                'name' => 'Users',
                'description' => 'Endpoints for managing users'
            ],
            [
                'name' => 'Waste Types',
                'description' => 'Endpoints for managing waste types'
            ],
            [
                'name' => 'Waste Categories',
                'description' => 'Endpoints for managing waste categories'
            ],
            [
                'name' => 'Waste Values',
                'description' => 'Endpoints for managing waste economic values'
            ],
            [
                'name' => 'Tutorials',
                'description' => 'Endpoints for managing tutorials and guides'
            ],
            [
                'name' => 'Articles',
                'description' => 'Endpoints for managing educational articles'
            ],
            [
                'name' => 'Forum Threads',
                'description' => 'Endpoints for managing forum threads'
            ],
            [
                'name' => 'Forum Comments',
                'description' => 'Endpoints for managing forum comments'
            ],
            [
                'name' => 'Waste Tracking',
                'description' => 'Endpoints for tracking user waste'
            ],
            [
                'name' => 'Waste Buyers',
                'description' => 'Endpoints for managing waste buyers'
            ],
            [
                'name' => 'Business Opportunities',
                'description' => 'Endpoints for managing business opportunities'
            ]
        ];
    }

    /**
     * Display Swagger UI
     * 
     * @return \Illuminate\Http\Response
     */
    public function swaggerUI()
    {
        $html = File::get(public_path('openapi/swagger-ui/index.html'));
        return Response::make($html, 200);
    }
}