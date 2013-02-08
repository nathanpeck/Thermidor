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
function lookForPosts(scanPath,depth) {
	var allPosts = new Array();
	console.log(indentation(depth)+'Searching '+scanPath);
	var files = fs.readdirSync(scanPath);
	for(file in files)
	{
		thisFile = scanPath+files[file]
		stats = fs.lstatSync(thisFile);

    // Is it a directory?
    if(stats.isDirectory()) {
      fs.mkdirSync(thisFile.replace("../blog/","../published/"),0777);
      allPosts = allPosts.concat(lookForPosts(thisFile+'/',depth+2));
    }
    else {
    	if(getExtension(thisFile)=='md')
		  {
		  	console.log(indentation(depth+2)+'Found: '+thisFile);
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
		  	meta.markdown = thisFile.replace("../blog/","../published/");
		  	
		  	fs.writeFileSync(thisFile.replace("../blog/","../published/"),body);
		  	
		  	allPosts.push({
			  	'meta': meta,
			  	'body': body
		  	})
		  }
		  else
		  {
		  	fs.writeFileSync(thisFile.replace("../blog/","../published/"),fs.readFileSync(thisFile));
		  }
    }
	}
	return allPosts;
}

//Take a list of posts in a directory as returned by lookForPosts() and write out the posts.json index.
function indexPosts()
{
	var exec = require('child_process').exec,child;
	child = exec('rm -rf ../published/*',function(err,out) { 
		var allPosts = lookForPosts('../blog/',0);
		allPosts = allPosts.reverse();
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
		
		fs.writeFileSync('../published/posts.json',JSON.stringify(postIndex,null,2));	  
	});
}

var execution = false;
process.argv.forEach(function (val, index, array) {
	if(val=='index')
	{
		indexPosts();
		execution = true;
	}
});

if(execution==false)
{
	console.log("");
	console.log("Thermidor options:");
	console.log("");
	console.log("    index - Recursively reads the /blog folder and builds the posts.json index from it.");
	console.log("");
}








