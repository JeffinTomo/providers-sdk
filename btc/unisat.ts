export type UnisatAPIs = {
  // connect
  requestAccounts: () => Promise<string[]>;
  getAccounts: () => Promise<string[]>;
  getPublicKey: () => Promise<string>;
  signPsbt: (psbtHex: string) => Promise<string>;
  signPsbts: (psbtsHexes: string[]) => Promise<string[]>;
  getNetwork: () => Promise<Network>;
  signMessage: (
    message: string,
    // default 'ecdsa'
    type?: "ecdsa" | "bip322-simple",
  ) => Promise<string>;
  switchNetwork: (network: Network) => Promise<void>;
  sendBitcoin: (to: string, amount: number) => Promise<string>;
  pushTx?: (txHex: string) => Promise<string>;
  getBalance?: (address: string) => Promise<number>;
  getInscriptions?: (
    cursor?: number,
    size?: number,
  ) => Promise<InscriptionResult[]>;
  on?: (eventName: string, callBack: () => void) => void;
  off?: (eventName: string, callBack: () => void) => void;
};
