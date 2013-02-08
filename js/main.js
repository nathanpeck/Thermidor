var Blog = {};

require.config({
	baseUrl: '/js',
	shim: {
    'underscore': {
      exports: '_',
    },
    'bootstrap': {
    	deps: ['jquery'],
    },
    'backbone': {
      deps: ["underscore", "jquery"],
      exports: "Backbone",
    },
    'markdown': {
    	exports: 'Markdown'
    }
  },
  paths: {
    'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min',
    'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore-min',
    'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.9-amdjs/backbone-min',
    'bootstrap': '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.2.2/bootstrap.min',
    'text': '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text',
    'markdown': '//cdnjs.cloudflare.com/ajax/libs/pagedown/1.0/Markdown.Converter'
  }	
});

define([
	  'jquery',
	  'underscore',
	  'backbone',
	  'views/base'
	],
	function($, _, Backbone, BaseView, postIndex) {
  	BlogRouter = Backbone.Router.extend({
	    routes: {
	      // Define some URL routes
				'/': 'test',
	
	      // Default
	      '*actions': 'defaultAction'
	    },
	    
	    test: function (parameter)
	    {
		    alert(parameter);
	    },
	    
	    defaultAction: function (parameter)
	    {
	    	if(parameter=='')
	    	{
				   require([
					  	'views/base'
					  ],
					  function (BaseView) {
					  	 var baseView = new BaseView({
						  	 'posts': Blog.posts,
						  	 'meta': Blog.meta
					  	 });
					    baseView.render();
					  }
					);
					return;
	    	}
	    	if(Blog.posts[parameter]==undefined)
	    	{
	    		require([
					  	'views/404'
					  ],
					  function (PageNotFoundView) {
					  	 var pageNotFoundView = new PageNotFoundView({
						  	 'posts': Blog.posts,
						  	 'meta': Blog.meta
					  	 });
					    pageNotFoundView.render();
					  }
					);
	    	}
	    	else
	    	{
		    	if(Blog.posts[parameter]['markdown']!=undefined)
		    	{
			    	//Render that page.
			    	postDetails = Blog.posts[parameter];
			    	postDetails.permalink = parameter;
			    	require([
						  	'views/post'
						  ],
						  function (PostView) {
					  	 var postView = new PostView({
					  	 		'post': postDetails,
					  	 		'meta': Blog.meta
					  	 });
						    postView.render();
						  }
						);
		    	}
		    	else if(Blog.posts[parameter]['redirect']!=undefined)
		    	{
			    	//Redirect to the appropriate page.
			    	this.navigate(Blog.posts[parameter]['redirect'],{trigger: true, replace: true});
		    	}
	    	}
	    }		    		    
	  });
	  
	  if(!Blog.hasOwnProperty('posts') | !Blog.hasOwnProperty('meta'))
		{
			//The blog data has not been embedded so load it via AJAX.
			require([
					'text!/blog/posts.json',
					'text!/blog/meta.json'
				],
				function(posts,meta) {
					Blog.posts = $.parseJSON(posts);
					Blog.meta = $.parseJSON(meta);
					router = new BlogRouter;
			    Backbone.history.start({pushState: true});
				}
			);
		}
		else
		{
			//Blog data has been embedded, just go ahead with the process.
			router = new BlogRouter;
	    Backbone.history.start({pushState: true});
		}
	  
    $('#base').on('click','.interceptLink',function (e) {
      //Start intercepting clicks on links that have the interceptLink class.
      router.navigate($(this).attr('href'),{trigger: true});
      e.preventDefault();
      return false;
    });
 	}
);