export const provider = new BtcProvider();

export function init(wallletInfo) {
  window.dispatchEvent(new Event("unisat#initialized"));
  window.dispatchEvent(new Event("doge#initialized"));
}
