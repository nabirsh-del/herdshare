# HerdShare

Direct supply platform connecting independent U.S. ranchers to campus houses and institutions. Eliminating unnecessary middlemen to deliver clean American protein and support rural America.

## Mission

"American food should come from American hands, not corporate spreadsheets." This is bigger than beef—it's about who controls our food supply. HerdShare connects independent U.S. ranchers directly to buyers, cutting out intermediaries and building a transparent, sustainable food system.

## Features

- **Direct Connections**: Ranchers connect directly with fraternity houses, campus organizations, and institutional buyers
- - **Transparent Pricing**: Simple $10/lb flat rate with no hidden fees
  - - **Quality Assurance**: All beef meets USDA standards with full traceability
    - - **Real-Time Orders**: Phase 1 order intake with Stripe payment processing
      - - **Order Tracking**: Real-time spreadsheet view of all orders for ranchers
        - - **Educational Resources**: Comprehensive cookbook and whole-beef buying guides
          -
          - ## Tech Stack
          -
          - - **Frontend**: HTML5, CSS3, JavaScript (vanilla)
            - - **Hosting**: Cloudflare Pages
              - - **Infrastructure**: Cloudflare Workers (serverless functions)
                - - **Payments**: Stripe API
                  - - **Order Tracking**: Google Sheets API
                    - - **Domain**: herdsharecompany.com (Cloudflare DNS)
                      - - **Repository**: nabirsh-del/herdshare
                        -
                        - ## Project Structure
                        -
                        - ```
                          herdshare/
                          ├── public/
                          │   ├── index.html              # HOME page
                          │   ├── for-houses.html         # For campus houses & organizations
                          │   ├── for-ranchers.html       # For rancher partners
                          │   ├── pricing.html            # Pricing & product info
                          │   ├── about.html              # About & manifesto
                          │   ├── order.html              # Order form & checkout
                          │   ├── contact.html            # Contact form
                          │   ├── css/
                          │   │   └── style.css           # Complete responsive styling
                          │   └── js/
                          │       └── forms.js            # Form handling & validation
                          ├── wrangler.toml               # Cloudflare configuration
                          └── README.md                   # This file
                          ```

                          ## Getting Started

                          ### Prerequisites

                          - Node.js (for local development)
                          - - GitHub account (repo access)
                            - - Stripe account (for payment processing)
                              - - Google account (for Sheets integration)
                                -
                                - ### Development Setup
                                -
                                - 1. **Clone the repository**:
                                  2.    ```bash
                                           git clone https://github.com/nabirsh-del/herdshare.git
                                           cd herdshare
                                           ```

                                    2. **Install dependencies**:
                                    3.    ```bash
                                             npm install
                                             ```

                                      3. **Create .env file** (local development only):
                                     ```bash
                                        touch .env
                                        ```

                                     4. **Add environment variables** (see Environment Variables section below):
                                        ```
                                        STRIPE_PUBLIC_KEY=pk_test_xxxxx
                                        STRIPE_SECRET_KEY=sk_test_xxxxx
                                        GOOGLE_SHEETS_ID=your_sheet_id
                                        WEBHOOK_SECRET=whsec_xxxxx
                                        ```

                                     5. **Run locally**:
                                        ```bash
                                        npm run dev
                                        ```

                                     6. **Deploy to Cloudflare Pages**:
                                        ```bash
                                        wrangler pages deploy public/
                                        ```

                                     ## Environment Variables

                                     ### Local Development (.env file)

                                     Create a `.env` file in the root directory (NEVER commit to GitHub):

                                     ```
                                     # Stripe - Get from https://dashboard.stripe.com/apikeys
                                  STRIPE_PUBLIC_KEY=pk_test_xxxxx          # Public key for frontend
                                  STRIPE_SECRET_KEY=sk_test_xxxxx          # Secret key (backend only)

                                  # Google Sheets
                                  GOOGLE_SHEETS_ID=1UQCCwG-fXZKQW-...      # Spreadsheet ID from URL
                                  GOOGLE_API_KEY=AIzaSyDxxxxx              # API key for Sheets access

                                  # Stripe Webhooks
                                  WEBHOOK_SECRET=whsec_xxxxx               # Webhook signing secret
                                  ```

                                  ### Cloudflare Pages Environment Variables

                                  Set encrypted environment variables in Cloudflare Dashboard:

                                  1. Go to **Cloudflare Dashboard** → **Pages** → **herdshare** → **Settings** → **Environment variables**
                                  2. Add each variable and mark sensitive ones as "Encrypted":
                                     - `STRIPE_SECRET_KEY` (encrypted)
                                     - `WEBHOOK_SECRET` (encrypted)
                                     - `GOOGLE_SHEETS_ID` (standard)
                                     - `GOOGLE_API_KEY` (encrypted)

                                  ### Important: .env in .gitignore

                                  The `.env` file is already in `.gitignore` and should NEVER be committed. This protects your API keys from exposure.

                                  ## API Integration

                                  ### Stripe Integration

                                  The order form (`public/order.html`) integrates with Stripe for payment processing:

                                  - **Publishable Key**: Used in frontend to generate checkout sessions
                                  - **Secret Key**: Used securely in Cloudflare Workers (never exposed to browser)
                                  - **Webhook Endpoint**: Receives payment confirmation events

                                  ### Google Sheets Integration

                                  Orders are automatically written to a Google Sheet for real-time tracking:

                                  - **Sheet ID**: `1UQCCwG-fXZKQW-Hnw-tWtDAWialIiM-uc_OipaAa45k`
                                  - **Columns**: Order ID, Stripe Payment ID, Timestamp, Buyer Info, Order Details, Status
                                  - **Access**: Ranchers view read-only shared link to track orders

                                  ## Deployment

                                  ### Automatic Deployment

                                  Cloudflare Pages automatically deploys whenever you push to the main branch:

                                  1. Commit your changes locally
                                  2. Push to GitHub: `git push origin main`
                                  3. Cloudflare Pages automatically detects changes and redeploys
                                  4. Site updates at: https://herdsharecompany.com

                                  ### Manual Deployment (if needed)

                                  ```bash
                                  # Ensure you're in the project root
                                  wrangler pages deploy public/
                                  ```

                                  ## Site Pages & Functionality

                                  ### Home (index.html)
                                  - Hero section with manifesto messaging
                                  - - How It Works (3-step process)
                                    - - Who We Serve (campus, institutions, ranchers)
                                      - - Impact section highlighting community support
                                        - - Lead capture form
                                          - - Trust & Standards section
                                            -
                                            - ### For Houses (for-houses.html)
                                            - - Bulk ordering benefits for Greek life & organizations
                                              - - Freezer/storage guidance
                                                - - Cost savings calculations
                                                  - - FAQ section
                                                    -
                                                    - ### For Ranchers (for-ranchers.html)
                                                    - - Partnership value proposition
                                                      - - Revenue opportunity highlights
                                                        - - Rancher form for partnership inquiry
                                                          - - Testimonials section
                                                            -
                                                            - ### Pricing (pricing.html)
                                                            - - Clear pricing model ($10/lb)
                                                              - - Package options (Whole, Half, Quarter cow)
                                                                - - What's included breakdown
                                                                  - - Direct links to order page
                                                                    -
                                                                    - ### Order (order.html)
                                                                    - - Product selection (Whole/Half/Quarter)
                                                                      - - Buyer information form
                                                                        - - Delivery preferences
                                                                          - - Cut preferences/special instructions
                                                                            - - Stripe payment button
                                                                              - - Order confirmation after payment
                                                                                -
                                                                                - ### About (about.html)
                                                                                - - Full manifesto statement
                                                                                  - - Why HerdShare exists
                                                                                    - - Core values and beliefs
                                                                                      - - Team section (placeholder for photos)
                                                                                        -
                                                                                        - ### Contact (contact.html)
                                                                                        - - Contact form
                                                                                          - - Contact information display
                                                                                            - - Email routing
                                                                                              -
                                                                                              - ## Form Fields & Validation
                                                                                              -
                                                                                              - ### Order Form (order.html)
                                                                                              -
                                                                                              - **Buyer Information**:
                                                                                              - - Name (required)
                                                                                                - - Organization/House Name (required)
                                                                                                  - - Email (required, valid email format)
                                                                                                    - - Phone (required, US format)
                                                                                                      -
                                                                                                      - **Delivery Details**:
                                                                                                      - - Delivery Address (required)
                                                                                                        - - Delivery Window (required - date/time)
                                                                                                          - - Product Type (required - Whole/Half/Quarter)
                                                                                                            -
                                                                                                            - **Preferences**:
                                                                                                            - - Cut Preferences (optional text)
                                                                                                              - - Special Instructions (optional text)
                                                                                                                -
                                                                                                                - ### Lead Forms
                                                                                                                -
                                                                                                                - **Home Page Lead Form**:
                                                                                                                - - Name, Email, Organization
                                                                                                                  -
                                                                                                                  - **Rancher Partnership Form**:
                                                                                                                  - - Ranch Name, Location, Herd Size, Breeds, Contact Info
                                                                                                                    -
                                                                                                                    - ## Styling & Design
                                                                                                                    -
                                                                                                                    - The site uses a clean, premium design system:
                                                                                                                    -
                                                                                                                    - **Colors**:
                                                                                                                    - - Primary: Deep Forest Green (#2d5016)
                                                                                                                      - - Background: Off-white (#f8f6f1)
                                                                                                                        - - Text: Charcoal (#2c2c2c)
                                                                                                                          - - Accents: Natural wood tones
                                                                                                                            -
                                                                                                                            - **Typography**:
                                                                                                                            - - Headers: System fonts (San Francisco, Segoe UI, Arial)
                                                                                                                              - - Body: Georgia serif for warmth
                                                                                                                                -
                                                                                                                                - **Responsive Design**:
                                                                                                                                - - Mobile-first approach
                                                                                                                                  - - Breakpoints at 768px, 1024px, 1440px
                                                                                                                                    - - Touch-friendly form inputs and buttons
                                                                                                                                      -
                                                                                                                                      - ## Security
                                                                                                                                      -
                                                                                                                                      - ### API Key Protection
                                                                                                                                      -
                                                                                                                                      - - **Never commit .env files** to GitHub
                                                                                                                                        - - Stripe Secret Key only used in Cloudflare Workers
                                                                                                                                          - - Public Key safe to include in frontend code
                                                                                                                                            - - All sensitive data stored as encrypted Cloudflare environment variables
                                                                                                                                              -
                                                                                                                                              - ### Webhook Security
                                                                                                                                              -
                                                                                                                                              - - Stripe webhook signatures validated before processing
                                                                                                                                                - - Webhook endpoint implements HMAC-SHA256 verification
                                                                                                                                                  - - Invalid requests rejected before writing to Sheets
                                                                                                                                                    -
                                                                                                                                                    - ### HTTPS & SSL
                                                                                                                                                    -
                                                                                                                                                    - - Automatic SSL through Cloudflare
                                                                                                                                                      - - HTTPS enforced on all pages
                                                                                                                                                        - - Automatic redirect from http:// to https://
                                                                                                                                                          -
                                                                                                                                                          - ## Contributing
                                                                                                                                                          -
                                                                                                                                                          - This is a private repository. For access, contact the development team.
                                                                                                                                                          -
                                                                                                                                                          - ### Development Workflow
                                                                                                                                                          -
                                                                                                                                                          - 1. Create a feature branch: `git checkout -b feature/my-feature`
                                                                                                                                                            2. 2. Make your changes
                                                                                                                                                               3. 3. Commit with descriptive messages: `git commit -m "Add feature description"`
                                                                                                                                                                  4. 4. Push to GitHub: `git push origin feature/my-feature`
                                                                                                                                                                     5. 5. Create a pull request for review
                                                                                                                                                                        6.
                                                                                                                                                                        7. ## Phase 2 (Upcoming)
                                                                                                                                                                        8.
                                                                                                                                                                        9. The following features are planned for Phase 2:
                                                                                                                                                                        10.
                                                                                                                                                                        11. - Stripe webhook integration for payment confirmation
                                                                                                                                                                            - - Google Sheets API integration for order tracking
                                                                                                                                                                              - - Email notifications for order confirmation
                                                                                                                                                                                - - Advanced anti-spam validation
                                                                                                                                                                                  - - Rancher dashboard for order management
                                                                                                                                                                                    - - Inventory tracking system
                                                                                                                                                                                      -
                                                                                                                                                                                      - ## Support & Questions
                                                                                                                                                                                      -
                                                                                                                                                                                      - For questions or issues:
                                                                                                                                                                                      - - Create an Issue on GitHub
                                                                                                                                                                                        - - Contact the development team directly
                                                                                                                                                                                          - - Check existing Issues for solutions
                                                                                                                                                                                            -
                                                                                                                                                                                            - ## License
                                                                                                                                                                                            -
                                                                                                                                                                                            - Private - HerdShare Proprietary Code
                                                                                                                                                                                            -
                                                                                                                                                                                            - ## Changelog
                                                                                                                                                                                            -
                                                                                                                                                                                            - **v1.0.0 (Jan 2026)**
                                                                                                                                                                                            - - Initial site launch
                                                                                                                                                                                              - - 8 marketing pages
                                                                                                                                                                                                - - Lead capture forms
                                                                                                                                                                                                  - - Stripe integration framework
                                                                                                                                                                                                    - - Cloudflare Pages deployment
                                                                                                                                                                                                      - - Google Sheets order tracking setup# herdshare
HerdShare - Direct supply platform connecting independent U.S. ranchers to campus houses and institutions. Built on Cloudflare Pages with Stripe integration.
