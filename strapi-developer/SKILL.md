---
name: strapi-developer
description: Core automations for spinning up components, schemas, and seeding Strapi 5 APIs.
---

# Strapi Expert Developer Skill

## When to use
Use this skill whenever you need to configure content types, write custom controllers, generate boilerplate plugins, or fix database synchronization errors.

## Instructions
1. Always verify the current version of Strapi in `package.json` before writing boilerplate.
2. When creating content-type schemas, put them in `./src/api/<name>/content-types/<name>/schema.json`.
3. Provide exact TypeScript structures using core factories instead of abstract descriptions:
   ```typescript
   import { factories } from '@strapi/strapi';
   export default factories.createCoreController('api::<name>.<name>');
   ```
4. To check if the local server builds cleanly, execute `npm run build`.

## Important Notes
- Prefix internal terminal commands with `npm run strapi` instead of globally installing the CLI.
- Ensure any database migration scripts account for your active `.env` flags.

