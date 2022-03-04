export type Status = {
  status: string | null;
  lastUpdated: string | null;
};

export type BearerStatus = {
  adminStatus: Status | null;
  operStatus: Status | null;
};

export type Carrier = {
  carrierName: string | null;
  carrierReference: string | null;
  serviceType: string | null;
  serviceStatus: string | null;
};

export type Connection = {
  encapsulationType: string | null;
  svlanAssignmentType: string | null;
  tpId: string | null;
  mtu: number;
  remoteNeId: string | null;
  remotePortId: string | null;
};

export type EvcAttachment = {
  evcType: string;
  customerName: string | null;
  circuitReference: string;
  carrierReference: string | null;
  svlanId: number | null;
  status: BearerStatus | null;
  inputBandwidth: number;
  qosInputProfile: string | null;
  upstreamBearer: string | null;
};

export type VpnBearer = {
  spBearerReference: string;
  description: string | null;
  neId: string;
  portId: string;
  status: BearerStatus | null;
  carrier: Carrier | null;
  connection: Connection | null;
  defaultUpstreamBearer: string | null;
  evcAttachments: EvcAttachment[];
};

export type VpnNode = {
  neId: string;
  routerId: string;
  role: string | null;
};

export type VpnCarrier = {
  name: string;
  description: string | null;
};
