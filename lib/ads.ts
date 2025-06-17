// Prebid configuration placeholder
export const prebidConfig = {
  adUnits: [
    {
      code: 'banner-top',
      mediaTypes: {
        banner: { sizes: [[728,90], [300,250]] }
      },
      bids: [] // TODO add bidder configs
    }
  ]
};

export function loadAds() {
  // TODO: integrate Prebid.js and GAM
}
