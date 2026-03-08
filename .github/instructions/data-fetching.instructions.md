---
description: Read this file to understand how to fetch data in this project.
---
# Data Fetching Guidelines
This document outlines the best practices and guidelines for fetching data in our Next.js applications.
Adhering to these guidelines will help ensure consistency, maintainability, and performance across our codebase.

## 1. Use Server Components for Data Fetching
In Next.js, ALWAYS use Server Components to fetch data. Server Components allow you to fetch data on the server side, which can improve performance and reduce the amount of JavaScript sent to the client. 
NEVER use Client Components for data fetching, as this can lead to unnecessary client-side rendering and performance issues.

## 2. Data Fetching Methods
ALWAYS use the helper functions in the /data directory to fetch data. NEVER fetch data directly in your components.

ALL helper functions in the /data directory should use Drizzle ORM to interact with the database. This ensures that our data fetching logic is consistent and maintainable.