

 Free Trial Modal with Email Notification                                      
                                                                                
  What This Does                                                                
                                                                                
  When someone clicks "Start Free Trial" on the Level 01 (The Roundtable) card,
  a modal appears collecting their information. Upon submission, instant email
  notifications are sent to both john@sharecompany.ai and jason@galavanteer.com
  with the details, and a confirmation email is sent to the user. The user sees
  a confirmation message that setup takes 24-48 hours.

  User-Facing Flow

  1. User clicks "Start Free Trial" on the Roundtable tier card
  2. A clean modal opens with a form: Name, Email, Title/Role, Company Website
  (optional), Privacy Policy checkbox
  3. User submits the form
  4. Modal shows a success message: "You're in! Check your email for
  confirmation. We'll have your Roundtable ready within 24-48 hours."
  5. User receives a confirmation email with next steps
  6. Both john@sharecompany.ai and jason@galavanteer.com receive an email with
  the submission details

  Technical Plan

  1. Create a new component: src/components/FreeTrialModal.tsx
  - Dialog modal using existing Radix UI dialog components
  - Form with fields: Full Name (required), Email (required), Title/Role
  (required), Company Website (optional), Privacy Policy checkbox (required)
  - Privacy Policy checkbox text: "I agree to the /privacy"
  - Client-side validation using zod (required fields, valid email, valid URL
  format if provided)
  - On submit, calls the new backend function
  - Shows success state with "Check your email" message after submission
  - Track analytics event on modal open and successful submission

  2. Create a new backend function:
  supabase/functions/notify-free-trial/index.ts
  - Receives the form data via POST
  - Rate limiting: Max 3 submissions per IP address per hour (return 429 if
  exceeded)
  - Duplicate check: Query leads table for existing email with trial signup in
  last 30 days
    - If found: Return error "You've already signed up. Check your email or
  contact jason@galavanteer.com"
    - If not found: Proceed with signup
  - Saves the trial signup to the leads table with all form data, metadata: {
  type: 'free_trial', source: referrer, timestamp: ISO string }, and IP address
  - Sends three emails via Resend (using existing RESEND_API_KEY secret):
    a. Admin notification to john@sharecompany.ai
    b. Admin notification to jason@galavanteer.com
    c. User confirmation to submitted email
  - Returns success/error response

  3. Update supabase/config.toml
  - Add the new function with verify_jwt = false

  4. Update src/components/sections/TiersSection.tsx
  - Import the FreeTrialModal component
  - Add state for modal open/close
  - Change the "Start Free Trial" button from a Calendly link to opening the
  modal
  - Other tier buttons ("Book Call") remain unchanged as Calendly links

  5. Database considerations
  - No new table needed - trial signups stored in existing leads table
  - Ensure leads table has columns: name, email, title, company_website,
  metadata (jsonb), ip_address, created_at
  - Add index on email and created_at for duplicate check performance

  Email Templates

  Admin Notification Email (to john@sharecompany.ai and jason@galavanteer.com)

  Subject: New Free Trial Signup - [Name] from [Company]

  Body:
  New Roundtable Free Trial Signup

  Name: [Full Name]
  Email: [Email]
  Title/Role: [Title/Role]
  Company Website: [Company Website or "Not provided"]

  Signed up: [Timestamp in PT timezone]
  Source: [Referrer URL or "Direct"]

  ---
  Next Steps:
  Set up their Roundtable instance within 24-48 hours.

  View in database: [Link to Supabase leads table filtered by this email]

  User Confirmation Email (to submitted email)

  Subject: Welcome to The Roundtable - Your Trial Starts Soon

  From: Jason Baron, Galavanteer jason@galavanteer.com

  Reply-To: jason@galavanteer.com

  Body:
  Hi [First Name],

  You're in! Your 10-day free trial of The Roundtable is confirmed.

  What happens next:
  • We'll set up your personal Roundtable within 24-48 hours
  • You'll receive another email with your login credentials and getting started
   guide
  • Your trial includes full access to 60+ expert personas

  What you can do while you wait:
  • Think about the first big decision you want to examine
  • Review the Four Levels to understand what's possible:
  https://galavanteer.com/one-pager
  • Questions? Just reply to this email

  We're excited to have you at the table.

  Jason Baron
  Founder, Galavanteer

  ---
  P.S. Didn't sign up for this? Reply and let us know.

  Implementation Notes

  - Use plain text email format (no HTML) for better deliverability
  - Include unsubscribe footer if required by email service
  - Log all email sends to monitor delivery
  - If Resend API call fails, still save to database but log error for manual
  follow-up

