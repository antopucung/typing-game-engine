CREATE TABLE typing_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT,
  wpm DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION NOT NULL,
  score INTEGER NOT NULL,
  words_typed INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE typing_stats (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE,
  total_sessions INTEGER DEFAULT 0,
  best_wpm DOUBLE PRECISION DEFAULT 0,
  best_accuracy DOUBLE PRECISION DEFAULT 0,
  total_words_typed INTEGER DEFAULT 0,
  total_time_played INTEGER DEFAULT 0,
  average_wpm DOUBLE PRECISION DEFAULT 0,
  average_accuracy DOUBLE PRECISION DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_typing_sessions_user_id ON typing_sessions(user_id);
CREATE INDEX idx_typing_sessions_created_at ON typing_sessions(created_at);
