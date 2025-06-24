# RecruitFlow – Project Requirements

## 1. Business Requirements
- Provide a comprehensive recruitment management platform for teams to manage candidates, job posts, interviews, and recruiters.
- Integrate advanced features such as AI-powered chat, LinkedIn profile search, and workflow automation.
- Enable real-time collaboration and analytics for recruitment performance.

## 2. Functional Requirements

### 2.1 Application Management
- Add, view, edit, and filter candidate applications.
- Display candidate details: skills, experience, education, certifications, and LinkedIn profile.
- Assign applications to job posts and recruiters.
- Track application status: To Be Reviewed, Relevant, Rejectable.
- Score candidates and provide justification.

### 2.2 Job Post Management
- Create, edit, and close job posts.
- Track applications per post.
- Display job details: title, description, location, department, company.
- Track post status: Open, Closed.

### 2.3 Interview Management
- Schedule interviews with candidates and recruiters.
- Track interview status: Scheduled, Retained, Rejected.
- Store interview details: date, time, location, feedback.
- Calendar view for interviews.
- Notify candidates via email.

### 2.4 Recruiter Management
- Add, view, and manage recruiter profiles.
- Track recruiter activity and contact info.

### 2.5 LinkedIn Search & Import
- Search LinkedIn profiles via n8n workflow integration.
- Filter by keywords and location.

### 2.6 AI Assistant
- Provide a chatbot for recruitment-related queries.
- Integrate with external AI services via webhook.
- Persist chat history per user.

### 2.7 Analytics & Dashboard
- Real-time statistics on applications, jobs, and team performance.
- Visual charts and recent activity feed.

## 3. Technical Requirements

- **Frontend:** React (TypeScript), Vite, React Router, TanStack Query, Tailwind CSS, Shadcn/ui, Radix UI, Lucide React, Sonner, React Markdown.
- **Backend:** Supabase (PostgreSQL), Row Level Security, Supabase Auth, real-time sync.
- **Integrations:** n8n for workflow automation, RapidAPI for LinkedIn scraping, webhooks for AI/chat/search.
- **Deployment:** Local setup and cloud deployment supported.
- **Setup:**
  - n8n workflows for LinkedIn and AI.
  - Supabase project with provided schema and authentication.
  - API keys for RapidAPI and AI services.
  - Webhook URLs configured in app settings.

## 4. Non-Functional Requirements
- Responsive and accessible UI.
- Secure authentication and data access.
- Real-time updates and notifications.
- Scalable to support multiple recruiters and job posts.

---

*For detailed setup and schema, see the other files in the Setup folder.* 