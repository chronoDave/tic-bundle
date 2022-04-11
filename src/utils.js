const getCommentStyle = script => {
  switch (script) {
    case 'lua':
    case 'moon':
      return '--';
    case 'fennel':
      return ';;';
    case 'ruby':
      return '#';
    case 'js':
    case 'wren':
    case 'squirrel':
    default:
      return '//';
  }
};

module.exports = {
  getCommentStyle
};
