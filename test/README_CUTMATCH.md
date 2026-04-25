# FilmHouse MVP Scaffold

Copy the `src` folder into your project, merge `package.json` dependencies, create the Supabase tables from `database/schema.sql`, then add your environment variables.

## Install

```bash
pnpm install
```

## Required Supabase setup

1. Enable Auth email provider.
2. Enable pgvector extension.
3. Run `database/schema.sql` in Supabase SQL editor.
4. Create storage buckets:
   - avatars
   - portfolio-thumbnails
   - project-references

## Run

```bash
pnpm dev
```
