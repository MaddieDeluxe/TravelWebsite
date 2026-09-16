# Travel Notes

Write posts as plain text. Each published post becomes a complete page with its own clean URL, readable without JavaScript, with its own title and description for search and social previews.

## Add or edit a post

1. Copy `posts/template.txt` to a descriptive filename such as `posts/choosing-a-hotel.txt`. Keep all article text files in `notes/posts/`.
2. Fill in Title, Date (YYYY-MM-DD), Summary, Author, and your article below the `---` line. Remove `Status: draft` or change it to `Status: published` when ready. Status is optional and defaults to published.
3. Double-click `build.cmd` to generate the pages. It uses Python, which is installed on this computer. Read the result in the window; errors identify the file that needs fixing. Alternatively run `python notes/build.py` from the website folder.
4. Publish the updated website, including the generated HTML folders. Run the build again after every text edit, then publish.

`choosing-a-hotel.txt` becomes `https://yourluckyday.travel/notes/note/choosing-a-hotel/`.
The overview lives at `https://yourluckyday.travel/notes/`.
Previously shared `/notes/?post=choosing-a-hotel` links redirect to the new address.

The builder automatically finds every `.txt` article directly inside `notes/posts/`, skips `template.txt` and drafts, and lists published articles newest first by their Date field (filename breaks ties). No publishing list is needed. Filenames become lowercase URL names, with spaces and punctuation replaced by hyphens: `First Post.txt` becomes `/notes/note/first-post/`. Two published files cannot share the same URL name.

## Writing format

Separate paragraphs with a blank line. Use `## A heading` for section headings and `- Item` for bullets. Put a blank line before and after headings and lists. Other Markdown and HTML remain plain text.

## Drafts and removal

Keep `Status: draft` to hide a post, or move its source file out of `notes/posts/`. After changing publication status or removing an article source, rebuild and publish the resulting changes, including deleted generated HTML files. The builder removes only obsolete article pages bearing its own generated-file marker; it preserves your text files.

Draft .txt files deployed to a public site remain accessible directly. Keep private writing outside the deployed site.

## Files

- `posts/`: your article text files and blank `template.txt`.
- `build.cmd` / `build.py`: generate the website pages locally; no extra packages required.
- `page-template.html`: shared page structure, branding, and preview image.
- `notes.css`: styles for this section.
- `index.html`: the generated overview.
- `note/`: generated article folders, each containing its own `index.html`; edit the source text instead.

The builder retains your test post as written. Replace its placeholder title and body before sharing it as an actual article. Social previews use the shared SEO Card image with each article's own title and summary.

## Search and article metadata

Each build generates article structured data, visible breadcrumbs, author links for Madison, publication dates, unique titles and summaries, canonical URLs, and `notes/sitemap.xml`. The root `robots.txt` points crawlers to that sitemap. Only published posts appear in it.

For a substantial revision, optionally add `Updated: YYYY-MM-DD` to the article header. This date appears on the page, in article metadata, and in the sitemap. Keep Date as the original publication date. Don't change dates merely because you rebuild.

Write a specific Title that describes the question your article answers, and an accurate Summary rather than a string of keywords. Use descriptive `##` headings and give concrete advice from your own experience. Replace test and placeholder articles before publishing; mark them `Status: draft` to exclude them. The shared SEO Card remains the social preview image; it is not described as a photograph of the article subject in structured data.

Search engines decide whether and when to index pages. You can submit `https://yourluckyday.travel/notes/sitemap.xml` in Google Search Console after publishing.
