export abstract class SharedTypeFactory<T> {
  protected abstract keyMapping: Partial<Record<keyof T, string | string[]>>;

  create(data: Record<string, any> = {}): Partial<T> {
    const result: any = {};

    Object.entries(this.keyMapping).forEach(([key, mappings]) => {
      const keys = Array.isArray(mappings) ? mappings : [mappings as string];
      for (const mappedKey of keys) {
        const val = mappedKey.split(".").reduce((obj: any, k: string) => obj?.[k], data);
        if (val !== undefined && val !== "") {
          result[key] = val;
          break;
        }
      }
    });

    return result;
  }
}
