const hasbin = require('hasbin')
const parser = require('xml2json')

module.exports = (api, options) => {
	const hasCordova = hasbin.sync('cordova')
	const hasVueCordova = api.hasPlugin('vue-cli-plugin-cordova')

	if (!hasCordova) {
		api.exitLog(`Unable to find cordova binary, make sure it's installed.`, 'error')
		return
	}

	if (!hasVueCordova) {
		api.exitLog(`Unable to find vue-cordova plugin, make sure it's installed.`, 'error')
		return
	}

	api.onCreateComplete(() => {
	    const fs = require('fs');
	    const packagePath = api.resolve(`./package.json`);
	    const configPath = api.resolve(`./src-cordova/config.xml`);

	    let contentPackage = JSON.parse(fs.readFileSync(packagePath, { encoding: 'utf-8' }));
	    let contentConfig = JSON.parse(parser.toJson(fs.readFileSync(configPath, { encoding: 'utf-8' })));

	    if (contentPackage.version !== contentConfig.widget.version) {
	    	contentPackage.version = contentConfig.widget.version
	    	fs.writeFileSync(packagePath, JSON.stringify(contentPackage, null, 2));
	    }
	});

	api.extendPackage({
		scripts: {
			'app-version-sync': 'vue-cli-service app-version-sync'
		}
	})
};