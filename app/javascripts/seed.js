Eutil = require('ethereumjs-util');
ECLibrary = artifacts.require("./ECLibrary.sol");

module.exports = function(callback) {
  ECLibrary.deployed().then(function(i) {
    i.addECToLibrary(
      '中华人民共和国居民身份证',
      '0000000000',
      '2016.08.03-2026.08.03',
      '云阳县公安局',
      '彭冬',
      '',
      ,
      0,  // 身份证
      0   // 国家级 
    ).then(function(f) {console.log(f)})});
  
  ECLibrary.deployed().then(function(i) {
    i.ECIndex.call().then(function(f) {
      console.log(f)
    })
  });
