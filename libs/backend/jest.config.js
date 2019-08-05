module.exports = {
  name: 'backend',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/backend',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
