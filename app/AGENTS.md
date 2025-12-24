# Instructions for Agents

## Rules

- `routeTree.gen.ts` file is auto generated. No need to edit it.
- Prefer function declarions with `function` keyword over arrow functions for better readability.
- Use shadcn UI for building UIs and shadcn mcp tools to list available UI components.
- Ensure good readability. Split features to multiple smaller components.
  Big components are not maintainable and not readable.
- use camelCase for hook file names.
- It is better to import react APIs like `useEffect` or `useState`
  like this: `import { useEffect, useState } from 'react` instead of `import * as React from 'react'`. The latter is an anti-pattern.
