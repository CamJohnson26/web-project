var config = {};

config.AWS = {};
config.Web = {};

config.AWS.region =  process.env.WEB_PROJECT_AWS_REGION || 'us-west-2';

config.Web.endpoint = 'http://localhost:8080'

module.exports = config;