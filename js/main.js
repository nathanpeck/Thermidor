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

require(
	[
		"app"
	],
	function(App) {
		App.initialize();
	}
)