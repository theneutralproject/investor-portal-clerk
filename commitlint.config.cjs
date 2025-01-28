module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'release',
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    // Make type optional
    'type-empty': [0],
    // Make the subject optional
    'subject-empty': [0],
    // Allow any case
    'subject-case': [0],
  },
};
