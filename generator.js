const hasbin = require('hasbin')
const parser = require('xml2json')

module.exports = (api, options) => {
	// early return if cordova binary is not found
	const hasCordova = hasbin.sync('cordova')
	const hasVueCordova = api.hasPlugin('vue-cordova')

	if (!hasCordova) {
		api.exitLog(`Unable to find cordova binary, make sure it's installed.`, 'error')
		return
	}

	if (!hasVueCordova) {
		api.exitLog(`Unable to find vue-cordova plugin, make sure it's installed.`, 'error')
		return
	}

	api.onCreateComplete(() => {
	    // inject to main.js
	    const fs = require('fs');
	    const packagePath = api.resolve(`./package.json`);
	    const configPath = api.resolve(`./src-cordova/config.xml`);

	    // get content
	    let contentPackage = JSON.parse(fs.readFileSync(packagePath, { encoding: 'utf-8' }));
	    let contentConfig = JSON.parse(parser.toJson(fs.readFileSync(configPath, { encoding: 'utf-8' })));

	    if (contentPackage.version !== contentConfig['@version']) {
	    	api.exitLog(`App version mismatch.`, 'error')
			return
	    }
	  });
	};

	api.extendPackage({
		scripts: {
			'app-version-checker': 'vue-cli service app-version-checker'
		}
	})
}