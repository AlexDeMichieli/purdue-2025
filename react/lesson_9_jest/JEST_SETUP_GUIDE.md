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

- **
