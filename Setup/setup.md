Here is what you need to run the app on your local computer:

1. Download the n8n workflows from the `workflow` folder, then import them into your n8n instance and configure the credentials.  
   Each workflow includes an explanation of its purpose and how to use it.  
   You will need:
   - A Google Cloud Console app for the Gmail trigger.  
   - An AI API for all AI-related operations.  
   - A Supabase project (obtain your credentials to connect both n8n and the app).
   - RapidAPI API key for this profile scraper [RapidAPI Linkedin Scraper](https://rapidapi.com/rockapis-rockapis-default/api/linkedin-data-api)
  
   After setup, copy all production webhook URLs, as you will need to add them to the app.

2. Set up the Supabase table using the following schema: [SQL code](<sql schema.md>).  
   You can run this SQL directly in Supabase. If it doesn't work, ask the AI to generate a valid version from the same schema.

3. Set up the app by following this guide: [lovable_install.md](lovable_install.md).  
   Alternatively, you can clone the repository and set up a new app directly in your Lovable account.

4. Update the webhooks on the app’s settings page:  
   1. Log in to the app.  
   2. Navigate to the settings page.  
   3. Replace the webhook URLs as follows:  
      - `"chat_ai_webhook"`: This is the RAG agent webhook, used on the "chat" page.  
      - `"linkedin_scraper_webhook"`: This is the webhook for the LinkedIn profile scraper, used on the "Recherche" page.

5. Enjoy!
