# Bài tập lớn môn Xử lí ảnh
Ứng dụng cải thiện chất lượng ảnh: Lọc nhiễu, làm trơn, tăng độ nét dùng các bộ lọc trên miền thời gian và lọc trên miền tần số

## Hoạt động phần mềm
Chạy một server đơn giản cung cấp giao diện người dùng qua trình duyệt. Khi người dùng chạy một bộ lọc cụ thể là sẽ gửi
yêu cầu về cho server. Server chạy bộ lọc trên ảnh người dùng cung cấp và trả về ảnh kết quả.

## Yêu cầu cài đặt
- NodeJS, npm
- Python3 và thư viện opencv

## Cài đặt và chạy chương trình
Clone project về máy

```
git clone https://github.com/TYPE-kaze/XLA.git
```

Mở giao diện dòng lệnh trong thư mục vừa clone về, cài đặt các thư viện

```
npm i 
```
Tạo thư mục "uploads" trong thư mục gốc của project. Thư mục này sẽ chứa ảnh đầu vào và kết quả
```
mkdir uploads
```
Chạy server

```
npm run start
```

Truy cập hệ thống qua localhost:10000 bằng trình duyệt