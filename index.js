const path = require('path');
const { KintoneRestAPIClient } = require('@kintone/rest-api-client');

const getResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body
  };
};

exports.handler = async (event) => {
  try {
    const pfxFilePath = path.resolve(process.env.LAMBDA_TASK_ROOT, process.env.KINTONE_CLIENT_CERTIFICATE_PATH);
    console.log(pfxFilePath);
    const client = new KintoneRestAPIClient({
      baseUrl: `https://${process.env.KINTONE_HOSTNAME}`,
      auth: {
        username: process.env.KINTONE_USERNAME,
        password: process.env.KINTONE_PASSWORD,
      },
      basicAuth: { // Basic 認証の設定
        username: process.env.KINTONE_BASIC_USERNAME,
        password: process.env.KINTONE_BASIC_PASSWORD
      },
      clientCertAuth: {
        pfxFilePath,
        password: process.env.KINTONE_CLIENT_CERTIFICATE_PASSWORD
      }
    });
    const { record } = await client.record.getRecord({ app: 50, id: 1 });
    return getResponse(200, JSON.stringify(record));

  } catch (error) {
    return getResponse(500, JSON.stringify(error));
  }
};
