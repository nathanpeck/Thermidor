Thermidor
=========

Thermidor is a very simple blog system (still a work in progress) which uses Require.js and Underscore to load posts in Markdown format and display them dynamically. It is designed to be entirely static server, for easy hosting on S3 or another CDN. Because there is no backend code involved there is no bottleneck to take down the blog if it gets hit by thousands of visitors. Instead the CDN will just serve the static files. Backbone is also used to allow new posts and pages to be loaded without a hard page refresh, but while retaining page history.

Technologies
------------

- [Backbone](https://github.com/documentcloud/backbone) - Used to intercept requests and load new pages dynamically without doing a hard refresh of the entire document.
- [Require.js](https://github.com/jrburke/requirejs) - Used to load libraries and files in an managable and efficient manner.
- [Underscore](https://github.com/documentcloud/underscore) - Used to render Markdown posts into HTML.
- [CDNJS](http://cdnjs.com/) - All external libraries are loaded from CDNJS, the fastest CDN on the web, with SPDY support for browsers that can make use of it.

Future Improvements
-------------------

- Pagination for the post list on the main page (In progress Feb 7, 2012)
- Automated deploy scripts to compress and combine the JavaScript files for improved page load time, as well as compress posts and deploy them to S3 automatically.
