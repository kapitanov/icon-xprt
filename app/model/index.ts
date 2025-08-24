import { IconSet, IconSearchHit, Icon } from "./types";
export { IconSet, IconSearchHit, Icon } from "./types";

import { default as simpleIcons } from "./iconsets/simple-icons";
import { default as lucide } from "./iconsets/lucide";
import { default as fa6Solid } from "./iconsets/fa6-solid";
import { default as fa6Regular } from "./iconsets/fa6-regular";
import { default as fa6Brands } from "./iconsets/fa6-brands";

export const iconSets = [simpleIcons, lucide, fa6Solid, fa6Regular, fa6Brands];

const iconsSetsById = new Map<string, IconSet>();
const iconsById = new Map<string, Icon>();
iconSets.forEach((iconSet) => {
  iconsSetsById.set(iconSet.id, iconSet);

  iconSet.getIcons().forEach((icon) => {
    iconsById.set(icon.id, icon);
  });
});

export function getIconSetById(id: string): IconSet | undefined {
  return iconsSetsById.get(id);
}

export function getIconById(id: string): Icon | undefined {
  return iconsById.get(id);
}

export interface SearchQuery {
  query: string;
  iconSets?: IconSet[];
}

export async function searchIcons(q: SearchQuery): Promise<IconSearchHit[]> {
  const startTime = performance.now();

  const results: IconSearchHit[] = [];
  for (const iconSet of q.iconSets || iconSets) {
    const hits = await iconSet.searchIcons(q.query);
    results.push(...hits);
  }
  results.sort((a, b) => b.score - a.score).slice(0, 100);

  const endTime = performance.now();
  const duration = endTime - startTime;
  console.log(`Search for "${q.query}" completed in ${duration.toFixed(2)}ms`);
  return results;
}
