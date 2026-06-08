# 🔐 AuthX - Production Style Authentication API

A backend authentication system built with Node.js, Express.js and MongoDB to understand how authentication works in real-world production applications.

This project implements modern authentication concepts like JWT access tokens, refresh token rotation, OTP verification, secure password reset, middleware architecture, validation, and API security.

---

# 🚀 Features

## Authentication

- User Signup
- User Login
- Password Hashing
- Email Verification using OTP
- JWT Authentication
- Access Token + Refresh Token System
- Refresh Token Rotation
- Secure Logout
- Forgot Password using OTP
- Reset Password Flow


## Security

- bcrypt Password Hashing
- OTP Hashing
- HTTP-only Cookies
- JWT Verification
- Rate Limiting
- Request Validation using Zod
- Helmet Security Headers
- CORS Protection
- Environment Variables


---

# 🏗️ Backend Architecture


```
Client

  |
  |
  v

Express App

  |
  |
  +---- Helmet
  |
  +---- CORS
  |
  +---- JSON Parser

  |
  v

Routes

  |
  |
  +---- Rate Limiter
  |
  +---- Validation Middleware

  |
  v

Controller

  |
  v

Service Layer

  |
  v

MongoDB

```

---

# 📂 Folder Structure


```
src

│
├── config
│     └── db.js
│
├── controllers
│     └── auth.controller.js
│
├── middleware
│     ├── auth.middleware.js
│     ├── error.middleware.js
│     ├── validate.middleware.js
│     └── rateLimit.middleware.js
│
├── models
│     ├── user.model.js
│     ├── token.model.js
│     └── otp.model.js
│
├── routes
│     └── auth.routes.js
│
├── services
│     ├── auth.service.js
│     └── email.service.js
│
├── utils
│     ├── token.js
│     ├── asyncHandler.js
│     └── generateOTP.js
│
├── app.js
└── server.js

```

---

# 🔥 Authentication Flow


## 1. Signup Flow


```
User

 |
 |
POST /signup


 |
 |
Rate Limiting


 |
 |
Zod Validation


 |
 |
Controller


 |
 |
Auth Service


 |
 |
Check Existing User


 |
 |
bcrypt.hash(password)


 |
 |
Create User
(isVerified:false)


 |
 |
Generate OTP


 |
 |
Hash OTP


 |
 |
Save OTP with expiry


 |
 |
Send OTP Email

```


Database:


User Collection

```json
{
"name":"John",

"email":"john@gmail.com",

"password":"hashed_password",

"isEmailVerified":false
}
```


OTP Collection


```json
{
"userId":"123",

"otp":"hashed_otp",

"expiresAt":"date"
}
```


---

# 2. Email Verification Flow


```
User enters OTP


        |
        v


Find OTP Record


        |
        v


bcrypt.compare(
enteredOTP,
storedOTPHash
)


        |
        v


Correct OTP?


YES

 |
 |

Update User


isEmailVerified:true


 |
 |

Delete OTP

```

---

# 🔑 Login Flow


```
POST /login


 |
 |

Find User


 |
 |

Check Email Verified


 |
 |

bcrypt.compare(password)


 |
 |

Generate Tokens


        |
        |

+------------------+

|                  |

v                  v


Access Token      Refresh Token


|                  |

JSON Response     HTTP-only Cookie

                   +

                Stored in DB

```


---

# JWT Token Strategy


## Access Token


Short lived token used to access protected APIs.


Example:

```
Authorization:

Bearer accessToken
```


Contains:

```json
{
"id":"userId",
"role":"user"
}
```


---

## Refresh Token


Long lived token used to generate new access tokens.


Stored:

```
Browser
(httpOnly Cookie)

+

MongoDB Token Collection
```


Benefits:

- Session Management
- Logout Support
- Token Rotation


---

# 🔄 Refresh Token Rotation


```
Access Token Expires


        |
        |

POST /refresh


        |
        |

Read Refresh Cookie


        |
        |

Verify JWT


        |
        |

Check Token in DB


        |
        |

Delete Old Refresh Token


        |
        |

Generate New:

- Access Token
- Refresh Token


        |
        |

Save New Refresh Token


        |
        |

Continue Session

```

---

# 🚪 Logout Flow


```
POST /logout


 |
 |

Read Refresh Cookie


 |
 |

Delete Refresh Token from DB


 |
 |

Clear Cookie


 |
 |

Session Ended

```

---

# 🔒 Password Reset Flow


```
Forgot Password


      |
      |

Generate OTP


      |
      |

Verify OTP


      |
      |

Generate Reset Token


      |
      |

User submits new password


      |
      |

bcrypt.hash(new password)


      |
      |

Update Password

```

---

# 🛡️ Security Decisions


## Why bcrypt?

Passwords are never stored directly.

```
password123

      |

bcrypt

      |

$2b$10$....

```


Even if database leaks, passwords remain protected.


---


## Why Refresh Tokens are stored in DB?


To allow:

- Logout
- Token Revocation
- Session Control


Example:

```
Logout

 |

Delete Refresh Token

 |

Old Session Invalid

```


---

## Why HTTP-only Cookies?


Prevents JavaScript access:

```javascript
document.cookie
```

cannot steal refresh token.


---

# 📌 API Endpoints


## Auth


| Method | Endpoint | Description |
|-|-|-|
|POST|/api/v1/auth/signup|Create Account|
|POST|/api/v1/auth/verify-email|Verify OTP|
|POST|/api/v1/auth/login|Login User|
|POST|/api/v1/auth/refresh|Generate New Token|
|POST|/api/v1/auth/logout|Logout|
|POST|/api/v1/auth/forgot-password|Send Reset OTP|
|POST|/api/v1/auth/reset-password|Change Password|


---

# ⚙️ Environment Variables


```env
PORT=5000

MONGO_URI=

ACCESS_TOKEN_SECRET=

REFRESH_TOKEN_SECRET=

CLIENT_URL=

NODE_ENV=development
```

---

# 🧠 Concepts Learned

- REST API Design
- MVC Architecture
- Service Layer Pattern
- Middleware Pipeline
- JWT Internals
- Refresh Token Rotation
- Secure Cookie Authentication
- OTP Authentication
- Password Reset Design
- MongoDB Schema Design
- Error Handling
- Request Validation
- API Security

---

# Future Improvements

- Google OAuth 2.0
- Role Based Access Control
- Device Based Sessions
- Docker Deployment
- CI/CD Pipeline
- Logging System

---

## Built to understand production authentication systems.