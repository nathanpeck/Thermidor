define([
	  'progress!jquery',
	  'progress!underscore',
	  'progress!backbone',
	  'progress!views/base',
	  'text!/blog/index.json'
	],
	function($, _, Backbone, BaseView, postIndex) {
	  var initialize = function() {
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
	  };
	  
	  return {
	    initialize: initialize
	  };
	}
);