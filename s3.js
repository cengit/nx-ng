require('dotenv').config();
const fs = require('fs');
const path = require('path');
const qiniu = require('qiniu');
const dir = require('node-dir');

/** 上传凭证 */
const accessKey = process.env.QINIU_ACCESS_KEY;
const secretKey = process.env.QINIU_SECRET_KEY;
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const options = {
  scope: process.env.QINIU_BUCKET,
  insertOnly: 1,
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

/** 构建配置类 */
const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;
config.useHttpsDomain = true;
config.useCdnDomain = true;

/** 数据流上传 */
const formUploader = new qiniu.form_up.FormUploader(config);

dir.files(path.join(__dirname, 'dist'), (err, files) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.log('dist 目录不存在');
      return;
    } else {
      throw err;
    }
  }
  files.forEach(filePath => {
    const readableStream = fs.createReadStream(filePath);
    const key = `${process.env.QINIU_PREFIX}/${
      filePath.match(new RegExp('dist[/](.*)$'))[1]
    }`;
    if (/\.(jpg|png|html|ico|txt|json|map|nx\-results)$/i.test(key)) {
      return;
    }
    console.log('开始上传：' + key);

    // putExtra 要么设为空，要么每次上传都单独设置，否则会影响七牛服务器的 MIME 类型判断
    formUploader.putStream(
      uploadToken,
      key,
      readableStream,
      null,
      (respErr, respBody, respInfo) => {
        if (respErr) {
          console.log(`${key} 上传失败！ 🚨 ${JSON.stringify(respErr)}`);
          throw respErr;
        }
        if (respInfo.statusCode == 200) {
          console.log(key + ' 上传成功~ 🎉');
        } else {
          console.log(`${key} 上传失败！ 🚨 ${respBody.error}`);
        }
      },
    );
  });
});
