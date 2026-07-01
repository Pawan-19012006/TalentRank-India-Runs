# API Specification - TalentRank AI

This document specifies the REST API endpoints, parameters, request body schemas, and response formats for TalentRank AI.

---

## 🟢 Base URL
The API base URL is:
```http
http://localhost:5001/api/v1
```

---

## 🛠️ System Endpoints

### 1. Health Check
Checks if the Express server is up and database connection is responsive.
*   **Method**: `GET`
*   **Route**: `/health`
*   **Response**: `200 OK`
```json
{
  "status": "success",
  "message": "TalentRank AI backend API is operational",
  "timestamp": "2026-06-30T13:20:25.000Z"
}
```

### 2. Validation Test
Utility endpoint to verify Zod-based validation.
*   **Method**: `POST`
*   **Route**: `/test-validation`
*   **Request Body**:
```json
{
  "name": "Alex Mercer",
  "email": "alex@mercer.com"
}
```
*   **Success Response**: `200 OK`
```json
{
  "status": "success",
  "message": "Zod validation assertion check passed",
  "data": {
    "name": "Alex Mercer",
    "email": "alex@mercer.com"
  }
}
```
*   **Error Response (Missing Fields)**: `422 Unprocessable Entity`
```json
{
  "status": "fail",
  "message": "Invalid input parameters",
  "errors": [
    {
      "field": "name",
      "message": "name is required"
    },
    {
      "field": "email",
      "message": "invalid email format"
    }
  ]
}
```

---

## 📋 Future Pipeline Endpoints (Specifications Only)

### 1. Candidates Module

#### List & Filter Candidates
*   **Method**: `GET`
*   **Route**: `/candidates`
*   **Query Parameters**:
    *   `minScore` (integer, optional)
    *   `skills` (string array, optional)
    *   `location` (string, optional)
*   **Response**: `200 OK`
```json
{
  "status": "success",
  "results": 5,
  "data": [
    {
      "id": "uuid-1",
      "name": "John Doe",
      "role": "Lead AI Engineer at TechCorp",
      "score": 94,
      "loc": "Bangalore"
    }
  ]
}
```

#### Get Candidate Details
*   **Method**: `GET`
*   **Route**: `/candidates/:id`
*   **Response**: `200 OK`
```json
{
  "status": "success",
  "data": {
    "id": "uuid-1",
    "name": "John Doe",
    "skills": ["Python", "LLMs", "RAG"],
    "experience": [
      {
        "role": "Lead AI Engineer",
        "company": "TechCorp",
        "duration": "2 Yrs"
      }
    ]
  }
}
```

### 2. Job Understanding Module

#### Parse Job Description
*   **Method**: `POST`
*   **Route**: `/jobs/parse`
*   **Request Body**:
```json
{
  "jobDescriptionText": "Looking for a Senior AI Engineer..."
}
```
*   **Response**: `200 OK`
```json
{
  "status": "success",
  "data": {
    "extractedRole": "Senior AI Engineer",
    "experienceLevel": "Senior (5-8 yrs)",
    "skills": ["Python", "LLM", "RAG"],
    "hiddenSignals": ["Startup Mindset", "Leadership"]
  }
}
```

### 3. Ranking Module

#### Compare Candidates
*   **Method**: `POST`
*   **Route**: `/rankings/compare`
*   **Request Body**:
```json
{
  "candidateIds": ["uuid-1", "uuid-2"]
}
```
*   **Response**: `200 OK`
```json
{
  "status": "success",
  "verdict": {
    "recommendedId": "uuid-1",
    "reasoning": "Higher overall match score and production-level RAG deployment experience."
  }
}
```
