type OptionItem = {
  key: string;
  value: string;
};

export function getServiceDefaultCVlanOptions(): OptionItem[] {
  return Object.entries(window.__GAMMA_FORM_OPTIONS__.service.default_cvlan).map(([key, value]) => ({
    key,
    value: String(value),
  }));
}

export function getServiceVpnTopologyOptions(): OptionItem[] {
  return Object.entries(window.__GAMMA_FORM_OPTIONS__.service.vpn_topology).map(([key, value]) => ({
    key,
    value,
  }));
}

export function getServiceExtranetVpnsOptions(): OptionItem[] {
  return Object.entries(window.__GAMMA_FORM_OPTIONS__.service.extranet_vpns).map(([key, value]) => ({
    key,
    value,
  }));
}
