module.exports = {
  name: 'myapp-views-myapp',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/myapp/views/myapp',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
