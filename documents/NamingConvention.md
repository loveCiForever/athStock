# 📂 Folder & File Naming Conventions

## 1️⃣ Folder Naming Conventions

- **Use lowercase with hyphens (`kebab-case`)**  
  ✅ **Recommended:** `auth-service/`, `blog-editor/`, `data-processing/`  
  ❌ **Avoid:** `AuthService/`, `blogEditor/`, `DATA_PROCESSING/`  
  **Reason:** Hyphens improve readability and compatibility.

- **Group related folders logically**  
  ✅ Recommended structure:
  ├── src/ 
  │ ├── hooks/ 
  │ ├── services/ 
  │ ├── components/ 
  │ ├── utils/ 
  │ ├── models/


- **Pluralize folders if they contain multiple related files**  
✅ **Recommended:** `components/`, `models/`, `pages/`  
❌ **Avoid:** `component/`, `page/`  

---

## 2️⃣ File Naming Conventions

- **Use PascalCase for React components**  
✅ **Recommended:** `AuthProvider.jsx`, `BlogCard.jsx`, `MarketPage.jsx`  
❌ **Avoid:** `auth-provider.jsx`, `blog_card.js`  

- **Use camelCase for utility files and hooks**  
✅ **Recommended:** `formatDate.js`, `useSession.js`  
❌ **Avoid:** `FormatDate.js`, `use_session.js`  

- **Use lowercase with hyphens for configurations & static files**  
✅ **Recommended:** `firebase-config.js`, `tailwind.config.js`  
❌ **Avoid:** `FirebaseConfig.js`, `tailwindConfig.js`  

- **Use descriptive names for API services**  
✅ **Recommended:** `auth.service.js`, `blog.service.js`  
❌ **Avoid:** `service.js`, `dataFetcher.js`  

---

## 🔍 Extra Tips

✅ **Consistency is key**: Pick a standard and use it across your project!  
✅ **Avoid spaces & special characters**: Stick to letters, numbers, hyphens, and underscores.  
✅ **Be descriptive but concise**: A name like `fetchUserData.js` is better than just `data.js`.  

---
