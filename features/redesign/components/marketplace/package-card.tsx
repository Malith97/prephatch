import Link from "next/link";
import type { PackageItem } from "../../types";
import { Card } from "../ui/card";

export function PackageCard({ item }: { item: PackageItem }) {
  return (
    <Card title={item.title} description={item.provider} className="h-full">
      <p className="phx-body-sm mb-4">{item.description}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span key={tag} className="phx-chip">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="phx-heading-sm">{item.price}</span>
        <Link href={`/dashboard/marketplace/${item.slug}`} className="phx-inline-link">
          View package
        </Link>
      </div>
    </Card>
  );
}
