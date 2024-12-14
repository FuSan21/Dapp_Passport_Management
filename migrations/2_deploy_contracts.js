const PassportManagement = artifacts.require("PassportManagement");

module.exports = function (deployer) {
  deployer.deploy(PassportManagement);
};