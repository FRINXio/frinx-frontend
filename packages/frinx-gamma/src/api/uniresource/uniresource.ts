// import {sendGetRequest} from "../unistore/api-helpers";

export async function generateVpnId(): Promise<string> {
    const randomNumber = Math.floor(Math.random() * 1000)
    return `VPN_${randomNumber}`;
}