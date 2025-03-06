// this script is injected into webpage's context

import { initializeProvider } from "../providers/initializeProvider";
import { BtcProvider } from "../providers/unisat";
import { guid } from "../utils/utils";

const TOMO_MYDOGE = "mydoge";
const DOGE = "doge";
const EVM = "ethereum";

export interface Interceptor {
  onRequest?: (data?: any) => any;
  onResponse?: (res?: any, data?: any) => any;
}

declare global {
  interface Window {
    tomo_btc: BtcProvider;
    tomo_doge: BtcProvider;
    Web3: any;
    ethereum: any;
    tomo_evm: any;
  }
}

const provider = new BtcProvider();

//window.mydoge.doge
window[TOMO_MYDOGE] = window[TOMO_MYDOGE] || {};
if (!window[TOMO_MYDOGE][DOGE]) {
  window[TOMO_MYDOGE][DOGE] = new Proxy(provider, {
    deleteProperty: () => true,
  });
}
Object.defineProperty(window[TOMO_MYDOGE], DOGE, {
  value: new Proxy(provider, {
    deleteProperty: () => true,
  }),
  writable: false,
});

// window.doge
if (!window[DOGE]) {
  window[DOGE] = new Proxy(provider, {
    deleteProperty: () => true,
  });
}
Object.defineProperty(window, DOGE, {
  value: new Proxy(provider, {
    deleteProperty: () => true,
  }),
  writable: false,
});

window.dispatchEvent(new Event("unisat#initialized"));
window.dispatchEvent(new Event("doge#initialized"));

// setup plugin communication
let providerEvm: any;
if (!window.Web3 && !window.ethereum) {
  providerEvm = setupEthereumProvider();
  window[TOMO_MYDOGE][EVM] = providerEvm;
  window.ethereum = providerEvm;
} else {
  const metamaskEthereum = window.ethereum;
  const metamaskWeb3 = window.Web3;
  providerEvm = setupEthereumProvider();
  window[TOMO_MYDOGE][EVM] = providerEvm;

  // restore tomo injected
  window.ethereum = metamaskEthereum;
  window.Web3 = metamaskWeb3;
}

function announceProvider(detail: any) {
  const event = new CustomEvent("eip6963:announceProvider", {
    detail: Object.freeze(detail),
  });

  window.dispatchEvent(event);

  const handler = () => window.dispatchEvent(event);
  window.addEventListener("eip6963:requestProvider", handler);
  return () => window.removeEventListener("eip6963:requestProvider", handler);
}

const icon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAuNDkwNzQ5IDIzLjU2NzNDLTAuNzE5NjYzIDE5LjQ1OTMgMC40MzU0MzkgMTUuMTcwOCAyLjU3MzA5IDExLjQ1QzMuMzIyNTEgMTAuMTQ2MSA0LjA1NzQyIDkuMTY2MTYgNC45NzU0NCA3Ljk3OTQ1QzUuODQ5NSA2Ljg0MDQxIDYuNzk2NzggNS43NTk0MSA3LjgxMTE4IDQuNzQzMzRDOC40MzI4NSA0LjEyNTYyIDkuMDQyNjMgMy40OTIxIDkuNzE2OTggMi45MzIzM0MxMC4yODQ3IDIuNDU5NSAxMS40MDU1IDEuNDE1MDQgMTIuMjE5NSAxLjg2MTUzQzEyLjc2MjEgMi4xNjA1MSAxMi44NzggMi44MDU4OSAxMi44MTQ4IDMuMzQ3MjJDMTIuNzQ4OSAzLjkzMDY5IDEyLjM5MzQgNC42NjQzMiAxMi45OTkyIDUuMDI5MTZDMTMuNDY0MiA1LjMxMTAxIDE0LjIwNTYgNC45OTg4NyAxNC41OTAyIDQuNjIwODZDMTUuNTEyMiAzLjcxNjAxIDIwLjUyNTEgLTAuODcxNDM2IDIxLjU3ODggMS4zNzQyMUMyMS43MjYzIDEuNjg3NjggMjEuNjE1NyAyLjA2MDQxIDIxLjQ2MjkgMi4zNzEyNUMyMS4xMTM4IDMuMDg1MTEgMjAuNjQ3NiA0LjA4MzQ3IDIxLjQ5MTkgNC42NzQ4NUMyMi4xMzk5IDUuMTMxODggMjIuODY5NiA0LjczMDE4IDIzLjUwNTcgNC40ODc4M0MyNC42MjUzIDQuMDYxMDkgMjUuODAwMSAzLjY0NjIgMjcgMy41NDA4M0MyNy42MTM3IDMuNDg2ODMgMjguNTE0NiAzLjQ3NjMgMjguNzgwNyA0LjE3NDM2QzI5LjEzNSA1LjA5NjMzIDI4LjM2MzEgNS44MDIyOSAyNy43OTQxIDYuNDEzNDNDMjcuNDc2NyA2Ljc1NDU1IDI2LjkzMDEgNy4xNzIwNyAyNi44NzIyIDcuNzc5MjVDMjYuNzc4NyA4Ljc0NzMyIDI4LjI2NTcgOC45NTU0MSAyOS4wMDQ2IDkuMDg4NDRDMjkuNDM4NSA5LjE0NzY2IDI5Ljg2NzkgOS4yMzU2NiAzMC4yOTAxIDkuMzUxODZDMzAuOTIyMyA5LjUyNDQgMzEuNzkyOSA5LjkyMzQ4IDMxLjgwNzQgMTAuNjg0OEMzMS44MjE4IDExLjUwOTMgMzAuODc0OCAxMS45MzIxIDMwLjM1ODUgMTIuMzAzNUMzMC4zNTg1IDEyLjMwMzUgMjcuNzM2MiAxMy42NDAzIDI3LjY2NzcgMTUuMTQ5N0MyNy42MTkgMTYuMjI3MSAyOC41NDg4IDE2Ljg3NjQgMjkuNDUxIDE3LjM5NjdDMzAuMDA0MiAxNy43MTY3IDMwLjY0NyAxNy44NDk4IDMxLjE5NDkgMTguMTg3QzMxLjU0MzkgMTguNDAxNiAzMS44OTY5IDE4LjgwNiAzMS44NTM1IDE5LjI0MDZDMzEuODA4NyAxOS43MDgyIDMxLjI4NDUgMjAuMDc0MyAzMC45MDEyIDIwLjI2NTNDMzAuNDY1MiAyMC40ODQgMjkuOTY4NyAyMC41Mjg3IDI5LjUwMzcgMjAuNjczNkMyOC45NTMyIDIwLjgzMyAyOC40MTk1IDIxLjA0NTcgMjcuOTEwMSAyMS4zMDg1QzI3LjQyMDEgMjEuNTY0IDI2Ljg3NjEgMjEuOTA1MSAyNi42MzY0IDIyLjQyOEMyNi4zNTE5IDIzLjA0ODMgMjYuNDQ0MSAyMy40NTI3IDI2LjcxODEgMjQuMDYxMkMyNi45OTIgMjQuNjY5NyAyNy42ODYyIDI1LjIxNjMgMjcuODk0MyAyNS44NzIyQzI4LjI4OTQgMjcuMTE2OSAyNy4wMDI2IDI3LjY3MjcgMjYuMDE0OCAyNy44ODg3QzI0LjM2MjggMjguMjYyMSAyMi43MzEgMjguNzE5OCAyMS4xMjU3IDI5LjI1OThDMTkuMjkzNiAyOS44NjcgMTcuNDgyNiAzMC43NTQ3IDE1LjUyMTUgMzEuMDI0N0MxNC4wNDY4IDMxLjIzMzkgMTIuNTU0NSAzMS4yODk2IDExLjA2ODQgMzEuMTkwNkM4LjIyMzQzIDMwLjk5MDQgNS4zMjU4MyAzMC4xMTE5IDMuMjE0NTMgMjguMTE3OEMxLjkyMTM4IDI2Ljg2NzYgMC45ODE3MDIgMjUuMjk3NyAwLjQ5MDc0OSAyMy41NjczWiIgZmlsbD0idXJsKCNwYWludDBfcmFkaWFsXzcyMDNfOTQyMzIpIi8+CjxwYXRoIGQ9Ik0xLjgxMTg1IDIwLjI5NTZDMS45NzM4NSAxOS4wOTg0IDIuNzAzNTQgMTcuODU2NCA0LjAwNjE1IDE3LjcyNzNDNS45ODE3OSAxNy41MzM3IDcuMjM5NiAxOC44ODkgOC41NjE5NiAxOS4zNzg5QzkuODQ2MTMgMTkuODU0NCAxMC41ODY0IDE5LjkwNTggMTEuOTQ5NiAxOS43MTA4QzE0LjE3NDEgMTkuMzkyMSAxNy45NzEzIDE4LjIzMTcgMTguNDI1NyAyMS4zNzNDMTguNzM3OSAyMy41MjkxIDE4LjI3OTYgMjUuMzQ5MyAxNi41MjI2IDI2LjkyNDZDMTQuNDc5NyAyOC43NTUzIDExLjMyNzkgMjkuMTk2NSA3Ljg0OTQ2IDI4LjM4MzlDNi4zMDk3NyAyOC4wMjQzIDQuNzcyNzIgMjcuMTEyOSAzLjYzNDc1IDI2LjAxMzFDMi4wODcxNiAyNC41MjM1IDEuNTExNTUgMjIuNDc4MSAxLjgxMTg1IDIwLjI5NTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNS4wOTAwNCAyMy4zNDc0QzUuNjMzNDEgMjMuMzQ3NCA2LjA3Mzk0IDIyLjc1NiA2LjA3Mzk0IDIyLjAyNjRDNi4wNzM5NCAyMS4yOTY4IDUuNjMzNDEgMjAuNzA1MyA1LjA5MDA0IDIwLjcwNTNDNC41NDY2NiAyMC43MDUzIDQuMTA2MiAyMS4yOTY4IDQuMTA2MiAyMi4wMjY0QzQuMTA2MiAyMi43NTYgNC41NDY2NiAyMy4zNDc0IDUuMDkwMDQgMjMuMzQ3NFoiIGZpbGw9IiMyMjFGMjAiLz4KPHBhdGggZD0iTTEyLjAyMDcgMjQuNjExOEMxMi42NzAzIDI0LjYxMTggMTMuMTk2OSAyMy45MDQyIDEzLjE5NjkgMjMuMDMxM0MxMy4xOTY5IDIyLjE1ODQgMTIuNjcwMyAyMS40NTA4IDEyLjAyMDcgMjEuNDUwOEMxMS4zNzExIDIxLjQ1MDggMTAuODQ0NSAyMi4xNTg0IDEwLjg0NDUgMjMuMDMxM0MxMC44NDQ1IDIzLjkwNDIgMTEuMzcxMSAyNC42MTE4IDEyLjAyMDcgMjQuNjExOFoiIGZpbGw9IiMyMjFGMjAiLz4KPHBhdGggZD0iTTYuNjU0OTIgMjQuODk2M0M3LjAzMDI2IDI0Ljg5NjMgNy4zMzQ1NiAyNC41ODQzIDcuMzM0NTYgMjQuMTk5NUM3LjMzNDU2IDIzLjgxNDcgNy4wMzAyNiAyMy41MDI4IDYuNjU0OTIgMjMuNTAyOEM2LjI3OTU4IDIzLjUwMjggNS45NzUzNCAyMy44MTQ3IDUuOTc1MzQgMjQuMTk5NUM1Ljk3NTM0IDI0LjU4NDMgNi4yNzk1OCAyNC44OTYzIDYuNjU0OTIgMjQuODk2M1oiIGZpbGw9IiMyMjFGMjAiLz4KPHBhdGggZD0iTTcuODQwMTggMjUuOTc3NkM3LjU2NjI4IDI1Ljk3ODYgNy4yOTQ2OSAyNS45MjgxIDcuMDM5NDQgMjUuODI4OEM2Ljk4MTA0IDI1LjgwMTkgNi45MzUxOSAyNS43NTM2IDYuOTExNDYgMjUuNjkzOEM2Ljg4NzczIDI1LjYzNDEgNi44ODc5MiAyNS41Njc1IDYuOTExOTcgMjUuNTA3OUM2LjkzNjAzIDI1LjQ0ODIgNi45ODIxMSAyNS40MDAyIDcuMDQwNjYgMjUuMzczNkM3LjA5OTIxIDI1LjM0NyA3LjE2NTc1IDI1LjM0NCA3LjIyNjQ2IDI1LjM2NTJDNy4yODA0NiAyNS4zODc2IDguNTI5MDYgMjUuODY3IDkuMTk0MTkgMjQuNjMwMkM5LjIyNzYxIDI0LjU3NTcgOS4yODA2NyAyNC41MzYgOS4zNDI0MyAyNC41MTk0QzkuNDA0MTkgMjQuNTAyNyA5LjQ2OTk4IDI0LjUxMDMgOS41MjYyOSAyNC41NDA3QzkuNTgyNjEgMjQuNTcxIDkuNjI1MTUgMjQuNjIxOCA5LjY0NTIxIDI0LjY4MjVDOS42NjUyNiAyNC43NDMzIDkuNjYxMjYgMjQuODA5NCA5LjYzNDA4IDI0Ljg2NzNDOS4xNzA0NiAyNS43MyA4LjQ0NzM2IDI1Ljk3NzYgNy44NDAxOCAyNS45Nzc2WiIgZmlsbD0iIzIyMUYyMCIvPgo8ZGVmcz4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDBfcmFkaWFsXzcyMDNfOTQyMzIiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUuOTI5OCAxNi4wMDU4KSBzY2FsZSgxOS44NDg3IDE5Ljg0ODYpIj4KPHN0b3Agb2Zmc2V0PSIwLjQ3IiBzdG9wLWNvbG9yPSIjRjIxRjdGIi8+CjxzdG9wIG9mZnNldD0iMC42IiBzdG9wLWNvbG9yPSIjRUIzRjlGIi8+CjxzdG9wIG9mZnNldD0iMC43MyIgc3RvcC1jb2xvcj0iI0U1NThCOSIvPgo8c3RvcCBvZmZzZXQ9IjAuODUiIHN0b3AtY29sb3I9IiNFMTY4QzkiLz4KPHN0b3Agb2Zmc2V0PSIwLjk0IiBzdG9wLWNvbG9yPSIjRTA2RENFIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==";

announceProvider({
  info: {
    icon: icon,
    name: "Tomo",
    rdns: "inc.tomo",
    uuid: guid(),
  },
  provider: providerEvm,
});

function setupEthereumProvider() {
  window.ethereum = null;
  const provider = initializeProvider({
    shouldShimWeb3: true,
  });
  return provider;
}
