// Filename: views/project/list
define([
	  'jquery',
	  'underscore',
	  'backbone',
	  'text!/templates/post.html'
	],
	function($, _, Backbone, postTemplate) {
		var BaseView = Backbone.View.extend({
	    el: $('#base'),
	    render: function() {
	    	var post = this.options.post;
	      var compiledTemplate = _.template(postTemplate, post);
	      	      
	      // Append our compiled template to this Views "el"
	      this.$el.fadeOut(100,function () {
	      	$(this).html(compiledTemplate);	
					require([
					  	'jquery',
					  	'markdown',
				    	'text!/blog/'+post.markdown
				    ],
				    function ($,Markdown,blogPost) {
				    	Converter = new Markdown.Converter();
				    	$('#postBody').html(Converter.makeHtml(blogPost));
				    	$('#postBody img').hide(); //Hide images initially and then show them when they load.
				      $('#postBody img').on('load',function () {
					      $(this).fadeIn(200);
				      });
							$('#base').fadeIn(100);
				    }
			    );
	      });
	    }
	  });
	  // Our module now returns our view
	  return BaseView;
	}
);