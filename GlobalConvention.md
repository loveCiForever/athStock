# React Project Convention

## Table of Contents
- [React Project Convention](#react-project-convention)
  - [Table of Contents](#table-of-contents)
- [React Project Naming Convention](#react-project-naming-convention)
  - [1. Folder Naming](#1-folder-naming)
  - [2. File Naming](#2-file-naming)
  - [3. Function \& Variable Naming](#3-function--variable-naming)
  - [4. Common Folder Structure](#4-common-folder-structure)
  - [5. Other Naming Tips](#5-other-naming-tips)
- [React + TypeScript Coding Convention](#react--typescript-coding-convention)
  - [1. Component Declaration](#1-component-declaration)
  - [2. Hooks Usage](#2-hooks-usage)
  - [3. State Management](#3-state-management)
  - [4. Imports Order](#4-imports-order)
  - [5. JSX \& Formatting](#5-jsx--formatting)
  - [6. Type Annotations](#6-type-annotations)
  - [7. Miscellaneous](#7-miscellaneous)

# React Project Naming Convention

## 1. Folder Naming
- **Kebab-case**: `feature-name`, `user-profile`, `auth-form`
  - Example: `/components/user-profile/`
- Use folders for **components**, **hooks**, **pages**, **assets**, **contexts**, etc.

---

## 2. File Naming
- **Component Files**: `PascalCase`
  - Example: `UserProfile.jsx`, `LoginForm.tsx`
- **Hook Files**: `useCamelCase`
  - Example: `useAuth.js`, `useFetchData.ts`
- **Context Files**: `PascalCase` or `CamelCase`
  - Example: `AuthContext.jsx`, `ThemeContext.js`
- **Utility Files**: `kebab-case`
  - Example: `format-date.js`, `api-client.ts`
- **Styles**: `ComponentName.module.css` or `.scss`
  - Example: `UserProfile.module.css`

---

## 3. Function & Variable Naming
- **CamelCase** for functions, variables, hooks
  - Example: `getUserData()`, `isLoading`, `handleSubmit`
- **PascalCase** for React Components
  - Example: `UserProfile`, `DashboardPage`

---

## 4. Common Folder Structure
```plaintext
/src
  /components
    /UserProfile
      UserProfile.jsx
      UserProfile.module.css
  /hooks
    useAuth.js
  /pages
    /Dashboard
      Dashboard.jsx
  /contexts
    AuthContext.jsx
  /utils
    api-client.js
  /assets
    /images
    /styles
  App.jsx
  index.jsx
```

---

## 5. Other Naming Tips
- Prefix boolean variables with `is`, `has`, `can`
  - Example: `isLoading`, `hasError`, `canSubmit`
- Keep filenames **singular** unless they export multiple items.
  - `Button.jsx`, **NOT** `Buttons.jsx`

---

# React + TypeScript Coding Convention

## 1. Component Declaration
- Always use **function components** with arrow functions.
- Type props using **TypeScript interfaces** or types.

```tsx
interface UserProfileProps {
  name: string;
  age: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, age }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>{age} years old</p>
    </div>
  );
};
```

## 2. Hooks Usage
- Use **custom hooks** for reusable logic.
- Prefix with `use`.

```tsx
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  // logic...
  return { user };
};
```

## 3. State Management
- Prefer **useState**, **useReducer** for local state.
- Use **Context API** or **external libraries** (e.g., Redux, Zustand) for global state.

## 4. Imports Order
1. React and core libraries
2. Third-party libraries
3. Aliases or absolute imports
4. Relative imports (components, utils, styles)

```tsx
import React from 'react';
import { useSelector } from 'react-redux';
import UserProfile from '@/components/UserProfile';
import { formatDate } from '../utils/format-date';
import './Dashboard.module.css';
```

## 5. JSX & Formatting
- Use **self-closing tags** when no children.
- Keep JSX clean and readable.

```tsx
<input type="text" />
<Button onClick={handleClick}>Submit</Button>
```

## 6. Type Annotations
- Always type function parameters and return values.
- Avoid using `any`.

```tsx
const calculateTotal = (items: number[]): number => {
  return items.reduce((sum, item) => sum + item, 0);
};
```

## 7. Miscellaneous
- Use **optional chaining** and **nullish coalescing**.
  - Example: `user?.name ?? 'Guest'`
- Use **async/await** for async operations.
- Consistent **linting** and **formatting** (e.g., ESLint, Prettier).
- Avoid **magic numbers/strings**, use constants or enums.

```tsx
const API_URL = 'https://api.example.com';
```

