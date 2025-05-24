# Cơ sở lý thuyết: Phân loại cảm xúc văn bản với TF-IDF và Logistic Regression

## 1. Bài toán phân loại cảm xúc văn bản
Phân loại cảm xúc văn bản là một nhánh của xử lý ngôn ngữ tự nhiên (NLP), nhằm xác định thái độ, cảm xúc (tích cực, tiêu cực, trung tính) của tác giả trong một đoạn văn bản. Đây là bài toán quan trọng trong nhiều lĩnh vực như phân tích dư luận, đánh giá sản phẩm, tài chính, v.v.

## 2. Biểu diễn văn bản bằng vector: TF-IDF
Văn bản là dữ liệu phi cấu trúc, không thể đưa trực tiếp vào các mô hình học máy. Do đó, cần chuyển hóa văn bản thành dạng số (vector hóa). Một trong những phương pháp phổ biến nhất là TF-IDF (Term Frequency - Inverse Document Frequency).

- **TF (Term Frequency):** Đo lường tần suất xuất hiện của một từ trong một văn bản.
- **IDF (Inverse Document Frequency):** Đo lường mức độ quan trọng của một từ, giảm trọng số cho các từ xuất hiện quá phổ biến trong toàn bộ tập văn bản.
- **TF-IDF:** Là tích của TF và IDF, giúp nhấn mạnh các từ đặc trưng cho từng văn bản, giảm ảnh hưởng của các từ phổ biến không mang nhiều ý nghĩa phân biệt.

Công thức:

\[
TFIDF(t, d) = TF(t, d) \times \log\left(\frac{N}{DF(t)}\right)
\]
Trong đó:
- \(t\): từ
- \(d\): văn bản
- \(N\): tổng số văn bản
- \(DF(t)\): số văn bản chứa từ \(t\)

## 3. Mô hình Logistic Regression cho phân loại văn bản
Logistic Regression là một mô hình phân loại tuyến tính, thường được sử dụng cho các bài toán phân loại nhị phân và đa lớp. Mô hình này dự đoán xác suất một văn bản thuộc về một lớp cảm xúc nhất định dựa trên các đặc trưng đầu vào (ở đây là vector TF-IDF).

- **Ưu điểm:**
  - Đơn giản, dễ triển khai, dễ giải thích.
  - Hiệu quả với dữ liệu vừa và nhỏ, đặc biệt khi kết hợp với TF-IDF.
  - Tránh overfitting tốt nhờ regularization.

- **Nhược điểm:**
  - Không mô hình hóa được các quan hệ phi tuyến phức tạp.

## 4. Pipeline xử lý với sklearn
Quy trình xử lý dữ liệu và huấn luyện mô hình được xây dựng thành pipeline:
1. **Tiền xử lý văn bản:** Làm sạch, chuẩn hóa văn bản.
2. **Vector hóa:** Sử dụng `TfidfVectorizer` để chuyển văn bản thành vector đặc trưng.
3. **Huấn luyện mô hình:** Sử dụng `LogisticRegression` để phân loại cảm xúc.

## 5. Lý do chọn phương pháp này
- TF-IDF + Logistic Regression là phương pháp chuẩn mực, hiệu quả cho các bài toán phân loại văn bản truyền thống.
- Dễ triển khai, dễ mở rộng, phù hợp với dữ liệu tiếng Việt và tiếng Anh.
- Được hỗ trợ mạnh mẽ bởi thư viện sklearn, dễ dàng tích hợp vào pipeline tự động.

## 6. Tài liệu tham khảo
- [scikit-learn: Text feature extraction](https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction)
- [scikit-learn: Logistic Regression](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- Jurafsky, D., & Martin, J. H. (2021). Speech and Language Processing (3rd ed.)
