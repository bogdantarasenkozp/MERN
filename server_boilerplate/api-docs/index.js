module.exports = (args) => {

  const { config } = args;

  return {
    "swagger": "2.0",
    "info": {
      "version": "1.0.0",
      "title": "",
      "description": "",
      "license": {
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
      }
    },
    "host": config.hostname,
    "basePath": `api/${config.apiVersion}`,
    "tags": [
      {
        "name": "Users",
        "description": "API for users"
      }
    ],
    "schemes": [
      "http", "https"
    ],
    "consumes": [
      "application/json"
    ],
    "produces": [
      "application/json"
    ],
    "paths": {
      "/users": {
        "post": {
          "tags": [
            "Users"
          ],
          "description": "Create new user",
          "summary": "Create new user",
          "parameters": [
            {
              "name": "user",
              "in": "body",
              "description": "User that we want to create",
              "schema": {
                "$ref": "#/definitions/User"
              }
            }
          ],
          "produces": [
            "application/json"
          ],
          "responses": {
            "200": {
              "description": "New user is created",
              "schema": {
                "$ref": "#/definitions/UserId"
              }
            }
          }
        },
        "put": {
          "tags": [
            "Users"
          ],
          "summary": "Update current user",
          "parameters": [
            {
              "name": "user",
              "in": "body",
              "description": "Update current user (get user id from authorization header)",
              "schema": {
                "$ref": "#/definitions/UserUpdate"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Get user id",
              "schema": {
                "$ref": "#/definitions/UserId"
              }
            }
          }
        }
      },
      "/users/me": {
        "parameters": [
          {
            "name": "Authorization",
            "in": "header",
            "required": true,
            "description": "Bearer",
            "type": "string"
          }
        ],
        "get": {
          "tags": [
            "Users"
          ],
          "summary": "Get info for current user",
          "responses": {
            "200": {
              "description": "Get info for current user",
              "schema": {
                "$ref": "#/definitions/CurrentUserResponse"
              }
            }
          }
        }
      },
      "/users/{email}/verification/{verificationToken}": {
        "parameters": [
          {
            "name": "email",
            "in": "path",
            "required": true,
            "description": "User email",
            "type": "string"
          },
          {
            "name": "verificationToken",
            "in": "path",
            "required": true,
            "description": "Unique verification token",
            "type": "string"
          },
        ],
        "get": {
          "tags": [
            "Users"
          ],
          "summary": "Verification user email",
          "responses": {
            "200": {
              "description": "User verified",
              "schema": {
                "$ref": "#/definitions/UserId"
              }
            }
          }
        }
      },
      "/users/login": {
        "post": {
          "tags": [
            "Users"
          ],
          "summary": "Login user",
          "parameters": [
            {
              "name": "user",
              "in": "body",
              "description": "User that we want to login",
              "schema": {
                "$ref": "#/definitions/UserLogin"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Get authentication token",
              "schema": {
                "$ref": "#/definitions/UserToken"
              }
            }
          }
        }
      },
      "/users/password": {
        "put": {
          "tags": [
            "Users"
          ],
          "summary": "Update password",
          "parameters": [
            {
              "name": "user",
              "in": "body",
              "description": "Forgot password by user email",
              "schema": {
                "$ref": "#/definitions/UserUpdatePassword"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Get user id",
              "schema": {
                "$ref": "#/definitions/UserMessage"
              }
            }
          }
        }
      },
      "/users/password/forgot": {
        "post": {
          "tags": [
            "Users"
          ],
          "summary": "Forgot password",
          "parameters": [
            {
              "name": "user",
              "in": "body",
              "description": "Forgot password by user email",
              "schema": {
                "$ref": "#/definitions/UserEmail"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Get user id",
              "schema": {
                "$ref": "#/definitions/UserId"
              }
            }
          }
        }
      },
      "/users/password/reset/{token}": {
        "parameters": [
          {
            "name": "token",
            "in": "path",
            "required": true,
            "description": "Reset token",
            "type": "string"
          }
        ],
        "get": {
          "tags": [
            "Users"
          ],
          "summary": "Verification user email",
          "responses": {
            "200": {
              "description": "Get reset token",
              "schema": {
                "$ref": "#/definitions/UserResetToken"
              }
            }
          }
        }
      },
      "/files": {
        "post": {
          "tags": [
            "Files"
          ],
          "parameters": [{
            "in": "formData",
            "name": "file",
            "required": true,
            "type": "file",
            "description": "File to upload"
          }],
          "description": "Upload file",
          "summary": "Upload file",
          "produces": [
            "application/json"
          ],
          "responses": {
            "200": {
              "description": "Get file info",
              "schema": {
                "$ref": "#/definitions/File"
              }
            }
          }
        }
      }
    },
    "definitions": {
      "User": {
        "required": [
          "email",
        ],
        "properties": {
          "id": {
            "type": "integer",
            "uniqueItems": true
          },
          "email": {
            "type": "string",
            "uniqueItems": true
          },
          "name": {
            "type": "string"
          },
          "password": {
            "type": "string"
          }
        }
      },
      "CurrentUserResponse": {
        "properties": {
          "id": {
            "type": "integer",
            "uniqueItems": true
          },
          "email": {
            "type": "string",
            "uniqueItems": true
          },
          "name": {
            "type": "string"
          },
          "password": {
            "type": "string"
          },
          "wallet": {
            "type": "string",
            "uniqueItems": true
          },
          "walletReferral": {
            "type": "string"
          }
        }
      },
      "UserLogin": {
        "required": [
          "email",
          "password"
        ],
        "properties": {
          "email": {
            "type": "string",
            "uniqueItems": true
          },
          "password": {
            "type": "string"
          }
        }
      },
      "UserEmail": {
        "required": [
          "email"
        ],
        "properties": {
          "email": {
            "type": "string",
            "uniqueItems": true
          }
        }
      },
      "UserId": {
        "properties": {
          "id": {
            "type": "integer",
            "uniqueItems": true
          }
        }
      },
      "UserToken": {
        "properties": {
          "token": {
            "type": "string"
          },
          "role": {
            "type": "string"
          },
          "wallet": {
            "type": "string"
          }
        }
      },
      "UserResetToken": {
        "properties": {
          "resetToken": {
            "type": "string"
          }
        }
      },
      "UserUpdatePassword": {
        "required": [
          "password",
          "resetToken"
        ],
        "properties": {
          "password": {
            "type": "string"
          },
          "resetToken": {
            "type": "string"
          }
        }
      },
      "UserMessage": {
        "properties": {
          "message": {
            "type": "string"
          }
        }
      },
      "UserUpdate": {
        "properties": {
          "name": {
            "type": "string"
          },
          "wallet": {
            "type": "string"
          },
          "walletReferral": {
            "type": "string"
          }
        }
      },
      "File": {
        "properties": {
          "filename": {
            "type": "string"
          },
          "path": {
            "type": "string"
          },
          "size": {
            "type": "integer"
          },
          "mimetype": {
            "type": "string"
          }
        }
      }
    }
  };
}
