// Filename: app.js
define([
	  'progress!jquery',
	  'progress!underscore',
	  'progress!backbone',
	  'progress!router'
	],
	function($, _, Backbone, Router){
		var App = {
			initialize: function() {
		    // Pass in our Router module and call it's initialize function
		    Router.initialize();
		  }
		};
	  return App;
	}
);