# Backend cho BMovie
## Overview
xây dựng hệ thống tích hợp nhiều nguồn và cập nhật tập mưới và phim mới dễ dàng
## Tech Stack
Nestjs

## Cấu trúc route và giải thích
### route movies
/anime-pho-bien          lấy danh sách phim phổ biến
/anime-trong-nam          lấy danh sách phim trong năm
/home                     lấy những danh sách phim phục vụ trang chủ
/search                     lấy query khi người dùng search
/episodes                 lấy danh sách tập của một bộ phim
/info                     lấy thông tin một bộ phim
/stream                   lấy m3u8 của một tập phim
/suggest                  lấy gợi ý khi tìm kiếm (autocomplete)
weakuptime - Do server được deploy trên render bản free nên cứ sau 20p server sẽ ngủ đông, tạo api này để server hoạt động 24/7 thông qua cronjob  tiện việc thử nghiệm
### route auth
/register         Nơi nhận password, username và email đăng ký
/verify           Gửi xác nhận email bằng resend kèm mã OTP
/resend           Gửi lại xác minh email để xác minh lại
/login            Xác minh username và password
/refresh          Cấp lại refreshToken cho user
/logout           Đăng xuất khỏi tài khoản
## Bảo mật
Rate Limiting: Sử dụng `nestjs-throttler` để giới hạn số lượng request từ một IP, ngăn chặn tấn công Brute-force và Spam API.
Request Validation & Sanitization: Sử dụng `class-validator` và `class-transformer` để lọc và xác thực dữ liệu đầu vào, ngăn chặn dữ liệu độc hại xâm nhập database.
CORS Policy: Cấu hình nghiêm ngặt chỉ cho phép các domain tin cậy (Whitelisting) thực hiện request.
## Database (MongoDB)
-Thiết kế bộ khung giúp tích hợp phim từ nhiều nguồn với dữ liệu chuẩn quốc tế làm gốc thông qua các mảng mappings đc thiết kế trong schema
- Cho phép phân loại những dữ liệu đã map và dữ liệu chưa map, đồng thười phân loại những bộ phim đã map theo 2 phần chính là phim đang chiểu và phim đã kết thúc
- Xây dựng khung episode đễ chứa thông tin tập phim từ nhiều nguồn , kết nối với dữ liệu chứa metadata thông qua anilistId
- Đánh index những phần quan trọng để tăng tốc độ truy vấn dũ liệu.
## Tính năng sắp cập nhật
Reset PassWord
Liên kết những season phim lại với nhau

