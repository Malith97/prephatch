import type { PackageItem } from "../../types";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Tooltip } from "../ui/tooltip";

export async function PackageDetail({ packagePromise }: { packagePromise: Promise<PackageItem> }) {
  const item = await packagePromise;

  return (
    <article className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card title={item.title} description={item.provider}>
        <p className="phx-body-md mb-4">{item.description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="phx-chip">{tag}</span>
          ))}
        </div>
        <h3 className="phx-heading-sm mb-2">Includes</h3>
        <ul className="space-y-1">
          <li className="phx-body-sm">- Full-length mock exams</li>
          <li className="phx-body-sm">- Section-level analytics</li>
          <li className="phx-body-sm">- Topic-wise recommendations</li>
        </ul>
      </Card>

      <Card>
        <p className="phx-label">Price</p>
        <p className="phx-heading-xl mt-1">{item.price}</p>
        <div className="mt-4 space-y-2">
          <Tooltip label="Secure checkout with full order summary before payment.">
            <Button className="w-full">Buy Package</Button>
          </Tooltip>
          <Button variant="secondary" className="w-full">Add to Wishlist</Button>
        </div>
      </Card>
    </article>
  );
}
