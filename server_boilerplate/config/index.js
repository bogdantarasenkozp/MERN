module.exports = (envName) => {
  let config;
  const configDir = './environment/';

  try {
    config = require(`${configDir}${envName}`);
  } catch (e) {
    config = process.env.IS_HEROKU
      ? require(`${configDir}heroku`)
      : require(`${configDir}dev`);
  }

  return config;
};