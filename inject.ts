import { walletInfo, btc } from "./config";

import { provider, init } from "./btc";

//btc
injectProvider({
  wallletInfo,
  btc,
  provider,
  init,
});

function injectProvider({ wallletInfo, btc, provider, init }: any) {
  let { namespaces } = btc;
  for (let namespace of namespaces) {
    let keys = namespace.split(".");
    let _window = window;
    for (let key of keys) {
      _window = _window[key] || {};
    }

    _window = new Proxy(provider, {
      deleteProperty: () => true,
    });

    init(wallletInfo);
  }
}
