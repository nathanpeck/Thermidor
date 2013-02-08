Thermidor
=========

Thermidor is a very simple blog system (still a work in progress) designed to be capable of being served as 100% static content, for easy hosting on a CDN like Amazon S3. Because there is no backend code involved there is no bottleneck to take down the blog if it gets hit by thousands of visitors. When hosted on a CDN like S3 it can also be potentially much cheaper than other blogging solutions for low traffic blogs since there is no need to pay for a server with extra capacity, and you are only charged for bandwidth and requests that are actually made.

Technologies
------------

- [Backbone](https://github.com/documentcloud/backbone) - Used to intercept page requests and load new pages dynamically without doing a hard refresh of the entire document.
- [Require.js](https://github.com/jrburke/requirejs) - Used to load libraries and files in a managable and efficient manner.
- [Underscore](https://github.com/documentcloud/underscore) - Used to render Markdown posts into HTML.
- [CDNJS](http://cdnjs.com/) - All external libraries are loaded from CDNJS, the fastest CDN on the web, with SPDY support for browsers that can make use of it.
- [node.js](http://nodejs.org/) - For the backend script which is used to automate things like indexing the Markdown posts, generating sitemap, and deploying to S3.

Future Improvements
-------------------

- Proper documentation.
- Installation script to install all the require node.js modules, and download the Java compilers used by the deployment script.
- Automated deploy script to compress and combine the JavaScript files (using the Require.js deploy scripts) for improved page load time, as well as general GZIP compression of all files and posts so they can be deployed to S3, which does not have built in compression. Ideally this will also include a simple script to automate the deploy to S3, so that all that will be needed will be adding your AWS credentials to a configuration file. (In progress February 8th, 2013)
