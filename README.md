# Twitter Advanced Search

A mobile-first form for building Twitter search queries on devices where the advanced search UI is hard to use. The page collects search fields, assembles a query string, and opens Twitter search in a new tab.

## What It Does

- Builds Twitter search operators from semantic form fields.
- Supports keyword matching, account filters, language, date range, and engagement thresholds.
- Shows a live query preview at the top of the form.
- Opens the resulting search in a new tab with `target="_blank"`.

## Files

- `index.html`: page structure, metadata, and form markup.
- `css/style.css`: responsive styling with custom properties, nesting, and container queries.
- `js/app.js`: query builder and form behaviour.
- `assets/logo.jpg`: Open Graph and Twitter share image.
- `assets/logo.svg`: favicon.

## Local Use

This is a static site. Open `index.html` directly in a browser.

If you prefer serving it locally, use any static file server from the project root.

## Query Rules

The form converts fields into Twitter search operators:

- All words: plain terms separated by spaces.
- Exact phrase: wrapped in quotes.
- Any words: grouped with `OR`.
- None of these words: prefixed with `-`.
- Hashtags: prefixed with `#`.
- Accounts: space-separated handles are grouped with `OR` when more than one value is entered.
- Verified accounts: adds `filter:verified`.
- Hide replies: adds `-filter:replies`.
- Hide native retweets: adds `-filter:nativeretweets`.
- Language: adds `lang:xx`.
- Dates: adds `since:YYYY-MM-DD` and `until:YYYY-MM-DD`.
- Engagement: adds `min_replies`, `min_faves`, and `min_retweets`.
