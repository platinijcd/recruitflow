# RecruitFlow  
**React · TypeScript · Supabase · Tailwind CSS**

![Slide 16_9 - 1](https://github.com/user-attachments/assets/583616d7-27fe-4f54-b88f-d7d04426f564)
RecruitFlow is a comprehensive recruitment management platform built with React, TypeScript, and Supabase. It offers an all-in-one solution to manage applications, job posts, interviews, and the recruitment team, with advanced AI features and LinkedIn integration.

---

## 🚀 Key Features

### 📊 Analytical Dashboard
- **Real-time overview**: Complete statistics on applications, open positions, relevant candidates, and team performance  
- **Interactive charts**: Breakdown of applications by status and job states  
- **Recent activity**: Track the latest applications and job postings  
- **Key metrics**: Recruitment performance indicators  

### 👥 Application Management
- **User-friendly interface**: Card-based display with essential information  
- **Advanced filtering**: Search by name, email, desired role, status, and related job  
- **Scoring system**: Automatic relevance score with explanation  
- **Application statuses**:
  - 🔵 To Be Reviewed – New applications  
  - 🟢 Relevant – Validated applications  
  - 🔴 Rejectable – Disqualified applications  
- **Detailed profiles**: Skills, experiences, education, certifications  
- **LinkedIn integration**: Direct access to candidate profiles  

### 💼 Job Post Management
- **Create & edit**: Complete forms to define job openings  
- **Application tracking**: Real-time count of applications per post  
- **Job statuses**:
  - 🟢 Open – Actively accepting applications  
  - 🔴 Closed – Filled or paused positions  
- **Detailed information**: Title, description, location, company, department  
- **Post-level analytics**: Application statistics by job  

### 🗓️ Interview Management
- **Smart scheduling**: Create interviews with candidates and recruiters  
- **Interview statuses**:
  - 📅 Scheduled – Interview planned  
  - ✅ Retained – Candidate selected  
  - ❌ Rejected – Candidate not selected  
- **Full details**: Date, time, location, post-interview feedback  
- **Calendar view**: Chronological interface of interviews  

### 👨‍💼 Team Management
- **Recruiter profiles**: Complete management of the recruitment team  
- **Roles and permissions**: Admin vs Recruiter roles  
- **Contact info**: Email, phone, areas of expertise  
- **Activity history**: Track recruiter actions  

### 🔍 Advanced LinkedIn Search
- **n8n integration**: Webhook to automate profile search  
- **Multi-criteria search**: Keyword and location-based queries  
- **Enriched results**: Complete profiles with photo, bio, and location  
- **Direct import**: Add LinkedIn profiles to the candidate database  
- **Automated scraping**: Data extraction via n8n workflows  

### 🤖 Built-in AI Assistant
- **Smart chatbot**: Recruitment-focused conversational assistant  
- **Persistent history**: Save conversations by user  
- **Markdown support**: Richly formatted responses  
- **Webhook integration**: Connect to external AI service via n8n  

---

## 🛠️ Tech Stack

### Frontend
- React 18.3.1 with TypeScript  
- Vite for build and development  
- React Router for navigation  
- TanStack Query for state and cache management  
- React Hook Form + Zod for form validation  
- date-fns for date handling  

### UI/UX
- Tailwind CSS 3.4.11 for styling  
- Shadcn/ui for base components  
- Radix UI for accessible primitives  
- Lucide React for icons  
- Sonner for toast notifications  
- React Markdown for markdown rendering  

### Backend & Database
- Supabase as backend-as-a-service  
- PostgreSQL with Row Level Security (RLS)  
- Auth: Supabase email/password authentication  
- Real-time: Live data sync via Supabase  

### External Integrations
- n8n for workflow automation 
- RApidAPI  via n8n for profile scraping  
- Webhooks for AI services and search tools

## Setup
 Check this folder for more details : [Setup Guide](Setup)