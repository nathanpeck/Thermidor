// Filename: views/project/list
define([
	  'jquery',
	  'underscore',
	  'backbone',
	  'text!/templates/post.html'
	],
	function($, _, Backbone, postTemplate) {
		var BaseView = Backbone.View.extend({
	    render: function() {
	    	var post = this.options.post;
	    	var meta = this.options.meta;
	      var compiledTemplate = _.template(
	      	postTemplate,
	      	{
		      	'post': post,
		      	'meta': meta
	      	}
	      );
	      
	      var baseElement = $('#base');
	      var displayPostPage = function () {
	      	window.document.title = post.title;
	      	baseElement.html(compiledTemplate);	
					require([
					  	'jquery',
					  	'markdown',
				    	'text!/blog/'+post.markdown
				    ],
				    function ($,Markdown,blogPost) {
				    	Converter = new Markdown.Converter();
				    	$('#postBody').html(Converter.makeHtml(blogPost));
				    	$('#postBody img').hide();
				      $('#postBody img').on('load',function () {
					      $(this).fadeIn(200);
				      });
							baseElement.fadeIn(100);
				    }
			    );
	      };
	      	      
	      if($.trim(baseElement.html())!='')
		      baseElement.fadeOut(100,displayPostPage); 
	      else
	      	displayPostPage();	
	    }
	  });
	  // Our module now returns our view
	  return BaseView;
	}
);