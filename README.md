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

___

## API

### `/user`

*`POST`*

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

### `/user/:username`

#### PUT

##### `?action=reset-password`

Reset user password with a new one. User must be authenticated

##### `?action=forgot-password`

Reset existing password and generate random password

___

### `/doctor`

*`POST`*

Add new doctor.
Body

```json
Body {
  "fullName": "John Doe",
  "specialist": "specialist-id"
}

Headers {
  "token": "token"
}
```

___

### `/doctor/:id`

#### GET

Get doctor with `id`

```json
Headers {
  "token": "token"
}
```

___

### `/schedule`

*`GET`*

Get summary of all schedule of all doctor with today queue status

___

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
