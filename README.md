# odhranroche.com

Source for [odhranroche.com](https://odhranroche.com), the personal portfolio site of Odhrán Roche: technical writing, learning and development, and web projects.

It is a plain static site. There is no build step, framework, PHP, Node or Python. What is in `public_html/` is exactly what gets served.

![Screenshot of the odhranroche.com homepage](homepage_screenshot.png)


## Structure

```
public_html/
├── index.html            Home
├── skills.html           Skills and work samples
├── projects.html         Projects
├── cv.html               CV
├── qualifications.html   Qualifications
├── references.html       References
├── contact.html          Contact
├── 404.html              Error page
├── page-template.html    Starting point for new pages
├── styleguide.html       Style guide for the site's components
├── robots.txt
├── sitemap.xml
├── .htaccess             Redirects, clean URLs, caching, security headers
└── assets/
    ├── css/site.css      All styles
    ├── js/site.js        All scripts
    ├── fonts/            Self-hosted WOFF2 fonts (Atkinson Hyperlegible, Lexend, Kalam)
    ├── img/              Photo, project and skills images (WebP)
    ├── docs/             Downloadable CV (PDF) and text profile
    ├── icons/
    ├── logos/
    ├── favicon.svg
    └── og-image.png      Social sharing image
```

## Working on the site

Open `public_html/index.html` in a browser to preview. Note that the clean URLs (`/cv` instead of `/cv.html`) and redirects only work on the server, because they depend on `.htaccess`. Locally, links to `.html` files work as normal.

To add a page:

1. Copy `public_html/page-template.html` to a new file.
2. Add the page to `sitemap.xml`.
3. Link to it from the site navigation.

Component styles are documented in `styleguide.html`.

## Hosting and deployment

The site is hosted on Hostinger shared hosting (Apache/LiteSpeed). To deploy, upload the contents of `public_html/` to the site's `public_html` folder, using hPanel's File Manager or SFTP.

`.htaccess` handles:

- Forcing HTTPS
- Clean URLs (`/cv` serves `cv.html`) and trailing-slash removal
- 301 redirects from the old Hostinger Website Builder addresses
- Compression, caching and security headers

## Repository notes

- The repo root is the folder that contains `public_html/`, so the layout matches the server.
- `.gitignore` excludes OS and editor files, `.env` files, logs, backups and archives.
- `assets/docs/` contains personal contact details that are also published on the live site.
