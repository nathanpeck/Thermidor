#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    execSync = require('exec-sync');

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
	var exec = require('child_process').exec;
	var child = exec('rm -rf publish/*',function(err,out) {
		//First publish all the static content and blog posts.
    fs.mkdirSync("publish/blog/",0777);
		var allPosts = lookForPosts('blog/',0,true);
		allPosts = allPosts.reverse();
		postIndex = createPostIndex(allPosts);
		fs.writeFileSync('publish/blog/posts.json',JSON.stringify(postIndex,null,2));
		
		htmlCompress = function(source,destination) {
			console.log('    Minifying...');		
			content = fs.readFileSync(source).toString();
			output = execSync('java -jar compilers/html/htmlcompressor-1.5.3.jar '+
														'--type html '+
														'--remove-surrounding-spaces all '+
														'-o '+destination+' '+
														source);
		}
		
		jsCompress = function(location,destination) {
			console.log('    Compiling and minifying...');
			output = execSync('java -jar compilers/closure/compiler.jar '+
														'--js '+location+' '+
														'--js_output_file '+destination);
		}
		
		cssCompress = function(source,destination) {
			content = fs.readFileSync(source).toString();
			fs.writeFileSync(destination,content);				
		}

		embedMetaData = function(source,destination) {
			content = fs.readFileSync(source).toString();
			fs.writeFileSync(destination,content);				
		}
		
		//Now copy the actual Thermidor frontend code to the publish directory, making modifications as necessary.
		var filesToPublish = [
			{
				'type': 'file',
				'location': 'index.html',
				'writer': htmlCompress
			},
			{
				'type': 'folder',
				'location': 'templates'
			},
			{
				'type': 'file',
				'location': 'templates/404.html',
				'writer': htmlCompress
			},
			{
				'type': 'file',
				'location': 'templates/base.html',
				'writer': htmlCompress
			},
			{
				'type': 'file',
				'location': 'templates/post.html',
				'writer': htmlCompress
			},
			{
				'type': 'folder',
				'location': 'js'
			},
			{
				'type': 'file',
				'location': 'js/main.js',
				'writer': embedMetaData
			},
			{
				'type': 'folder',
				'location': 'js/views'
			},
			{
				'type': 'file',
				'location': 'js/views/404.js',
				'writer': jsCompress
			},
			{
				'type': 'file',
				'location': 'js/views/base.js',
				'writer': jsCompress
			},
			{
				'type': 'file',
				'location': 'js/views/post.js',
				'writer': jsCompress
			},
			{
				'type': 'folder',
				'location': 'css'
			},
			{
				'type': 'file',
				'location': 'css/theme.css',
				'writer': cssCompress
			}
		];

		console.log('Publishing Thermidor Code:')		
		for(file in filesToPublish)
		{
			if(filesToPublish[file].type=='folder')
			{
				console.log('  - Folder: '+filesToPublish[file].location);
	      fs.mkdirSync('publish/'+filesToPublish[file].location,0777);
			}
			else
			{
				console.log('  - File: '+filesToPublish[file].location);
				filesToPublish[file].writer(filesToPublish[file].location,'publish/'+filesToPublish[file].location);
			}
		}
		
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





