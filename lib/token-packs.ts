import type { TokenPack } from "@/types";

export const TOKEN_PACKS: TokenPack[] = [
  { id: "15", tokens: 15, price: 49, label: "Test Drive", scripts: "~1 full script" },
  { id: "100", tokens: 100, price: 199, label: "Value", scripts: "~7 full scripts", featured: true },
  { id: "500", tokens: 500, price: 749, label: "Creator", scripts: "~35 full scripts" },
];

export const getTokenPackById = (packId: TokenPack["id"]) =>
  TOKEN_PACKS.find((pack) => pack.id === packId);
