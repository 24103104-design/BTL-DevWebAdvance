# BTL-DevWebAdvance

## Thông tin nhóm
- **Nguyễn Thanh Lâm - 24103104**: PhieuMuon / Phiếu mượn
- **Trương Văn Đạt - 24100480**: Sach / Sách
- **Nguyễn Huy Kiên - 24100137**: DocGia / Độc giả

## Mô tả dự án
Dự án này là bài tập phát triển backend bằng NestJS với các module chính:
- Quản lý sách
- Quản lý độc giả
- Quản lý phiếu mượn

## Cấu trúc dự án
- `qlsvServer/`: thư mục backend chính
- `README.md`: tài liệu hướng dẫn dự án

## Hướng dẫn chạy dự án
1. Vào thư mục `qlsvServer`
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Chạy server ở chế độ phát triển:
   ```bash
   npm run start:dev
   ```

## Vấn đề Luật, đạo đức xã hội và đạo đức nghề nghiệp

Trong quá trình làm project quản lý thư viện, nhóm không chỉ tập trung vào việc làm sao cho chương trình chạy được mà còn cố gắng xây dựng một hệ thống có trách nhiệm về mặt bảo mật, đúng quy định và phù hợp với đạo đức. Sau khi xem qua các thư mục và các module của project, nhóm nhận thấy project đã có một số biện pháp cơ bản về security và cũng đã có ý thức trong việc bảo vệ người dùng cũng như giữ cho sản phẩm đúng chuẩn nghề nghiệp.

### 1. Vấn đề Security trong project
Project đã có một số biện pháp bảo mật cơ bản như sau:

- Hệ thống có phần đăng nhập và đăng ký bằng JWT, tức là khi người dùng đăng nhập thì sẽ nhận được token để xác thực trong các request tiếp theo.
- Có guard riêng để kiểm soát các route cần đăng nhập mới được truy cập, nên không phải ai cũng có thể xem hoặc thao tác dữ liệu tùy ý.
- Mật khẩu của người dùng không được lưu ở dạng plain text. Trong project, mật khẩu được băm bằng bcrypt trước khi lưu vào cơ sở dữ liệu, giúp giảm nguy cơ bị lộ thông tin khi có rủi ro về bảo mật.
- Các dữ liệu đầu vào từ người dùng như username, email, password đều được kiểm tra bằng DTO và class-validator. Điều này giúp ngăn chặn dữ liệu không hợp lệ hoặc thiếu thông tin từ việc đi vào hệ thống.
- Ở file main, nhóm đã dùng ValidationPipe để kiểm tra và xử lý dữ liệu đầu vào một cách tự động, giúp hệ thống ít bị lỗi do dữ liệu sai format hơn.
- Project cũng có cấu trúc dùng biến môi trường cho thông tin nhạy cảm như database và secret key, thay vì hardcode trực tiếp trong code. Đây là một cách làm tốt để tránh lộ thông tin quan trọng.

Những điểm trên cho thấy nhóm đã có ý thức về bảo mật ngay từ đầu, chứ không chỉ làm theo chức năng đơn thuần.

### 2. Luật
Khi xây dựng project, nhóm cũng cần có ý thức tuân thủ pháp luật để sản phẩm không bị xem là vi phạm quyền lợi của người khác.

Một số điểm nhóm đã lưu ý là:

- Không sao chép trái phép code, hình ảnh, tài liệu hoặc nội dung có bản quyền mà không được phép.
- Chỉ sử dụng các thư viện, framework và tài nguyên có nguồn rõ ràng, tránh việc sử dụng phần mềm hoặc dữ liệu không hợp pháp.
- Bảo vệ dữ liệu người dùng như username, email, password và các thông tin liên quan. Vì nếu thông tin này bị lộ, sẽ gây ảnh hưởng đến quyền riêng tư của người dùng.
- Không sử dụng project để thu thập, chia sẻ hoặc khai thác dữ liệu trái phép.
- Trong project, các thông tin quan trọng được kiểm soát chặt chẽ hơn, tránh việc để lộ dữ liệu cho người không được phép.

Nói ngắn gọn, nhóm hiểu rằng làm đồ án không chỉ là làm cho đẹp hoặc chạy được, mà còn phải làm đúng luật và có trách nhiệm với người dùng.

### 3. Vấn đề đạo đức xã hội
Ngoài vấn đề pháp luật, project cũng cần phải phù hợp với đạo đức xã hội. Vì sản phẩm này không chỉ phục vụ cho mục đích học tập mà còn có thể ảnh hưởng đến cách người dùng nhìn nhận về công nghệ và về tính chuyên nghiệp của sinh viên.

Nhóm đã cố gắng thực hiện các điều sau:

- Xây dựng project với mục tiêu hỗ trợ quản lý thư viện, giúp việc mượn trả sách trở nên dễ dàng và có tổ chức hơn.
- Không tạo ra những chức năng có thể gây hiểu lầm, lừa đảo hoặc làm ảnh hưởng đến người khác.
- Tôn trọng quyền riêng tư của người dùng, không thu thập dữ liệu quá mức và không sử dụng thông tin cá nhân cho mục đích không cần thiết.
- Chú trọng đến trải nghiệm người dùng, thiết kế giao diện rõ ràng và dễ dùng để người dùng có thể tiếp cận hệ thống một cách thuận tiện.
- Không đưa vào những nội dung hoặc chức năng gây xúc phạm, phân biệt đối xử hoặc có tính gây hại cho cộng đồng.

Như vậy, từ góc nhìn đạo đức xã hội, project của nhóm hướng tới giá trị tích cực, phục vụ người dùng và góp phần tạo nên một môi trường làm việc lành mạnh hơn.

### 4. Đạo đức nghề nghiệp
Đạo đức nghề nghiệp là phần rất quan trọng khi làm việc nhóm. Trong quá trình làm project, nhóm đã cố gắng giữ thái độ làm việc chuyên nghiệp và có trách nhiệm.

Một số điểm nhóm đã thực hiện như:

- Làm việc theo nhóm, phân công công việc rõ ràng và tôn trọng nhau trong quá trình thực hiện.
- Không copy công việc của người khác mà không hiểu bản chất, mà cố gắng tự nghiên cứu và hiểu code để có thể phát triển đúng hướng.
- Có trách nhiệm với phần việc mình làm, không đổ lỗi cho người khác khi gặp lỗi và luôn cố gắng sửa lỗi.
- Chấp nhận góp ý và phản hồi để cải thiện sản phẩm, thay vì bảo thủ với ý tưởng của mình.
- Cố gắng viết code sạch hơn, rõ ràng hơn và có cấu trúc hợp lý để người khác dễ đọc, dễ bảo trì.
- Khi phát triển hệ thống, nhóm cũng quan tâm đến bảo mật, vì đó là trách nhiệm của người làm nghề công nghệ.


### 5. Kết luận
Tóm lại, khi làm project, nhóm không chỉ nghĩ đến chức năng chạy được mà còn cần có trách nhiệm với pháp luật, đạo đức xã hội và đạo đức nghề nghiệp. Project này đã có một số biện pháp bảo mật cơ bản như dùng JWT, bcrypt, validation, guard và biến môi trường. Ngoài ra, nhóm cũng có ý thức bảo vệ dữ liệu người dùng, không làm sai lệch mục đích của sản phẩm và luôn cố gắng làm việc chuyên nghiệp hơn. Đây là những điều rất cần thiết đối với một sinh viên học công nghệ thông tin, vì kỹ năng nghề nghiệp không chỉ nằm ở code mà còn nằm ở cách mình làm việc và cách mình đối xử với người dùng cũng như với đồng nghiệp.


