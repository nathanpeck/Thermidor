define({
  load: function (name, req, load, config) {
  		console.log('Loading ' + name);
      //req has the same API as require().
      req([name], function (value) {
		      console.log('Intializing ' + name);
          load(value);
      });
  }
});