module.exports = {
  name: 'layout',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/layout',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
