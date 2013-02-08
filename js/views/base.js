// Filename: views/project/list
define([
	  'jquery',
	  'underscore',
	  'backbone',
	  'text!/templates/base.html'
	],
	function($, _, Backbone, baseTemplate) {
    var currentLength = 5;
		var BaseView = Backbone.View.extend({
	    render: function() {	      	      
	      //Look through the post index and select only the proper pages, not the redirects
	    	var postIndex = this.options.posts;
	    	var meta = this.options.meta;
	      var filteredPosts = new Array();
	      _.each(postIndex, function (post, permalink) {
		      if(post.markdown!=undefined)
		      {
		      	post.permalink = permalink;
			      filteredPosts.push(post);
		      }
	      });
	      
	      var compiledTemplate = _.template(baseTemplate, {
		      'posts': filteredPosts.slice(0,currentLength),
		      'meta': meta
	      });
	      
	      var baseElement = $('#base');
	      
	      var displayHomePage = function () {
					window.document.title = meta.blogTitle;
	      	baseElement.html(compiledTemplate);
					baseElement.fadeIn(100);		      
	      }
	      
	      if($.trim(baseElement.html())!='')
		      baseElement.fadeOut(100,displayHomePage); 
	      else
	      	displayHomePage();	      	      
	      
	      $('#base').on('click', '#olderPosts', function (e) {
	      	currentLength+=5;
		      var compiledTemplate = _.template(baseTemplate, {
			      'posts': filteredPosts.slice(0,currentLength),
			      'meta': meta
		      });
		      $('#base').html(compiledTemplate);
		      e.preventDefault();
	      });
	    }
	  });
	  // Our module now returns our view
	  return BaseView;
	}
);