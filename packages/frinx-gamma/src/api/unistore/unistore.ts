import {sendDeleteRequest, sendGetRequest, sendPutRequest} from './api-helpers';
import { decodeVpnServicesOutput, VpnServicesOutput } from './network-types';
import {VpnService} from "../../components/forms/service-types";

const UNICONFIG_SERVICE_URL = "/data/network-topology:network-topology/topology=uniconfig/node=service/frinx-uniconfig-topology:configuration"

export async function getVpnServices(): Promise<VpnServicesOutput> {
  const json = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services`);
  const data = decodeVpnServicesOutput(json);
  return data;
}

export async function putVpnServices(body: VpnService): Promise<unknown> {
    let extranetVpns = {};
    if (body.extranetVpns.length > 0) {
        extranetVpns = {
            "extranet-vpn": body.extranetVpns.map((vpn) => {
                return {
                    "vpn-id": vpn,
                    "local-sites-role": "spoke-role"
                }
            })
        }
    }
  const jsonBody = {
    "vpn-service": [{
        "vpn-id": body.vpnId,
        "customer-name": body.customerName,
        "vpn-service-topology": body.vpnServiceTopology,
        "default-c-vlan": body.defaultCVlan,
        "extranet-vpns": extranetVpns
    }]
  }
  const json = await sendPutRequest(
      `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service=${body.vpnId}`, jsonBody);
  return json;
}

export async function deleteVpnServices(body: VpnService): Promise<unknown> {
    const json = await sendDeleteRequest(
        `${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service=${body.vpnId}`);
    return json;
}
