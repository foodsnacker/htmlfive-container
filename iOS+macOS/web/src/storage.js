	/* storage.js 0.0.1
		(c), (p) 2020-2022 Jörg Burbach, Ducks on the Water
		Engine for htmlfive.net with caching for strict HTML5-support. Works in all modern browsers.
		
		Dual-Licence: private or academic (GPL), commercial (proprietary, tbd)
		
		Functions
			- save data
			- load data
			- remove one item
			- clear all data

		work for
		 - local (will be saved and only removed after calling remove or clear)
		 - session storage (will be saved until browser window is closed)
		 - external (call setURL first, and use a callback!)
		
		See teststorage.php for usage. Upload the file to a webserver.
		
		todo:
		- save to cloud
		- error-checks
		- no network error should result in FALSE
		- switch FETCH to https://www.w3schools.com/xml/xml_http.asp
	*/
		
	HTMLfive.storage = {
		storageType: { local:0, session: 1, external: 2, cloud:3 },
		externalURL: '',
		externalCallback: null,
		isAvailable: false,
		isSessionAvailable: false,

		/* .init - initializes the storage-component. Use isAvailable to see, if it's available */
		init: function() {
			if (typeof localStorage !== 'undefined') { this.isAvailable = true; } else { this.isAvailable = false; }
			if (typeof sessionStorage !== 'undefined') { this.isSessionAvailable = true; } else { this.isSessionAvailable = false; }
		},
		
		/* .save - save data to the storage
			ItemName 	= the name of the data chunk
			data 		= the data, can be any object, etc.
			session		= see HTMLfive.storage.storageType
						  0 = default - data will be saved locally until deleted
		*/
		save: function(ItemName,data,session=HTMLfive.storage.storageType.local) {
			var returnbool = false;
			switch (session) {
				case 0:																	// local = persistant
					if (this.isAvailable == true) {
						localStorage.setItem(ItemName,data);							// save to local data
						returnbool = true;												// success!
					}
					break;
				case 1: 																// session
					if (this.isSessionAvailable == true) {
						sessionStorage.setItem(ItemName,data);							// save to session data
						returnbool = true;												// success!
					}
				break;
					case 2:																// external, e.g. a PHP-script
						fetch(this.externalURL + "?save&id=" + ItemName + "&data=" + data).then((response) => response.text().then(this.externalCallback));
						returnbool = true;												// true means, the URL was called.
					break;
				case 3:																	// external, e.g. a cloud
						returnbool = false;												// always false, until implemented
					break;
				}
			return returnbool;															// failed!
		},
		
		/* .load - loads previously saved data from the storage
			ItemName 	= the name of the data chunk
			defaultdata	= '' = default - if item was not saved before, give back defaultdata
			session		= see HTMLfive.storage.storageType
						  0 = default - data will be retrieved from local storage
		*/
		load: function(ItemName,defaultdata='',session=HTMLfive.storage.storageType.local) {
			var returnData = defaultdata;
			switch (session) {
				case 0:																		// local = persistant
					if (this.isAvailable == true) {
						var tempData = localStorage.getItem(ItemName);						// get data for ItemName
						if (typeof tempData !== 'undefined') { returnData = tempData; }		// if not there, throw defaultdata
					}
					break;
				case 1: 																	// session
					if (this.isSessionAvailable == true) {
						var tempData = sessionStorage.getItem(ItemName);
						if (typeof tempData !== 'undefined') { returnData = tempData; }
					}
					break;
				case 2:																		// external, e.g. a PHP-script
					fetch(this.externalURL + "?load&id=" + ItemName + "&data=" + defaultdata).then((response) => response.text().then(this.externalCallback));
					break;
				case 3:																		// external, e.g. a cloud
					break;
			}
			return returnData;
		},
		
		/* .remove - removes previously saved data from the storage
			ItemName 	= the name of the data chunk
			session		= see HTMLfive.storage.storageType
						  0 = default - data will be deleted locally
		*/
		remove: function(ItemName,session=HTMLfive.storage.storageType.local) {
			switch (session) {
				case 0:																		// local
					if (this.isAvailable == true) { localStorage.removeItem(ItemName); }
					break;
				case 1:																		// session
					if (this.isSessionAvailable == true) { sessionStorage.removeItem(ItemName); }
					break;
				case 2:																		// external, e.g. a PHP-script
					fetch(this.externalURL + "?remove&id=" + ItemName).then((response) => response.text().then(this.externalCallback));
					break;
				case 3:																		// external, e.g. a cloud
					break;
			}
		},

		/* .clear - clears all previously saved data from the storage
			session		= see HTMLfive.storage.storageType
						  0 = default - all local data will be deleted
		*/
		clear: function(session=false) {
			switch (session) {
				case 0:																		// local
					if (this.isAvailable == true) { localStorage.clear(); }
					break;
				case 1:																		// session
					if (this.isSessionAvailable == true) { sessionStorage.clear(); }
					break;
				case 2:																		// external, e.g. a PHP-script
					fetch(this.externalURL + "?clear" + ItemName).then((response) => response.text().then(this.externalCallback));
					break;
				case 3:																		// external, e.g. a cloud
					break;
				}
			},
		
		/* .setURL - sets an URL for external storage using a PHP-script
			newURL		= the URL to callback
			callback	= the function to call, when data is sent by the script
		*/
		setURL: function (newURL,callback) {
			this.externalURL = newURL;
			this.externalCallback = callback;
		},
	}
	
	/* Init */
	HTMLfive.storage.init();
	