/**
 * Serialise config for insertion at top of output file
 * @param {object} config - Config
 * @param {string} config.root
 * @param {string[]} config.files
 * @param {function} config.after
 * @param {object} config.output
 * @param {string} config.output.path
 * @param {string} config.output.name
 * @param {string} config.output.extension
 * @param {object} config.metadata
 * @param {string} config.metadata.title
 * @param {string} config.metadata.author
 * @param {string} config.metadata.desc
 * @param {string} config.metadata.script
 * @param {string} config.metadata.input
 * @param {string} config.metadata.saveid
 */
module.exports = (config) => {
    const commentStyle = getCommentStyle(config.metadata.script);

    return Object
        .entries(config.metadata)
        .filter(([, value]) => value)
        .map(([key, value]) => `${commentStyle} ${key}: ${value}`)
        .join('\n');
};

let getCommentStyle = (script) => {
    switch(script) {
        case 'lua':
        case 'moon':
            return `--`;
        case 'fennel':
            return `;;`;
        case 'ruby':
            return `#`;
        case 'js':
        case 'wren':
        case 'squirrel':
        default:
            return `//`;
    }
};