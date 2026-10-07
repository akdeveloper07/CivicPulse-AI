# CivicPulse REST API Specifications (v1)

Base Endpoint URL: `http://127.0.0.1:8000/api/v1`

---

## 1. Authentication Endpoints

### `POST /auth/register`
- **Description**: Registers a new citizen or municipal administrator account.
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "role": "citizen"
}
```
- **Response**: `201 Created` with User object.

### `POST /auth/login`
- **Description**: Authenticates credentials and returns OAuth2 JWT access token.
- **Request Body**:
```json
{
  "email": "admin@civicpulse.org",
  "password": "AdminPass123!"
}
```
- **Response**: `200 OK` with `access_token` and User object.

---

## 2. Citizen Reports Endpoints

### `POST /reports/check-similarity`
- **Description**: Pre-submission real-time duplicate check against active issues.
- **Request Body**:
```json
{
  "title": "Deep pothole on MG Road near bus stop",
  "description": "Large dangerous crater causing traffic slowdowns and bike risk.",
  "category_id": "cat_potholes_id"
}
```
- **Response**: List of candidate matches with similarity score and evidence.

### `POST /reports`
- **Description**: Submits a new citizen report.
- **Header**: `Authorization: Bearer <token>`
- **Response**: `201 Created` with report object.

---

## 3. Municipal Intelligence & AI Review Endpoints

### `GET /ai/review-queue`
- **Description**: Retrieves candidate report duplicate pairs awaiting human review.

### `POST /ai/matches/{match_id}/decision`
- **Description**: Records administrative decision (`Confirmed duplicate`, `Confirmed related`, `Rejected match`, `Deferred`) with mandatory audit reason.

### `GET /clusters/{id}/priority-explanation`
- **Description**: Retrieves mathematical component breakdown ($I, U, R, A$) for priority score.

### `POST /root-causes/analyze`
- **Description**: Triggers spatial and domain heuristic root-cause correlation discovery.

### `GET /analytics/forecasts`
- **Description**: Retrieves weighted moving average volume forecast with upper/lower confidence bounds.
