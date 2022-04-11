module.exports = {
  extends: 'airbnb-base',
  rules: {
    // General
    'no-confusing-arrow': 'off',
    'operator-linebreak': ['error', 'after'],
    'linebreak-style': 'off',
    'comma-dangle': 'off',
    'arrow-body-style': 'warn',
    'arrow-parens': ['error', 'as-needed'],
    'no-nested-ternary': 'off',
    'no-console': ['error', {
      allow: [
        'warn',
        'error',
        'info',
        'group',
        'groupEnd'
      ]
    }]
  },
  overrides: [{
    files: ['src/readConfig.js'],
    rules: {
      'global-require': 'off',
      // Import
      'import/no-dynamic-require': 'off',
    }
  }, {
    files: ['src/createBundle.js'],
    rules: {
      'global-require': 'off',
      // Import
      'import/no-extraneous-dependencies': 'off'
    }
  }]
};
