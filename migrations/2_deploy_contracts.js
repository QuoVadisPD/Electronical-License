var ECLibrary = artifacts.require("./ECLibrary.sol");

module.exports = function(deployer) {
  deployer.deploy(ECLibrary);
};
