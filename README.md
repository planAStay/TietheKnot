# Bitpan Demo

To run the Bitpan demo, first install the npm dependencies:

```bash
npm install
```

Next, create a `.env.local` file in the root directory and add the required environment variables:

```bash
# Testing password for password-protected access
TESTING_PASSWORD=your-password-here
```

Then, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Password Protection

The website is password-protected to allow team testing before going live:

- **Public Access**: Only `/get-started` page is publicly accessible
- **Protected Routes**: All other routes require a password
- **Password Storage**: Password is stored in `TESTING_PASSWORD` environment variable
- **Authentication**: Uses HTTP-only secure cookies for authentication
- **Cookie Duration**: Authentication persists for 30 days

To access protected routes, navigate to any protected URL and enter the password when prompted. The password is set via the `TESTING_PASSWORD` environment variable.

### Production Deployment

Set the `TESTING_PASSWORD` environment variable in your deployment platform (e.g., Vercel):
1. Go to your project settings
2. Navigate to Environment Variables
3. Add `TESTING_PASSWORD` with your chosen password
4. Redeploy the application
