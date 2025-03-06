export type UnisatAPIs = {
  // connect
  connect: () => Promise<string[]>;
  disconnect: () => Promise<boolean>;
  getConnectionStatus: () => Promise<object>;
  getBalance: () => Promise<object>;
  requestSignedMessage: ({ message: string }) => Promise<string>;
  requestDecryptedMessage: ({ message: string }) => Promise<string>;
  requestTransaction: ({
    recipientAddress: string,
    dogeAmount: number,
  }) => Promise<string>;
  getTransactionStatus: ({ txId: string }) => Promise<string[]>;
  getDRC20Balance: () => Promise<object>;
  getTransferableDRC20: ({ ticker: string }) => Promise<string>;
  requestAvailableDRC20Transaction: ({
    ticker: string,
    amount: number,
  }) => Promise<void>;
  getDunesBalance: ({ ticker: string }) => Promise<string>;
  requestDunesTransaction?: ({
    ticker: string,
    recipientAddress: string,
    amount: number,
  }) => Promise<string>;
  requestInscriptionTransaction?: ({
    recipientAddress: string,
    location: string,
  }) => Promise<number>;
  requestPsbt?: ({
    rawTx: string,
    indexes: number[],
    signOnly: boolean,
  }) => Promise<string>;
};
