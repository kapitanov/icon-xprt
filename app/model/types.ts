import type { IconifyInfo, IconifyJSON } from "@iconify/types";
import * as orama from "@orama/orama";
import { pluginQPS } from "@orama/plugin-qps";
import { stemmer, language } from "@orama/stemmers/english";

export class Icon {
  constructor(
    public iconSetId: string,
    public id: string,
    public name: string
  ) {}
}

export class IconSearchHit {
  constructor(public icon: Icon, public score: number) {}
}

export class IconSet implements IconSet {
  id: string;
  info: IconifyInfo;
  icons: Icon[];
  db: Promise<orama.AnyOrama>;
  byId: Map<string, Icon>;

  constructor(id: string, info: IconifyInfo, data: IconifyJSON) {
    this.id = id;
    this.info = info;

    this.icons = Object.keys(data.icons).map(
      (key) => new Icon(id, `${data.prefix}:${key}`, key)
    );

    this.byId = new Map<string, Icon>();
    for (const icon of this.icons) {
      this.byId.set(icon.id, icon);
      this.byId.set(icon.name, icon);
    }

    this.db = this.initSearchIndex(id, data);
  }

  public getIcon(id: string): Icon | undefined {
    return this.byId.get(id);
  }

  public getIcons(): Icon[] {
    return this.icons;
  }

  public async searchIcons(query: string): Promise<IconSearchHit[]> {
    const db = await this.db;
    const results = await orama.search(db, {
      term: query,
      mode: "fulltext",
      limit: 100,
    });
    const hits = results.hits.map((result: { id: string; score: number }) => {
      return new IconSearchHit(this.getIcon(result.id)!, result.score);
    });
    return hits;
  }

  private async initSearchIndex(id: string, data: IconifyJSON) {
    const startTime = performance.now();
    const db = orama.create({
      schema: {
        id: "string",
        names: "string[]",
        keywords: "string[]",
        categories: "string[]",
      },
      plugins: [pluginQPS()],
      components: {
        tokenizer: {
          stemming: true,
          language,
          stemmer,
        },
      },
    });

    for (const document of generateDocuments(id, data)) {
      await orama.insert(db, document);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(
      `Search index for "${id}" generated in ${duration.toFixed(2)}ms`
    );

    return db;
  }
}

function getIconKeywords(name: string): string[] {
  return name
    .split(/[-_ ]/)
    .map((part) => part.toLowerCase())
    .filter((part) => part.length > 0);
}

interface Document {
  id: string;
  names: string[];
  keywords: string[];
  categories: string[];
}

function* generateDocuments(
  iconSetId: string,
  icons: IconifyJSON
): Generator<Document> {
  const iconNames = Object.keys(icons.icons || {});

  for (const iconName of iconNames) {
    const id = `${iconSetId}:${iconName}`;

    const names = [iconName];
    if (icons.aliases) {
      const aliasList = Object.keys(icons.aliases).filter(
        (alias) => icons.aliases![alias]?.parent === iconName
      );
      names.push(...aliasList);
    }

    const categories = icons.categories
      ? Object.keys(icons.categories).filter((cat) =>
          icons.categories![cat]?.includes(iconName)
        )
      : [];

    const keywords = getIconKeywords(iconName);

    yield { id, names, keywords, categories };
  }
}
