const mainnet = { 
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bech32: 'ltc',
  bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0
}

const testnet = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bech32: 'tltc',
  bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef
}

export default {mainnet, testnet}