Thermidor
=========

Thermidor is a very simple blog system (still a work in progress) which uses Require.js and Underscore to load posts in Markdown format and display them dynamically. It is designed to be capable of being served as static content, for easy hosting on S3 or another CDN. Because there is no backend code involved there is no bottleneck to take down the blog if it gets hit by thousands of visitors, and it can also be potentially much cheaper to run since there is no need to pay for a server, only the very cheap S3 costs of delivering the static content.

Technologies
------------

- [Backbone](https://github.com/documentcloud/backbone) - Used to intercept requests and load new pages dynamically without doing a hard refresh of the entire document.
- [Require.js](https://github.com/jrburke/requirejs) - Used to load libraries and files in an managable and efficient manner.
- [Underscore](https://github.com/documentcloud/underscore) - Used to render Markdown posts into HTML.
- [CDNJS](http://cdnjs.com/) - All external libraries are loaded from CDNJS, the fastest CDN on the web, with SPDY support for browsers that can make use of it.

Future Improvements
-------------------

- Pagination for the post list on the main page (In progress Feb 7, 2012)
- Automated deploy script to compress and combine the JavaScript files (using the Require.js deploy scripts) for improved page load time, as well as general GZIP compression of all files and posts so they can be deployed to S3, which does not have built in compression. Ideally this will also include a simple script to automate the deploy to S3, so that all that will be needed will be adding your AWS credentials to a configuration file.
