CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(trim(title)) > 0),
  module text NOT NULL CHECK (module IN ('Genre', 'Scene', 'Photo', 'Text')),
  model text NOT NULL CHECK (model IN ('Sol', 'DeepSeek', 'Astra')),
  response text NOT NULL CHECK (length(trim(response)) > 0),
  status text NOT NULL CHECK (status IN ('accepted', 'error', 'review')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cases_created_at_idx ON cases (created_at DESC);
