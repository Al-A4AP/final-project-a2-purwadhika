-- Best-effort backfill for Google accounts created before auth_provider existed.
UPDATE "users"
SET "auth_provider" = 'GOOGLE'::"AuthProvider",
    "password_set_at" = NULL
WHERE "auth_provider" = 'EMAIL'::"AuthProvider"
AND "avatar_url" ILIKE '%googleusercontent%';
