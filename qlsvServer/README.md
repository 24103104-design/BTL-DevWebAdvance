<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
## Module Book (CRUD cá nhân)

### Object: Book (Sách)

Quản lý thông tin sách trong hệ thống Quản lý thư viện, gồm đầy đủ 5 chức năng CRUD.

### Cấu trúc thư mục
```src/book/

├── book.entity.ts

├── book.service.ts

├── book.controller.ts

├── book.module.ts

└── dto/

├── create-book.dto.ts'''

└── update-book.dto.ts```
### API Endpoints

| Method | Endpoint      | Chức năng                  |
|--------|---------------|-----------------------------|
| POST   | /books        | Tạo sách mới                |
| GET    | /books        | Lấy danh sách tất cả sách   |
| GET    | /books/:id    | Lấy thông tin 1 sách theo id|
| PATCH  | /books/:id    | Cập nhật thông tin sách     |
| DELETE | /books/:id    | Xóa sách                    |

### Activity Diagram - CRUD Book

```mermaid
flowchart TD
    Start([Bắt đầu]) --> Choice{Người dùng chọn hành động}

    Choice -->|Create| C1[Nhập thông tin sách: title, author, isbn,...]
    C1 --> C2{ISBN đã tồn tại?}
    C2 -->|Có| C3[Trả lỗi 409: ISBN trùng]
    C2 -->|Không| C4[Lưu sách mới vào DB]
    C4 --> C5[Trả về sách vừa tạo]
    C3 --> End1([Kết thúc])
    C5 --> End1

    Choice -->|Read| R1[Gửi GET /books hoặc GET /books/:id]
    R1 --> R2{Tìm thấy sách?}
    R2 -->|Có| R3[Trả về dữ liệu sách]
    R2 -->|Không| R4[Trả lỗi 404: không tìm thấy]
    R3 --> End2([Kết thúc])
    R4 --> End2

    Choice -->|Update| U1[Gửi PATCH /books/:id kèm dữ liệu cần sửa]
    U1 --> U2{Sách có tồn tại?}
    U2 -->|Không| U3[Trả lỗi 404]
    U2 -->|Có| U4[Cập nhật các trường thay đổi]
    U4 --> U5[Lưu vào DB]
    U5 --> U6[Trả về sách đã cập nhật]
    U3 --> End3([Kết thúc])
    U6 --> End3

    Choice -->|Delete| D1[Gửi DELETE /books/:id]
    D1 --> D2{Sách có tồn tại?}
    D2 -->|Không| D3[Trả lỗi 404]
    D2 -->|Có| D4[Xóa sách khỏi DB]
    D4 --> D5[Trả về 204 No Content]
    D3 --> End4([Kết thúc])
    D5 --> End4
```

### Lưu ý
Cần cấu hình thông tin kết nối Aiven MySQL trong `app.module.ts` (host, port, username, password, database) để chạy thử thực tế.
