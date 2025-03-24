import { PinataSDK } from "pinata-web3";
import { env } from "./env.mjs";

export const pinata = new PinataSDK({ pinataJwt: env.NEXT_PUBLIC_PINATA_API_JWT });
