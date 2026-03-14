import type { TokenPack } from "@/types";

export const TOKEN_PACKS: TokenPack[] = [
  { id: "30", tokens: 30, price: 149, label: "Starter", scripts: "~2 full scripts" },
  { id: "100", tokens: 100, price: 399, label: "Value", scripts: "~7 full scripts", featured: true },
  { id: "300", tokens: 300, price: 999, label: "Creator", scripts: "~22 full scripts" },
];

export const getTokenPackById = (packId: TokenPack["id"]) =>
  TOKEN_PACKS.find((pack) => pack.id === packId);
