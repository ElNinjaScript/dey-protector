-- Create lua_files table for storing protected Lua code
CREATE TABLE IF NOT EXISTS lua_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id TEXT UNIQUE NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on file_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_lua_files_file_id ON lua_files(file_id);

-- Enable RLS
ALTER TABLE lua_files ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read files (they'll see "access denied!" anyway)
CREATE POLICY "Anyone can read lua files"
  ON lua_files
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert
CREATE POLICY "Anyone can insert lua files"
  ON lua_files
  FOR INSERT
  WITH CHECK (true);
