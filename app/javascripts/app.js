// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import ec_library_artifacts from '../../build/contracts/ECLibrary.json'

// ECLibrary is our usable abstraction, which we'll use through the code below.
var ECLibrary = contract(ec_library_artifacts);

const ipfsAPI = require('ipfs-api');
const ethUtil = require('ethereumjs-util');

const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});

function renderLibrary() {
  ECLibrary.deployed().then(function(i) {
    i.getEC.call(1).then(function(p) {
      $("#ec-list").append(buildEC(p));
    });
    i.getEC.call(2).then(function(p) {
      $("#ec-list").append(buildEC(p));
    });
  });
}
    
function buildEC(ec) {
  let node = $("<div/>");
  node.append("<img src='https://ipfs.io/ipfs/" + ec[5] + "' width='150px' />");
  node.append("<div>" + ec[0] + "</div>");
  node.append("<div>签发机关：" + ec[3] + "</div>");
  node.append("<div>有效期限：" + ec[2] + "</div>");
  node.append("<div>证照编号：" + ec[1] + "</div>");
  return node;
}

function saveOFDOnIpfs(reader) {
  return new Promise(function(resolve, reject) {
    const buffer = Buffer.from(reader.result);
    ipfs.add(buffer)
    .then((response) => {
      console.log(response)
      resolve(response[0].hash);
    }).catch((err) => {
      console.error(err)
      reject(err);
    })
  })
}
	
function saveEC(reader, decodedParams) {
  let OFDId;
  saveOFDOnIpfs(reader).then(function(id) {
    OFDId = id;
    saveECToBlockchain(decodedParams, OFDId);
  })
}

function saveECToBlockchain(params, OFDId) {
  console.log(params);
  // let ownerAddr =
  $("#msg").show();
  $("#msg").html("?");

  ECLibrary.deployed().then(function(i) {
    i.addECToLibrary(params["ec-name"], params["ec-num"], params["ec-expirationDate"], params["ec-cardUnit"], params["ec-owner"], params["ec-OFDLink"], params["ec-ownerAddr"], parseInt(params["ec-kind"]), parseInt(params["ec-level"]), {from: web3.eth.accounts[0], gas: 1000000}).then(function(f) {
      console.log(f);
      $("#msg").show();
      $("#msg").html("成功添加证照！");
    })
  });
}

window.App = {
  start: function() {
    var self = this;
    ECLibrary.setProvider(web3.currentProvider);
    renderLibrary();

    var reader;
    
    $("#ec-OFDLink").change(function(event) {
      const file = event.target.files[0]
      reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      $("#msg1").show();
      $("#msg1").html("1.ofdlink事件触发");
    });

    $("#add-ec-to-library").submit(function(event) {
      const req = $("#add-ec-to-library").serialize();
      let params = JSON.parse('{"' + req.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
      let decodedParams = {}
      Object.keys(params).forEach(function(v) {
        decodedParams[v] = decodeURIComponent(decodeURI(params[v]));
      });
      saveEC(reader, decodedParams);
      event.preventDefault();
    });

  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});
