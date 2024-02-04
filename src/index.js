const bip39 = require('bip39')
const { BIP32Factory } = require('bip32')
const ecurve = require('ecurve')
const secp256k1 = ecurve.getCurveByName('secp256k1')
const schnorr = require('bip-schnorr')
const bech32 = require('bech32').bech32
const bech32m = require('bech32').bech32m
const ecc = require('tiny-secp256k1');
const bip32 = BIP32Factory(ecc);
const litecoinNetworks = require('./networks')

/**
 * Constructor
 * Derive accounts from a mnemonic.
 * @param {string} mnemonic
 * @param {string} password
 * @param {boolean} isTestnet
 * @param {number} coinType - slip44
 * @param {object} network
 * @return 
 */
function fromMnemonic(mnemonic, password = '', isTestnet, coinType, network) {
  this.seed = bip39.mnemonicToSeedSync(mnemonic, password)
  this.isTestnet = isTestnet === true
  this.coinType = this.isTestnet ? 1 : coinType ? coinType : 2 // 2 is for LTC Mainnet and 1 is testnet for all coins
  this.network = network || this.isTestnet ? litecoinNetworks.testnet : litecoinNetworks.mainnet
}

/**
 * Get root master private key
 * @return {string}
 */
fromMnemonic.prototype.getRootPrivateKey = function () {
  let xprv = bip32.fromSeed(this.seed, this.network).toBase58()

  return xprv
}

/**
 * Get root master public key
 * @return {string}
 */
fromMnemonic.prototype.getRootPublicKey = function () {
  let xpub = bip32.fromSeed(this.seed, this.network).neutered().toBase58()

  return xpub
}

/**
 * Derive a new master private key
 * @param {number} number
 * @param {number} changePurpose
 * @return {string}
 */
fromMnemonic.prototype.deriveAccount = function (number, changePurpose) {
	let purpose = changePurpose || 86
		, keypath = "m/" + purpose + "'/" + this.coinType + "'/" + number + "'"
    , account = bip32.fromSeed(this.seed, this.network).derivePath(keypath).toBase58()

  return account
}

/**
 * Constructor
 * Create key pairs from a private master key of mainnet and testnet.
 * @param {string} xprv
 * @param {object} networks
 * @param {boolean} isTestnet
 */
function fromXPrv(xprv, isTestnet) {
  this.networks = isTestnet ? litecoinNetworks.testnet : litecoinNetworks.mainnet
  this.xprv = xprv
  this.isTestnet = isTestnet === true
}

/**
 * Get account master private key
 * @return {string}
 */
fromXPrv.prototype.getAccountPrivateKey = function () {
  let xprv = bip32.fromBase58(this.xprv, this.network).toBase58()

  return xprv
}

/**
 * Get account master public key
 * @return {string}
 */
fromXPrv.prototype.getAccountPublicKey = function () {
  let xpub = bip32.fromBase58(this.xprv, this.network).neutered().toBase58()

  return xpub
}

/**
 * Get private key
 * @param {number} index
 * @param {boolean} isChange
 * @return {string}
 */
fromXPrv.prototype.getPrivateKey = function (index, isChange) {
  let change = isChange === true ? 1 : 0
    , prvkey = bip32.fromBase58(this.xprv, this.network).derive(change).derive(index)

  return prvkey.toWIF()
}

/**
 * Get public key
 * @param {number} index
 * @param {boolean} isChange
 * @return {string}
 */
fromXPrv.prototype.getPublicKey = function (index, isChange) {
  let change = isChange === true ? 1 : 0
    , pubKey = bip32.fromBase58(this.xprv, this.network).derive(change).derive(index).publicKey

  return pubKey.toString('hex')
}

/**
 * Get address
 * @param {number} index
 * @param {boolean} isChange
 * @param {number} purpose
 * @return {string}
 */
fromXPrv.prototype.getAddress = function (index, isChange, purpose) {
  let change = isChange === true ? 1 : 0
    , pubkey = bip32.fromBase58(this.xprv, this.network).derive(change).derive(index).publicKey

  return getP2TRAddress(pubkey, this.isTestnet)
}

/**
 * Constructor
 * Create public keys and addresses from a public master key of mainnet and testnet.
 * @param {string} xpub/tpub
 * @param {object} networks
 */
function fromXPub(xpub, isTestnet) {
  this.networks = isTestnet ? litecoinNetworks.testnet : litecoinNetworks.mainnet
  this.xpub = xpub
  this.isTestnet = isTestnet === true
}

/**
 * Get account master public key
 * @return {string}
 */
fromXPub.prototype.getAccountPublicKey = function () {
  let xpub = bip32.fromBase58(this.xpub, this.network).neutered().toBase58()

  return xpub
}

/**
 * Get public key
 * @param {number} index
 * @param {boolean} isChange
 * @return {string}
 */
fromXPub.prototype.getPublicKey = function (index, isChange) {
  let change = isChange === true ? 1 : 0
    , xpub = bip32.fromBase58(this.xpub, this.network).derive(change).derive(index)

  return xpub.publicKey.toString('hex')
}

/**
 * Get address
 * @param {number} index
 * @param {boolean} isChange
 * @param {number} purpose
 * @return {string}
 */
fromXPub.prototype.getAddress = function (index, isChange, purpose) {
  let change = isChange === true ? 1 : 0
    , pubkey = bip32.fromBase58(this.xpub, this.network).derive(change).derive(index).publicKey

  return getP2TRAddress(pubkey, this.isTestnet)
}

const getP2TRAddress = (pubkey, testnet = false) => {
  const pubKey = ecurve.Point.decodeFrom(secp256k1, pubkey)
  const taprootPubkey = schnorr.taproot.taprootConstruct(pubKey)
  const words = bech32.toWords(taprootPubkey)
  words.unshift(1)
  return bech32m.encode(testnet ? 'tltc' : 'ltc', words)
}

module.exports = {
  generateMnemonic: bip39.generateMnemonic,
  entropyToMnemonic: bip39.entropyToMnemonic,
  fromMnemonic,
  fromXPrv,
  fromXPub,
  networks: litecoinNetworks.default
}
