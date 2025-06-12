
-- Run each part one by one from top to bottom. 
-- Please refer to flowchart for more context and FK relatioships.

"""sql
CREATE TABLE public.candidates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'NOT_NULL'::text,
  email text NOT NULL,
  phone text,
  linkedin_url text,
  cv_url text,
  application_date timestamp without time zone DEFAULT now(),

desired_position text,
  certifications ARRAY,
  profile_summary text,
  relevance_score integer CHECK (relevance_score >= 0 AND relevance_score <= 10),
  score_justification text,
  interview_date timestamp without time zone,
  recruiter_assigned text,
  post_id uuid,
  application_status USER-DEFINED NOT NULL DEFAULT 'To Be Reviewed'::application_status,
  experiences ARRAY,
  degrees ARRAY,
  skills ARRAY,
  interview_id uuid,
  CONSTRAINT candidates_pkey PRIMARY KEY (id),
  CONSTRAINT candidates_interview_id_fkey FOREIGN KEY (interview_id) REFERENCES public.interviews(id),
  CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES public.posts(id)
);

CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  user_email text NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id)
);

CREATE TABLE public.interviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL,
  recruiter_id uuid NOT NULL,
  post_id uuid NOT NULL,
  scheduled_at timestamp with time zone NOT NULL,
  location text DEFAULT 'Dakar, Senegal'::text,
  feedback text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  interview_status USER-DEFINED NOT NULL DEFAULT 'Scheduled'::interviews_status,
  CONSTRAINT interviews_pkey PRIMARY KEY (id),
  CONSTRAINT interviews_recruiter_id_fkey FOREIGN KEY (recruiter_id) REFERENCES public.recruiters(id),
  CONSTRAINT interviews_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id),
  CONSTRAINT interviews_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);

CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  department text,
  location text,
  created_at timestamp without time zone DEFAULT now(),
  post_status USER-DEFINED NOT NULL DEFAULT 'Open'::"Post_status",
  enterprise text,
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);

CREATE TABLE public.recruiters (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  role text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT recruiters_pkey PRIMARY KEY (id)
);
"""