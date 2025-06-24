# SQL Schema 
 Here are all the tables used to run the application and store informations, you can find the code to create them and explanation about there usage.

**candidates**
*Stores information about job candidates, including contact info, application details, and evaluation scores.*
- **Key columns:**
  - `relevance_score`: Integer score (0-10) representing how well the candidate matches the job.
  - `application_status`: Status of the candidate's application (e.g., To Be Reviewed).
  - `interview_id`: Links to the interview scheduled for the candidate.

```sql
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
```

**chat_messages**
*Stores chat messages exchanged in the system, including sender info and message content.*
- **Key columns:**
  - `user_email`: Email of the user who sent the message.
  - `role`: Role of the sender (e.g., assistant, user).

```sql
CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  user_email text NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id)
);
```

**interviews**
*Contains scheduled interviews between candidates and recruiters for specific posts.*
- **Key columns:**
  - `candidate_id`: References the candidate being interviewed.
  - `recruiter_id`: References the recruiter conducting the interview.
  - `interview_status`: Status of the interview (e.g., Scheduled).

```sql
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
```

**posts**
*Represents job postings or open positions in the organization.*
- **Key columns:**
  - `title`: Title of the job post.
  - `post_status`: Status of the post (e.g., Open).

```sql
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
```

**recruiters**
*Stores information about recruiters who manage candidates and interviews.*
- **Key columns:**
  - `email`: Unique email address of the recruiter.
  - `role`: Role or position of the recruiter in the organization.

```sql
CREATE TABLE public.recruiters (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  role text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT recruiters_pkey PRIMARY KEY (id)
);
```