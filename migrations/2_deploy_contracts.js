const PassportManagement = artifacts.require("PassportManagement");
const config = require('./config.js');

module.exports = function (deployer) {
  deployer.deploy(PassportManagement, config.adminAddress);
};