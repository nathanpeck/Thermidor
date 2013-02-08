#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

function getExtension(filename) {
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
}

String.prototype.repeat = function(num) {
	return new Array(isNaN(num)? 1 : ++num).join(this);
}

function indentation(depth)
{
	return ' '.repeat(depth);
}

//Recursively scan a directory and return all the Markdown blog posts in the directory, pulling the
//meta data and the Markdown post bodies from them.
function lookForPosts(scanPath,depth,publish) {
	var allPosts = new Array();
	console.log(indentation(depth)+'Searching '+scanPath);
	var files = fs.readdirSync(scanPath);
	for(file in files)
	{
		thisFile = scanPath+files[file]
		stats = fs.lstatSync(thisFile);

    // Is it a directory?
    if(stats.isDirectory()) {
    	if(publish)
    	{
    		publishFolder = thisFile.replace("blog/","publish/blog/");
				console.log(indentation(depth+2)+'Publishing folder: '+publishFolder);
	      fs.mkdirSync(publishFolder,0777);
    	}
      allPosts = allPosts.concat(lookForPosts(thisFile+'/',depth+2,publish));
    }
    else {
    	if(getExtension(thisFile)=='md')
		  {
		  	console.log(indentation(depth+2)+'Found markdown: '+thisFile);
		  	var meta = "";
		  	var body = "";
		  	var readingMeta = true;
		  	fs.readFileSync(thisFile).toString().split('\n').forEach( function (line) {
			  	if(line == '' & readingMeta == true)
				  {
						meta = JSON.parse(meta);
						readingMeta = false
					}
					else if(readingMeta == true)
					{
						meta += line+"\n";
					}
					else
					{
						body += line+"\n";
					}
		  	});
		  	meta.markdown = thisFile.replace("blog/","");
		  	if(publish)
		  	{
		  		publishMarkdown = thisFile.replace("blog/","publish/blog/");
			  	console.log(indentation(depth+2)+'Publishing markdown: '+publishMarkdown);
			  	fs.writeFileSync(publishMarkdown,body);
		  	}
		  	
		  	allPosts.push({
			  	'meta': meta,
			  	'body': body
		  	})
		  }
		  else
		  {
		  	if(publish)
		  	{
		  		publishFile = thisFile.replace("blog/","publish/blog/");
		  		console.log(indentation(depth+2)+'Publishing file: '+publishFile);
			  	fs.writeFileSync(publishFile,fs.readFileSync(thisFile));			  	
		  	}
		  }
    }
	}
	return allPosts;
}

function createPostIndex(allPosts)
{
	var postIndex = new Object();
	
	allPosts.forEach(function (post) {
		postIndex[post.meta.url] = {
			markdown: post.meta.markdown,
			title: post.meta.title,
			date: post.meta.date
		};
		
		if(typeof post.meta.aliases == 'object' | typeof post.meta.aliases == 'array')
		{
			post.meta.aliases.forEach(function (alias) {
				postIndex[alias] = {
					redirect: post.meta.url
				};
			});
		}
	});
	
	return postIndex;
}

//Take a list of posts in a directory as returned by lookForPosts() and write out the posts.json index.
function indexThermidor()
{
	var allPosts = lookForPosts('blog/',0,false);
	allPosts = allPosts.reverse();
	postIndex = createPostIndex(allPosts);
	fs.writeFileSync('blog/posts.json',JSON.stringify(postIndex,null,2));	  
}

function publishThermidor()
{
	var exec = require('child_process').exec,child;
	child = exec('rm -rf publish/*',function(err,out) { 
    fs.mkdirSync("publish/blog/",0777);
		var allPosts = lookForPosts('blog/',0,true);
		allPosts = allPosts.reverse();
		postIndex = createPostIndex(allPosts);
		fs.writeFileSync('publish/blog/posts.json',JSON.stringify(postIndex,null,2));
	});
}

var execution = false;
process.argv.forEach(function (val, index, array) {
	if(val=='index')
	{
		indexThermidor();
		execution = true;
	}
	else if(val=='publish')
	{
		publishThermidor();
		execution = true;
	}
});

if(execution==false)
{
	console.log("");
	console.log("thermidor.js is a wrapper for automating certain tasks related to generating the static pages");
	console.log("and resources used by a Thermidor blog.")
	console.log("");
	console.log("Commands:");
	console.log("    index - Rebuilds the post index to reflect any new posts in /blog");
	console.log("    publish - Creates a publishable version of the blog in /publish");
	console.log("");
}





