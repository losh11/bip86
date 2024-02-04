const BIP86 = require('../src/index');

function init(networks, slip44, pub_types, isTestnet) {
  let mnemonic = BIP86.entropyToMnemonic('00000000000000000000000000000000')
  let network;
  if(networks) {
    if (isTestnet) {
      network = networks.mainnet;
    } else {
      network = networks.testnet;
    }
  }

  let root = new BIP86.fromMnemonic(mnemonic, '', isTestnet, slip44, pub_types, network);
  let child0 = root.deriveAccount(0);
  let account0 = new BIP86.fromXPrv(child0, pub_types, networks);
  return { root, child0, account0 };
}

function initFromXPub(isTestnet) {
  let xpub = 'xprv9s21ZrQH143K3GJpoapnV8SFfukcVBSfeCficPSGfubmSFDxo1kuHnLisriDvSnRRuL2Qrg5ggqHKNVpxR86QEC8w35uxmGoggxtQTPvfUu'
  return new BIP86.fromXPub(xpub, isTestnet);
}

// mainnet
let data, account1;
describe('account0', () => {
  beforeEach(() => {
    data = init();
  });

  it("Generates correct rootPublic and rootPrivate", () => {
    expect(data.root.getRootPrivateKey()).toEqual('xprv9s21ZrQH143K3GJpoapnV8SFfukcVBSfeCficPSGfubmSFDxo1kuHnLisriDvSnRRuL2Qrg5ggqHKNVpxR86QEC8w35uxmGoggxtQTPvfUu');
    expect(data.root.getRootPublicKey()).toEqual('xpub661MyMwAqRbcFkPHucMnrGNzDwb6teAX1RbKQmqtEF8kK3Z7LZ59qafCjB9eCRLiTVG3uxBxgKvRgbubRhqSKXnGGb1aoaqLrpMBDrVxga8');
  });

  it("Generates correct root = m/86'/2'/0'", () => {
    expect(data.account0.getAccountPrivateKey()).toEqual('xprv9z3oTHGAd8UWVZoofsbR7Uy1hrddXo4KPQL9jnCqFw2ZHBUEq4SB8fGkdG5mNASUVhdzpuq7ctwwkR7RcmV1bUQr2xaQjohWv8W89eahnWS');
    expect(data.account0.getAccountPublicKey()).toEqual('xpub6D39rno4TW2oi3tGmu8RUcukFtU7wFnAkdFkYAcSpGZY9yoPNbkRgTbEUYyhkqacm7dyNfc5uK8oQ71M2hTALqqDQeE2JAQn9YDteoW2cQC');
  });

  it("Generates correct first receiving address = m/86'/2'/0'/0/0", () => {
    expect(data.account0.getPrivateKey(0)).toEqual('L1VWWmCQHuzPArfijDQ8uuM7fqswHNAb4ZzEAr3MGiZRm5X7bPCU');
    expect(data.account0.getPublicKey(0)).toEqual('037af20364ca7c95e5f11fc4fc11df425271c85f829a1edd7f987973ea46726b73');
    expect(data.account0.getAddress(0)).toEqual('ltc1puht8rk95c53q3u9w3pf9h3jfcutcrl9lxc7rqsdthjrse4k6sn7q9tuqm9');
  });

  it("Generates correct second receiving address = m/86'/2'/0'/0/1", () => {
    expect(data.account0.getPrivateKey(1)).toEqual('Kyh1bc2BD6LTRFdZkHhJR3ZBtUT4882RJyDFEreZa8FZfUjQAAYo');
    expect(data.account0.getPublicKey(1)).toEqual('039bb746feaa1780a361fcaa2d1b8a74b4ebff438a3b234d91af1c280145d20515');
    expect(data.account0.getAddress(1)).toEqual('ltc1p4m4d6s554w3lhamw6pt5je23xvzsqxnz58wc24gc8g9n328yc3xsg3antm');
  });

  it("Generates correct first change address = m/86'/2'/0'/1/0", () => {
    expect(data.account0.getPrivateKey(0, true)).toEqual('L3qWDjPnNgexw5S59kaF8CSTHXzxmai2NgKi2aibcgdT6rWEegKM');
    expect(data.account0.getPublicKey(0, true)).toEqual('0302660b5c13496c0bf406faeb84819372d843a43336131766a44590c45ace9b15');
    expect(data.account0.getAddress(0, true)).toEqual('ltc1pehskafcqerg3hqvx005ywevqta7r0q980xgnencjgez0fyf7lt7s8r36hx');
  });
});

// testnet
describe('account1', () => {
  beforeEach(() => {
    account1 = initFromXPub(true);
  });

  it("Generates correct root = m/86'/1'/0'", () => {
    expect(account1.getAccountPublicKey()).toEqual('xpub661MyMwAqRbcFkPHucMnrGNzDwb6teAX1RbKQmqtEF8kK3Z7LZ59qafCjB9eCRLiTVG3uxBxgKvRgbubRhqSKXnGGb1aoaqLrpMBDrVxga8');
  });

  it("Generates correct first receiving address = m/86'/1'/0'/0/0", () => {
    expect(account1.getPublicKey(0)).toEqual('027fa517bb858426db1571d0a63ebb792d9bfae95d7647d63b59c1dabbdc489e62');
    expect(account1.getAddress(0)).toEqual('tltc1pgglgutn7jh7ethvu846p5ryhj2djanwg05zp53phstn956vf80eshs7ruv');
  });

  it("Generates correct second receiving address = m/86'/1'/0'/0/1", () => {
    expect(account1.getPublicKey(1)).toEqual('03446801102d378f09aa200debc1acdff0f6fcf1c6d9bc1e2c7e14076d5fbc740e');
    expect(account1.getAddress(1)).toEqual('tltc1pej5u3p87qx76xh76zpadk52fne9ylvlxwvzc2p30nudfvkuaallst6sf0k');
  });

  it("Generates correct first change address = m/86'/1'/0'/1/0", () => {
    expect(account1.getPublicKey(0, true)).toEqual('03a994e59ce5cf762eec6e86d33caeba785afde30ce115dbf8568c46e43375fb0c');
    expect(account1.getAddress(0, true)).toEqual('tltc1puh9yqnravjevwjcdh04c3q62d7fh3uqh45mfgr8aaemhun09m3sqj6l5dn');
  });

  it("Generates correct second change address = m/86'/1'/0'/1/1", () => {
    expect(account1.getPublicKey(1, true)).toEqual('02ebc62c20f1e09e169a88745f60f6dac878c92db5c7ed78c6703d2d0426a01f94');
    expect(account1.getAddress(1, true)).toEqual('tltc1prv4rp9a7fazs2auw0agmwqnmkt7m05jl2cvadg0nc56yu0hvdsgssxdkcq');
  });
});

describe('network specific', () => {
  it("Creates LTC network data", () => {
    let data = init();
    expect(data.account0.getAddress(0)).toEqual('ltc1puht8rk95c53q3u9w3pf9h3jfcutcrl9lxc7rqsdthjrse4k6sn7q9tuqm9');
  });
});
