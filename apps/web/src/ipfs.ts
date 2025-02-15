import { PinataSDK } from "pinata-web3";
import { env } from "./env.mjs";

export const pinata = new PinataSDK({ pinataJwt: env.PINATA_API_JWT });
