// Filename: views/project/list
define([
	  'jquery',
	  'underscore',
	  'backbone',
	  'text!/templates/404.html'
	],
	function($, _, Backbone, baseTemplate) {
    var currentLength = 5;
		var PageNotFoundView = Backbone.View.extend({
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
	      
	      $.fn.shake = function(intShakes, intDistance, intDuration) {
			    this.each(function() {
		        for (var x=1; x<=intShakes; x++) {
				      $(this).animate({'left':'-='+intDistance+'px'}, (((intDuration/intShakes)/4)))
								     .animate({'left':'+='+intDistance*2+'px'}, ((intDuration/intShakes)/2))
								     .animate({'left':'-='+intDistance+'px'}, (((intDuration/intShakes)/4)));
						  }
				  });
				  return this;
				};
	      
	      var display404Page = function () {
					window.document.title = meta.blogTitle;
	      	baseElement.html(compiledTemplate);
					baseElement.fadeIn(100);
					$('#notFoundMessage').shake(3,10,100);
	      }
	      
	      if($.trim(baseElement.html())!='')
		      baseElement.fadeOut(100,display404Page); 
	      else
	      	display404Page();	      
	    }
	  });
	  // Our module now returns our view
	  return PageNotFoundView;
	}
);