import { CHAINS_ENUM } from "./consts";

export enum AddressType {
  P2PKH,
  P2WPKH,
  P2TR,
  P2SH_P2WPKH,
  M44_P2WPKH,
  M44_P2TR,
}

export enum UserLoginType {
  EMAIL,
  GMAIL,
  IMPORT,
  CREATE,
}

export enum NetworkType {
  MAINNET,
  TESTNET,
  SIGNET,
}

export enum RestoreWalletType {
  TOMO,
  SPARROW,
  XVERSE,
  OW,
  OTHERS,
}

export interface Chain {
  name: string;
  logo: string;
  enum: CHAINS_ENUM;
  network: string;
}

export interface BitcoinBalance {
  confirm_amount: string;
  pending_amount: string;
  amount: string;
  confirm_btc_amount: string;
  pending_btc_amount: string;
  btc_amount: string;
  confirm_inscription_amount: string;
  pending_inscription_amount: string;
  inscription_amount: string;
  usd_value: string;
}

export interface AddressAssets {
  total_btc: string;
  satoshis?: number;
  total_inscription: number;
}

export interface TxHistoryItem {
  txid: string;
  time: number;
  date: string;
  amount: string;
  symbol: string;
  address: string;
}

export interface Inscription {
  inscriptionId: string;
  inscriptionNumber: number;
  address: string;
  outputValue: number;
  preview: string;
  content: string;
  contentType: string;
  contentLength: number;
  timestamp: number;
  genesisTransaction: string;
  location: string;
  output: string;
  offset: number;
  contentBody: string;
  utxoHeight: number;
  utxoConfirmation: number;
}

export interface InscriptionMintedItem {
  title: string;
  desc: string;
  inscriptions: Inscription[];
}

export interface InscriptionSummary {
  mintedList: InscriptionMintedItem[];
}

export interface AppInfo {
  logo: string;
  title: string;
  desc: string;
  url: string;
  time: number;
  id: number;
  tag?: string;
  readtime?: number;
  new?: boolean;
  tagColor?: string;
}

export interface AppSummary {
  apps: AppInfo[];
  readTabTime?: number;
}

export interface FeeSummary {
  list: {
    title: string;
    desc: string;
    feeRate: number;
  }[];
}

export interface UTXO {
  txId: string;
  outputIndex: number;
  satoshis: number;
  scriptPk: string;
  addressType: AddressType;
  inscriptions: {
    id: string;
    num: number;
    offset: number;
  }[];
}

export interface UTXO_Detail {
  txId: string;
  outputIndex: number;
  satoshis: number;
  scriptPk: string;
  addressType: AddressType;
  inscriptions: Inscription[];
}

export enum TxType {
  SIGN_TX,
  SEND_BITCOIN,
  SEND_INSCRIPTION,
  SEND_DOGECOIN,
}

interface BaseUserToSignInput {
  index: number;
  sighashTypes: number[] | undefined;
  disableTweakSigner?: boolean;
}

export interface AddressUserToSignInput extends BaseUserToSignInput {
  address: string;
}

export interface PublicKeyUserToSignInput extends BaseUserToSignInput {
  publicKey: string;
}

export type UserToSignInput = AddressUserToSignInput | PublicKeyUserToSignInput;

export interface SignPsbtOptions {
  autoFinalized: boolean;
  toSignInputs?: UserToSignInput[];
}

export interface ToSignInput {
  index: number;
  publicKey: string;
  sighashTypes?: number[];
}
export type WalletKeyring = {
  key: string;
  index: number;
  type: string;
  addressType: AddressType;
  accounts: Account[];
  alianName: string;
  hdPath: string;
  userType?: UserLoginType;
  backupStep?: number;
};

export interface Account {
  type: string;
  pubkey: string;
  address: string;
  brandName?: string;
  alianName?: string;
  displayBrandName?: string;
  index?: number;
  balance?: number;
  key: string;
}

export interface InscribeOrder {
  orderId: string;
  payAddress: string;
  totalFee: number;
  minerFee: number;
  originServiceFee: number;
  serviceFee: number;
  outputValue: number;
}

export interface TokenBalance {
  availableBalance: string;
  overallBalance: string;
  ticker: string;
  transferableBalance: string;
  availableBalanceSafe: string;
  availableBalanceUnSafe: string;
}

export interface TokenInfo {
  totalSupply: string;
  totalMinted: string;
}

export enum TokenInscriptionType {
  INSCRIBE_TRANSFER,
  INSCRIBE_MINT,
}
export interface TokenTransfer {
  ticker: string;
  amount: string;
  inscriptionId: string;
  inscriptionNumber: number;
  timestamp: number;
}

export interface AddressTokenSummary {
  tokenInfo: TokenInfo;
  tokenBalance: TokenBalance;
  historyList: TokenTransfer[];
  transferableList: TokenTransfer[];
}

export interface DecodedPsbt {
  inputInfos: {
    txid: string;
    vout: number;
    address: string;
    value: number;
    inscriptions: Inscription[];
    sighashType: number;
  }[];
  outputInfos: {
    address: string;
    value: number;
    inscriptions: Inscription[];
  }[];
  feeRate: number;
  fee: number;
  hasScammerAddress: boolean;
  warning: string;
}

export interface ToAddressInfo {
  address: string;
  domain?: string;
  inscription?: Inscription;
}

export interface RawTxInfo {
  psbtHex: string;
  rawtx: string;
  toAddressInfo?: ToAddressInfo;
  fee?: number;
}

export interface WalletConfig {
  version: string;
  moonPayEnabled: boolean;
  statusMessage: string;
}

export enum WebsiteState {
  CHECKING,
  SCAMMER,
  SAFE,
}

export enum ePlatform {
  evm = "evm",
  bitcoin = "bitcoin",
  cosmos = "cosmos",
  solana = "solana",
}
export enum eNetworkType {
  mainnet = "mainnet",
  testnet = "testnet",
  custom = "custom",
  signet = "signet",
}

export enum eCosmosChainId {
  cosmoshub = "cosmoshub-4",
  babylonTestnet = "bbn-test-3",
  nubitTestnet = "nubit-alphatestnet-1",
}
export interface NetworkItem {
  id: string;
  platform: ePlatform;
  symbol: string; // eg. ETH, USDT
  networkType: eNetworkType;
  nickname: string;
  tokenName?: string;
  networkName?: string;
  type?: string;
  ticker?: string; // eg. ETH, BNB, only evm native token name
  rpcUrl?: string;
  assetIcon?: string; // eg. usdt icon
  networkIcon?: string; // eg. ethereum icon, btc icon
  chainId?: string; // for evm
  chainIdNum?: number; // for evm
  explorerBase?: string;
  decimals?: number;
  logoUrl?: string;
  denom?: string; // for cosmos
  prefix?: string; // for cosmos

  // btc
  apiUnisat?: string;
  apiMempool?: string;
  apiBackend?: string;
  apiBlockstream?: string;
  netType?: {
    value: NetworkType;
    label: string;
    name: string;
    validNames: any[];
  };
  nodeToken?: string;
}

export interface TokenItem {
  address: string;
  name: string;
  logo: string;
  symbol: string;
  decimals: number;
  chainId: string;
  chain?: string;
  custom?: boolean;
  orgin?: any;
  price?: any;
  [key: string]: any;
}

export interface AccountDataItem {
  btcAccount: Account;
  evmAddress: string;
  cosmos: {
    address?: string;
    bbnAddress?: string;
    nubitAddress?: string;
  };
  solAddress: string;

  tokens: TokenCachedItem[]; // key, for native token, will be network id, for erc20, will be contract address
  allTokens?: TokenCachedItem[]; // key, for native token, will be network id, for erc20, will be contract address
  timestamp?: number; // update
  dirty?: boolean; // update
}

export interface TokenCachedItem {
  token?: TokenItem;
  network?: NetworkItem;
  balance?: string;
  hidden?: boolean;
  dollarValue?: string;
  addressType?: any;
  isMultichain?: boolean;
  haveBalance?: boolean;
  isHiddenInAll?: boolean;
}

export interface EvmTxReq {
  to: string;
  amount: string;
  chainId: string | number;
  gasPrice?: string;
  gasLimit?: string;
  contractAddress?: string;
}

export interface TokenReq {
  tokenAddress: string;
  network?: NetworkItem;
}

export interface GasReq {
  from: string;
  to: string;
  amount: string | number;
  chainId: string;
  contractAddress?: string;
}

export interface TxRecord {
  txnType: string;
  from: string;
  to: string;
  fee: string;
  fAmount: string;
  amount: string;
  totalAmount: string;
  symbol: string;
  networkId: string;
  time: number;
  contractAddress?: string;
  updateTime?: number;
  status?: string;
  txHash?: string;
  gasPrice?: string;
  gasLimit?: string;
  nonce?: string;
  chainId?: string;
}

export interface iBtcCurAccount {
  address: string;
  alianName: string;
  index: number;
  key: string;
  pubkey: string;
  type: string;
}

export interface CosmosTxParam {
  from?: string;
  to: string;
  amount: string;
  denom: string;
  feeAmount?: string;
}

export interface CosmosSignParam {
  chainId: string;
  signer: string;
  signDoc: any;
}

export interface WatchAssetReq {
  type: string;
  options: {
    address: string;
    symbol: string;
    decimals: string;
  };
}

export interface CosmosAddresses {
  address?: string;
  bbnAddress?: string;
  nubitAddress?: string;
}

export interface iTempTokenBalanceInfo {
  balance: string;
  price: string;
  dollarValue: string;
}
