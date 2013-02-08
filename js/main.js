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
	  'views/base',
	  'text!/blog/index.json'
	],
	function($, _, Backbone, BaseView, postIndex) {
  	postIndex = $.parseJSON(postIndex);
  	
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
						  	 'postIndex': postIndex
					  	 });
					    baseView.render();
					  }
					);
					return;
	    	}
	    	if(postIndex[parameter]==undefined)
	    	{
	    		alert('404 Page Placeholder');
		    	//404
	    	}
	    	else
	    	{
		    	if(postIndex[parameter]['markdown']!=undefined)
		    	{
			    	//Render that page.
			    	postDetails = postIndex[parameter];
			    	postDetails.permalink = parameter;
			    	require([
						  	'views/post'
						  ],
						  function (PostView) {
					  	 var postView = new PostView({'post': postDetails});
						    postView.render();
						  }
						);
		    	}
		    	else if(postIndex[parameter]['redirect']!=undefined)
		    	{
			    	//Redirect to the appropriate page.
			    	this.navigate(postIndex[parameter]['redirect'],{trigger: true, replace: true});
		    	}
	    	}
	    }		    		    
	  });
	  
    router = new BlogRouter;
    Backbone.history.start({pushState: true});
	  
    $('#base').on('click','.interceptLink',function (e) {
      //Start intercepting clicks on links that have the interceptLink class.
      router.navigate($(this).attr('href'),{trigger: true});
      e.preventDefault();
      return false;
    });
	}
);