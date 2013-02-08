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
	    el: $('#base'),
	    render: function() {	      	      
	      //Look through the post index and select only the proper pages, not the redirects
	    	var postIndex = this.options.postIndex;
	      var filteredPosts = new Array();
	      _.each(postIndex, function (post, permalink) {
		      if(post.markdown!=undefined)
		      {
		      	post.permalink = permalink;
			      filteredPosts.push(post);
		      }
	      });
	      
	      var compiledTemplate = _.template(baseTemplate, {
		      'posts': filteredPosts.slice(0,currentLength)
	      });
	      	      
	      // Append our compiled template to this Views "el"
	      this.$el.fadeOut(100,function () {
	      	$(this).html(compiledTemplate);
					$(this).fadeIn(100);
	      });
	      
	      $('#base').on('click', '#olderPosts', function () {
	      	currentLength+=5;
		      var compiledTemplate = _.template(baseTemplate, {
			      'posts': filteredPosts.slice(0,currentLength)
		      });
		      $('#base').html(compiledTemplate);
	      });
	    }
	  });
	  // Our module now returns our view
	  return BaseView;
	}
);