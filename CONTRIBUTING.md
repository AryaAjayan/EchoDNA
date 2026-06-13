# Contributing to EchoDNA

Thank you for your interest in contributing to EchoDNA! We welcome community contributions to help improve the Spotify personality analyzer.

## Code of Conduct

By participating in this project, you agree to maintain a respectful, inclusive, and professional environment for all contributors.

## How to Contribute

### 1. Reporting Bugs
- Search existing issues to see if the bug has already been reported.
- If not, open a new issue detailing:
  - Steps to reproduce the bug.
  - Expected vs. actual behavior.
  - Device, browser, and environment specifications.

### 2. Suggesting Enhancements
- Open an issue explaining the proposed feature and why it would be beneficial to users.

### 3. Code Contributions
- Fork the repository and create a branch from `main`.
- Install dependencies with `npm install`.
- Ensure the project builds cleanly by running `npm run build` before pushing.
- Submit a Pull Request targeting the `main` branch.

## Coding Guidelines
- **TypeScript**: Ensure strict typing is followed. Avoid using `any` types.
- **Styling**: Use Tailwind CSS utility classes and design tokens defined in `app/globals.css`.
- **Transitions**: Follow the smooth transitions spec (`transition-all duration-500`) to keep animations cinematic.
