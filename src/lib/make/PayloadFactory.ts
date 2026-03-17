import { format } from "date-fns";

export abstract class PayloadFactory<T> {
  protected abstract payloadCategory: string;
  protected nestedFactories?: Record<string, any>;

  create(data: Record<string, any> = {}): T {
    const result: any = {
      payloadCategory: this.payloadCategory,
      eventDate: format(new Date(), "MM/dd/yyyy"),
    };

    Object.keys(this.nestedFactories ?? {}).forEach((key) => {
      const nested = this.nestedFactories![key].create(data);
      if (Object.keys(nested).length > 0) {
        result[key] = nested;
      }
    });

    return result;
  }
}
