# Electronical-License
// truffle console下插入电子证照
ECLibrary.deployed().then(function(i) {i.addECToLibrary('中华人民共和国居民身份>证', '0000000000', '2016.08.03-2026.08.03', '云阳县公安局', '彭冬', 'QmcFJ32gn3KKGaQsHutMsQ73C7gvgoAy7r31VY1KTn8rSt', 0x22ec9902e1bb06584bcb00f062f3bc0d725807b1, 0, 0).then(function(f) {console.log(f)})});

// truffle console下获取电子证照
ECLibrary.deployed().then(function(i) {i.getEC.call(1).then(function(f) {console.log(f)})})
