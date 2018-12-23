module.exports = {
  hostname: process.env.HOSTNAME,
  path: {
    client: './../client/build',
    server: './'
  },
  port: 8081,
  apiVersion: 'v1',
  db: {
    url: process.env.DATABASE_URL,
    define: {
      timestamps: false,
      freezeTableName: true
    },
    dialectOptions: {
      ssl: process.env.DATABASE_SSL
    }
  },
  auth: {
    strategy: "jwt",
    secret: 'asdlfjksdaf',//process.env.JWT_SECRET,
    scheme: "Bearer",
    expiresIn: "10h",
    resetPassword: {
      tokenLength: 25,
      expiresIn: "60"
    },
    saltRound: 10
  },
  web3: {
    tokenAbi: process.env.TOKEN_ABI,
    tokenAddr: process.env.TOKEN_ADDR,
    preSaleAbi: process.env.PRESALE_ABI,
    preSaleAddr: process.env.PRESALE_ADDR,
    mainSaleAbi: process.env.MAINSALE_ABI,
    mainSaleAddr: process.env.MAINSALE_ADDR,
    provider: process.env.WEB3_PROVIDER
  },
  email: {
    disableVerification: process.env.EMAIL_VERIFICATION_DISABLE
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    region: process.env.AWS_REGION,
    s3: {
      bucket: process.env.AWS_S3_BUCKETNAME
    }
  }
};
