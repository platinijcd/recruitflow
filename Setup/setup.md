Here is what you need to run the app on your local computer:

1. Download n8n workflows [here](Workflow)
   You will need:
   - A Google Cloud Console app for the Gmail trigger.  
   - An AI API for all AI-related operations.  
   - A Supabase project (obtain your credentials to connect both n8n and the app).
   - RapidAPI API key for this profile scraper [RapidAPI Linkedin Scraper](https://rapidapi.com/rockapis-rockapis-default/api/linkedin-data-api)
  
   After setup, copy all production webhook URLs, as you will need to add them to the app.

2. Setup the Supabase tables using the following schema: [SQL code](<sql schema.md>).  
   You can run this SQL directly in Supabase. If it doesn't work, ask the AI to generate a valid version from the same schema.
   You'll also need Authentication to be enabled.


3. Update the webhooks on the app’s settings page:  
   1. Log in to the app.
   2. Navigate to the settings page.  
   3. Replace the webhook URLs as follows:  
      - `"chat_ai_webhook"`: This is the RAG agent webhook, used on the "chat" page.  
      - `"linkedin_scraper_webhook"`: This is the webhook for the LinkedIn profile scraper, used on the "Recherche" page.

4. Enjoy!
