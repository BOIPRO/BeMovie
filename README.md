# BMovie Backend Service

##  Overview
Hệ thống Backend cho BMovie được phát triển với NestJS, đóng vai trò là "bộ não" xử lý tích hợp đa nguồn, quản lý dữ liệu anime và cung cấp API an toàn cho ứng dụng.

## Tech Stack
*   **Framework:** NestJS
*   **Database:** MongoDB
*   **Security & Utilities:** `nestjs-throttler`, `class-validator`, `class-transformer`, Resend (Email service).

##  API Documentation
### Movies Module
| Route | Description |
| :--- | :--- |
| `/home` | Cung cấp dữ liệu tập trung (Featured, Trending, Recent) cho trang chủ. |
| `/info` | Truy vấn metadata chi tiết của phim (hỗ trợ bởi AniList ID). |
| `/episodes` | Lấy danh sách tập phim từ nhiều nguồn tích hợp. |
| `/stream` | Truy xuất nguồn m3u8 bảo mật cho video player. |
| `/search` | Full-text search và lọc dữ liệu nâng cao. |
| `/suggest` | Cung cấp kết quả Autocomplete thời gian thực. |
| `/anime-*` | Các endpoint phân trang (Pagination) cho danh mục Phổ biến/Trong năm. |

### Auth Module
| Route | Description |
| :--- | :--- |
| `/register` | Đăng ký tài khoản mới. |
| `/verify` | Xác thực email thông qua mã OTP (tích hợp Resend). |
| `/login` | Xác thực người dùng (Credential validation). |
| `/refresh` | Rotation cơ chế RefreshToken đảm bảo phiên làm việc. |
| `/resend` | Gửi lại email xác thực. |

*Lưu ý: Endpoint `weakuptime` được triển khai để duy trì trạng thái hoạt động 24/7 cho server trên môi trường Render (bằng CronJob).*

##  Bảo mật Hệ thống
*   **Rate Limiting:** Tích hợp `nestjs-throttler` để chống Brute-force và Spam request trên các API nhạy cảm.
*   **Data Validation:** Sử dụng `class-validator` và `class-transformer` để đảm bảo toàn vẹn dữ liệu đầu vào, ngăn chặn tấn công Injection.
*   **CORS Policy:** Thiết lập danh sách domain tin cậy (Whitelisting) nghiêm ngặt cho truy cập API.

##  Database Design (MongoDB)
*   **Unified Mapping:** Thiết kế Schema hỗ trợ "mapping" nhiều nguồn dữ liệu vào một cấu trúc chuẩn quốc tế.
*   **Data Categorization:** Phân loại thông minh giữa phim đang chiếu (On-going) và đã kết thúc (Completed).
*   **Efficient Indexing:** Tối ưu hóa Index cho các field quan trọng nhằm tăng tốc độ truy vấn metadata và tập phim.

##  Lộ trình phát triển
*   **Account Recovery:** Triển khai chức năng Quên mật khẩu/Khôi phục tài khoản.
*   **Contextual linking:** Xây dựng logic liên kết các season phim cùng series để nâng cao trải nghiệm xem liên tục.