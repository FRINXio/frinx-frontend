declare module 'feather-icons-react';
declare module 'diff-arrays-of-objects' {
  function diff<T>(
    first: T[],
    second: T[],
    idField?: string,
  ): {
    same: T[];
    added: T[];
    updated: T[];
    removed: T[];
  };
  export default diff;
}

type Options = Record<string, string>;

declare interface Window {
  __GAMMA_FORM_OPTIONS__: Readonly<{
    service: {
      vpn_topology: Options;
      default_cvlan: Options;
      extranet_vpns: Options;
    };
    site: {
      site_management: Options;
      location: Options;
      maximum_routes: Options;
    };
    site_network_access: {
      site_role: Options;
      requested_cvlan: Options;
      bandwidths: Options;
    };
    bearer: {
      service_type: Options;
      service_status: Options;
      encapsulation_type: Options;
      'svlan-assignment-type': Options;
      tpid: Options;
      evc_type: Options;
    };
  }>;
}
