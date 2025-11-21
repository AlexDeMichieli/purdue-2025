# Jest Setup Guide for React + Vite

This guide explains how to set up Jest for testing React components in a Vite project with ES modules.

## Table of Contents

- [Dependencies Installation](#dependencies-installation)
- [Files Created](#files-created)
- [Configuration Files](#configuration-files)
- [Package.json Scripts](#packagejson-scripts)
- [Running Tests](#running-tests)
- [Why This Setup](#why-this-setup)
- [Common Issues Solved](#common-issues-solved)

## Dependencies Installation

### Step 1: Install Core Testing Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

**Dependency Explanations:**

- **`jest`**: The core testing framework that runs your tests
- **`@testing-library/react`**: Provides utilities for testing React components (render, screen, fireEvent, waitFor)
- **`@testing-library/jest-dom`**: Adds custom matchers like `toHaveTextContent()`, `toBeInTheDocument()`, making assertions more readable
- **`@testing-library/user-event`**: Simulates realistic user interactions (more advanced than fireEvent)
- **`jest-environment-jsdom`**: Provides a DOM implementation for Node.js so you can test components that manipulate the DOM

### Step 2: Install Babel Dependencies

```bash
npm install --save-dev babel-jest @babel/preset-env @babel/preset-react @babel/preset-typescript
```

**Dependency Explanations:**

- **`babel-jest`**: Transforms modern JavaScript/JSX syntax into code Jest can understand
- **`@babel/preset-env`**: Transpiles modern JavaScript (ES6+) to work in Node.js
- **`@babel/preset-react`**: Transforms JSX syntax into regular JavaScript
- **`@babel/preset-typescript`**: (Optional) Enables TypeScript support if needed

## Files Created

### Project Structure

```
lesson_9_jest/
├── src/
│   └── components/
│       ├── Counter.jsx          # Custom component to test
│       ├── Counter.test.jsx     # Test suite
│       ├── TodoList.jsx         # useReducer example
│       ├── TodoList.test.jsx    # useReducer tests
│       ├── FocusInput.jsx       # useRef example
│       └── FocusInput.test.jsx  # useRef tests
├── babel.config.cjs              # Babel configuration
├── jest.config.cjs               # Jest configuration
├── jest.setup.cjs                # Test setup file
├── JEST_SETUP_GUIDE.md          # This guide
├── USE_REDUCER_GUIDE.md         # useReducer guide
├── USE_REF_GUIDE.md             # useRef guide
└── package.json                  # Added test scripts
```

## Configuration Files

### 1. `jest.config.cjs`

**Purpose**: Main Jest configuration file

**Why `.cjs` extension**: Your project uses `"type": "module"` in package.json, which makes `.js` files use ES module syntax. Jest configuration needs CommonJS, so we use `.cjs` extension.

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.jsx',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react|react-dom)/)',
  ],
};
```

**Key Configuration Explanations:**

- **`testEnvironment: 'jsdom'`**: Simulates a browser environment for React components
- **`transform`**: Tells Jest to use babel-jest to transform JSX and modern JS
- **`moduleNameMapper`**: Mocks CSS imports (Jest can't process CSS files)
- **`setupFilesAfterEnv`**: Points to setup file that runs before each test
- **`collectCoverageFrom`**: Specifies which files to include in coverage reports
- **`transformIgnorePatterns`**: Allows transformation of React packages in node_modules

### 2. `babel.config.cjs`

**Purpose**: Configures Babel to transform JSX and modern JavaScript for Jest

**Why `.cjs` extension**: Same reason as jest.config.cjs - needs CommonJS format

```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    },
  },
};
```

**Key Configuration Explanations:**

- **`@babel/preset-env`**: Transforms ES6+ syntax for Node.js
- **`@babel
