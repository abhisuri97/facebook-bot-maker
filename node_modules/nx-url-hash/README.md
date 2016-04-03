# URL-HASH
### Utility to easily generate hashes from URL's
Current configuration is coded to use SHA-1 and HEX encoding, future updates will enable users to easily configure this. 
&nbsp;

---

## Installation

	npm install nx-url-hash [--save]
	
## Usage

	var URLHash = require('nx-url-hash');
	var urlHash = new URLHash({
		key: [YourKey][Optional],
		algorithm: [Any Algorithm supported by NodeJS's Crypto Lib] [Default: SHA1] [Optional],
		encoding: [Any Encoding supported by NodeJS's Crypto Lib] [Default: HEX] [Optional],
	})
	var hash = urlHash.hash(URL_TO_ENCODE);

## Author
Peter Andreas Moelgaard ([GitHub](https://github.com/pmoelgaard), [Twitter](https://twitter.com/petermoelgaard))

## License
Licensed under the Apache License, Version 2.0: [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)