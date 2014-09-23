(function (module) {

    var
        path = require('path'),
        fs = require('fs-extra'),
        walk = require('walk'),
        _config = null;

    module.init = function (config) {
        var cwd = process.cwd();

        _config = config;
        _config.paths.source = path.resolve(cwd, config.paths.source);
        _config.paths.destination = path.resolve(cwd, config.paths.destination);
        _config.paths.template = path.resolve(cwd, config.paths.template);
        _config.tokens = config.tokens || ['|title|', '|styles|', '|content|', '|scripts|'];
    };

    module.generate = function (config, done) {

        if (!config) throw new Error('You must pass in the config options to generate files.');
        if (!done) throw new Error('You need to pass a callback into generate so your script can continue once its done.');

        if (_config === null) {
            module.init(config);
        }

        fs.removeSync(_config.paths.destination);
        fs.mkdirSync(_config.paths.destination);

        var options = { followLinks: false };

        var getPropertyNameFromToken = function (token) {
            return token.match(/[a-zA-Z]/g).join('').toLowerCase();
        };

        var getContent = function (fileContents) {
            var content = {};

            var extractText = function (token) {
                var contentArray = fileContents.split(token);
                return contentArray.length > 1 ? contentArray[1] : '';
            };

            _config.tokens.forEach(function (token) {
                var propertyName = getPropertyNameFromToken(token);
                content[propertyName] = extractText(token);
            });

            return content;
        };

        var stats = {
            filesCount: 0
        };

        var
            fileContents = '',
            contents = '',
            finalContent = '',
            walker = null,
            template = fs.readFileSync(_config.paths.template, 'utf-8');

        walker = walk.walk(_config.paths.source, options);

        walker.on("file", function (root, fileStats, next) {

            var
                filePath = path.join(root, fileStats.name),
                destinationPath = filePath.replace(_config.paths.source, _config.paths.destination);

            if (path.extname(filePath) === '.html') {
                var fileContents = fs.readFileSync(filePath, { encoding: 'utf-8' });
                contents = getContent(fileContents);

                finalContent = template;
                _config.tokens.forEach(function (token) {
                    if (finalContent.indexOf(token) > -1) {
                        finalContent = finalContent.replace(token, contents[getPropertyNameFromToken(token)]);
                    }
                });

                fs.ensureFileSync(destinationPath);
                fs.writeFileSync(destinationPath, finalContent);
                stats.filesCount++;
                next();
            } else {
                fs.copySync(filePath, destinationPath);
                stats.filesCount++;
                next();
            }
        });

        walker.on("errors", function (root, nodeStatsArray, next) {
            next();
        });

        walker.on("end", function () {
            stats.message = stats.filesCount + ' files created'
            done(stats);
        });
    };

}(module.exports));