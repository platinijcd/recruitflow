# Product Requirements Document (PRD)

## Product Name: RecruitFlow

---

## 1. Product Summary
RecruitFlow is a comprehensive recruitment management platform designed to streamline the hiring process for teams and agencies. It centralizes candidate applications, job postings, interviews, recruiter management, and integrates with LinkedIn and AI tools for advanced automation and analytics.

---

## 2. Purpose
- Simplify and automate the recruitment workflow
- Provide a single source of truth for all recruitment data
- Enable data-driven hiring decisions with analytics and AI
- Integrate with external tools (LinkedIn, n8n, AI webhooks)

---

## 3. Main Features

### 3.1 Dashboard
- Real-time statistics on applications, jobs, and team performance
- Interactive charts and key metrics
- Recent activity feed

### 3.2 Candidate Management
- List, search, and filter candidates
- Card-based UI with essential info
- Detailed candidate profiles (skills, experience, education, LinkedIn)
- Application status tracking (To Be Reviewed, Relevant, Rejectable)
- Automatic relevance scoring with explanations

### 3.3 Job Post Management
- Create, edit, and view job posts
- Track applications per job
- Job status (Open/Closed)
- Post-level analytics

### 3.4 Interview Management
- Schedule interviews with candidates and recruiters
- Track interview status (Scheduled, Retained, Rejected)
- Store feedback and details
- Calendar view for interviews

### 3.5 Recruiter Management
- Manage recruiter profiles and contact info
- Assign roles (Admin, Recruiter)
- Track recruiter activity

### 3.6 LinkedIn Integration
- Search and import LinkedIn profiles via n8n webhook
- Automated scraping and enrichment
- Add LinkedIn candidates directly to the database

### 3.7 AI Assistant (Chatbot)
- Recruitment-focused conversational assistant
- Persistent chat history
- Markdown support
- Connects to external AI service via webhook

### 3.8 Settings
- Manage webhooks for integrations (AI, LinkedIn, etc.)
- Toggle notification and automation settings

---

## 4. User Roles
- **Admin:** Full access to all features, settings, and team management
- **Recruiter:** Access to candidate, job, and interview management
- 
---

## 5. Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix UI
- **State Management:** TanStack Query
- **Forms & Validation:** React Hook Form, Zod
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Integrations:** n8n (workflows, webhooks), RapidAPI (LinkedIn Scraper), external AI APIs