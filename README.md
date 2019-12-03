# Welcome to Patient Queue Server 👋

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)

> NodeJS Server to handle Queue Process

## Prerequisites

<!-- 1. [VSCode](https://code.visualstudio.com/) with the Prettier extension -->

1. [Git](https://git-scm.com/)
2. [Node](https://nodejs.org/en/) 10 - recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage versions
3. [NPM](https://www.npmjs.com)
4. [redis-server](https://redis.io/download)

## Install

```sh
npm install
```

## Usage

Make sure `redis-server` is running

### Development

```sh
npm run start
```

### Production

```sh
npm run start:prod
```

## Run tests

```sh
npm run test
```

---

## API

### `/users`

_`POST`_

Add new user

```json
Body {
  "username": "username",
  "password": "password",
  "role": "patient",
  "fullName": "John Doe",
  "phoneNumber: "+62..." // [optional]
}
```

### `/users/:id`

#### PUT

##### `?action=reset-password`

Reset user password with a new one. User must be authenticated

<!-- ##### `?action=forgot-password`

Reset existing password and generate random password -->

---

### `/doctors`

_`POST`_

Add new doctor.
Body

```json
Body {
  "fullName": "John Doe",
  "specialist": "specialist-id",
  "title": ""

}

Headers {
  "token": "token"
}
```

_`GET`_

Find all doctors

```json
Headers {
  "token": "token"
}
```

---

### `/doctors/:id`

_`GET`_

Get doctor with `id`

```json
Headers {
  "token": "token"
}
```

_`PUT`_

Update doctor profile

```json
Body {
  "fullName": "John Doe",
  "specialist": "specialist-id"
}

Headers {
  "token": "token"
}
```

#### `?action=claim`

Claim this doctor profile to new user

```json
Body {
  "username": "username",
  "password": "password",
  "role": "patient",
  "fullName": "John Doe",
  "phoneNumber: "+62..." // [optional]
}
```

---

### `/appointments?date=YYYY-MM-DD`

_`GET`_

Get summary of all appointment of all doctor with today queue status

```json
Headers {
  "token": "token"
}

Response {
  "data": [
    {
      "id": "doctor-id",
      "fullName": "Doctor Name",
      "degree": ["SpOG", "M. Kes"],
      ""
    }
  ]
}
```

---

### `/schedules`

#### Schedule

```json
{
  "id": "string",
  /** user-id */
  "doctorID": "string",
  "doctorName": "string",
  /** iso day week 1 ~ 7 */
  "dayOfWeek": "number",
  /** 0 ~ 23 */
  "startHour": "number",
  /** 0 ~ 59 */
  "startMinute": "number",
  /** 0 ~ 23 */
  "endHour": "number",
  /** 0 ~ 59 */
  "endMinute": "number",
  /** queue limit */
  "limit": "number",
  /** "open" | "close" */
  "status": "open"
}
```

_`POST`_

add [`Schedule`](####schedule)

```js
Headers {
  "token": "token"
}

Body {
  ...Schedule
}
```

---

### `/schedules/doctors`

_`GET`_

Get all schedules of all doctors

```json
Headers {
  "token": "token"
}
```

---

### `/schedules/doctors/:id`

_`POST`_

Add [`Schedule`](####schedule) for doctor `:id`

```typescript
Headers {
  token: "token"
}

Body {
  schedules: Schedule[]
}
```

_`GET`_

Get all schedules of doctor `:id`

```json
Headers {
  "token": "token"
}
```

---

### `/schedules/:id`

_`PUT`_

Update schedule with `:id`

```json
Headers {
  "token": "token"
}

Body {
  "id": "string",
  /** user-id */
  "doctorID": "string",
  "doctorName": "string",
  /** iso day week 1 ~ 7 */
  "dayOfWeek": "number",
  /** 0 ~ 23 */
  "startHour": "number",
  /** 0 ~ 59 */
  "startMinute": "number",
  /** 0 ~ 23 */
  "endHour": "number",
  /** 0 ~ 59 */
  "endMinute": "number",
  /** queue limit */
  "limit": "number",
  /** "open" | "close" */
  "status": "open"
}
```

---

### `/schedules/:id-:date/queue`

#### Queue

```json
Queue {
  "date": "2019-11-11",
  "scheduleID": "schedule-id",
  "doctorID": "doctor-id",
  "patientID": "user-id",
  "patientName": "Foo Bar",
  "status": "re-register", // "waiting" | "on-process" | "delayed" | "void"
  "createdAt": "timestamp",
  "validatedAt": "timestamp", // re-register timestamp
  "startAt": "timestamp", // called by doctor timestamp
  "endAt": "timestamp", // finish with doctor timestamp
  "queueNum": 0
}
```

#### Queue Status

- _re-register_ : waiting for patient to re-register to front desk
- _waiting_ : patient has re-registered, waiting for call
- _delayed_ : patient has re-registered but late, put into delayed list
- _on-process_ : patient is with doctor
- _void_ : patient never came

_`POST`_

Add new queue for schedule with `:id` at date `:date`,
Validate queue capacity by the time patient submit form [queue](####queue)

```json
Headers {
  "token": "token"
}

Body {
  "date": "2019-11-11",
  "scheduleID": "schedule-id",
  "doctorID": "doctor-id",
  "patientID": "user-id",
  "patientName": "Foo Bar",
  "validated": false,
  "status": "re-register", // "waiting" | "on-process" | "delayed" | "void"
  "createdAt": "timestamp",
  "validatedAt": "timestamp", // re-register timestamp
  "startAt": "timestamp", // called by doctor timestamp
  "endAt": "timestamp", // finish with doctor timestamp
  "queueNum": 0
}
```

_*GET*_

Get overall queue status for schedule `:id` at `:date`

```json
Headers {
  "token": "token"
}

Response {
  "maxQueue": 30,
  "totalQueue": 29,
  "currentQueue": 0,
  "date": "2019-11-11",
  "doctorID": "doctor-id",
  "doctorName": "John Doe",
  "status": "open" // "max-limit" | "canceled" | "close"
}
```

---

### `/schedules/:id-:date/queue/:num`

_*GET*_

Get queue info of schedule `:id` at `:date` with queue `:num`

```json
Headers {
  "token": "token"
}

Queue {
   "date": "2019-11-11",
  "scheduleID": "schedule-id",
  "doctorID": "doctor-id",
  "patientID": "user-id",
  "patientName": "Foo Bar",
  "status": "re-register", // "waiting" | "on-process" | "delayed" | "void"
  "createdAt": "timestamp",
  "validatedAt": "timestamp", // re-register timestamp
  "startAt": "timestamp", // called by doctor timestamp
  "endAt": "timestamp", // finish with doctor timestamp
  "queueNum": 0
}
```

_*PUT*_ `?action=verify`

Verify queue number

```json
Headers {
  "token": "token"
}

Queue {
  "date": "2019-11-11",
  "scheduleID": "schedule-id",
  "doctorID": "doctor-id",
  "patientID": "user-id",
  "patientName": "Foo Bar",
  "status": "re-register", // "waiting" | "on-process" | "delayed" | "void"
  "createdAt": "timestamp",
  "validatedAt": "timestamp", // re-register timestamp
  "startAt": "timestamp", // called by doctor timestamp
  "endAt": "timestamp", // finish with doctor timestamp
  "queueNum": 0
}
```

---

<!-- | /patient            | GET    | -                                      | `doctor:username` | `token` | Find All patient by doctor         | -->
<!-- | /patient/:username  | GET    | -                                      | -                 | `token` | Find patient profile by username   | -->

| End Point               | Method | Body                                   | Query             | Header  | Desc                               |
| ----------------------- | ------ | -------------------------------------- | ----------------- | ------- | ---------------------------------- |
| /user                   | POST   | `username: string`, `password: string` | -                 | -       | Register                           |
| /user/login             | POST   | `username: string`, `password: string` | -                 | -       | Login                              |
|                         |        |                                        |                   |         |                                    |
| /doctor                 | POST   | `fullName: string`, `specialist`       | -                 | `token` | Find All doctor                    |
| /doctor                 | GET    | -                                      | -                 | `token` | Find All doctor                    |
| /doctor/:username       | GET    | -                                      | -                 | `token` | Find doctor profile by username    |
| /doctor/:username/queue | GET    | -                                      | -                 | `token` | Find doctor queue list by username |
|                         |        |                                        |                   |         |                                    |
| /schedule/:username     | POST   | `doctor schedule`                      | -                 | `token` | Add doctor schedule by username    |
| /schedule/:username     | PUT    | `doctor schedule`                      | -                 | `token` | Edit doctor schedule by username   |
| /schedule/:username     | DELETE | `doctor schedule`                      | -                 | `token` | Remove doctor schedule by username |
| /schedule/:username     | GET    | -                                      | -                 | `token` | Find doctor schedule by username   |
|                         |        |                                        |                   |         |                                    |
| /queue                  | POST   | `doctorID, patient profile`            | -                 | `token` | Add queue                          |
| /queue?doctor           | GET    |                                        | `doctor:username` | `token` | Find all queue of doctor,          |
| /queue/:id              | PUT    | `queue status`                         | -                 | `token` | Update queue status with id        |
| /queue/:id              | GET    | -                                      | -                 | `token` | Get queue status with id           |

## Author

👤 **Restu** [@/restuu](https://github.com/restuu)

👤 **Tatag** [@/restuu](https://github.com/TatagW)

- Github: [@/tamaApotek](https://github.com/tamaApotek)

<!-- ## Show your support

Give a ⭐️ if this project helped you! -->

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
