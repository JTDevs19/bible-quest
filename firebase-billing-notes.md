# Firebase Billing & Scaling Notes for Bible Quest

This document summarizes our discussion about how Firebase's Blaze (pay-as-you-go) plan, server instances, and free tiers work for the Bible Quest app.

### Why was the Blaze (Pay-as-you-go) Plan Necessary?

- **External API Calls**: The app was upgraded to the Blaze plan to enable the **AI Verse Helper** features. For a Firebase function to make network requests to external services (like Google's AI), the Blaze plan is required.
- **Generous Free Tier**: "Pay-as-you-go" does not mean you will have a large bill. The Blaze plan includes a substantial **free monthly allowance** for all its services. You only pay for usage that exceeds these high limits. For a personal project, a $0 bill is the most likely outcome.

### Understanding Server Instances & Scaling

- **Configuration vs. Reality**: Your app is configured with `Min / Max Instances: 0 / 20`. This setting doesn't change. It's a rulebook that Firebase follows.
- **How it Works**:
    - **Min Instances (0)**: When your app has no traffic, Firebase scales down to 0 running servers to save costs. The first visitor will trigger a "cold start," which is a one-time, slightly slower load as a new server starts.
    - **Max Instances (20)**: If your app receives a sudden surge of simultaneous users, Firebase will automatically spin up more server instances (up to a maximum of 20) to handle the load and keep the app fast.
    - **Scaling Down**: Once traffic subsides, Firebase automatically shuts down the extra instances to remain efficient.

### One Instance Serves Many Users

- An instance is **not** assigned on a "one-per-user" basis.
- Think of a server instance like a city bus: it can carry many passengers (users) at once.
- **A single instance can efficiently handle requests from many simultaneous users.** A second instance is only created during a "rush hour" of concurrent requests, which is rare for smaller apps.

### When Would You Actually Get Billed?

You will only be billed for usage that **exceeds the monthly free tier**.

**1. App Hosting & Clicks (Cloud Functions)**
- **Free Allowance**: **2,000,000 (two million)** requests per month.
- **Example**: With 100 users, each clicking 50 times a day, you would use about 150,000 requests per month. This is less than 10% of the free allowance.
- **Conclusion**: You would need thousands of active daily users to approach the billing threshold for hosting.

**2. AI Helper (Gemini API Calls)**
- **Free Allowance**: The Gemini API has its own free tier, typically allowing for thousands of calls per month.
- **Cost-Effective**: The AI model we use (`gemini-2.0-flash`) is very efficient. The 10 free charges per user (plus any they acquire from the Forge) are designed to keep usage well within the free limits.
- **Conclusion**: You would need a very large number of users heavily using the AI features every day to see costs here.

### Summary for Your App

With your plan for daily limits and an initial community of under 100 people, you can confidently run the Bible Quest app on the Blaze plan with the expectation of a **$0.00 monthly bill**. You have built a scalable, efficient app that is ready for your community.