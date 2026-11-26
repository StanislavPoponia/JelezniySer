import Image from "next/image";
import { MotoPlaceholder } from "@/components/ui/MotoPlaceholder";

type ProductPhotoProps = {
  imageUrl: string | null;
  placeholderLabel: string;
  className?: string;
};

// Фото товару, а якщо його немає — намальований кросовий мотоцикл.
export function ProductPhoto({ imageUrl, placeholderLabel, className }: ProductPhotoProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative block aspect-square overflow-hidden rounded-md bg-black ${className ?? ""}`}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt="" fill unoptimized className="object-contain" />
      ) : (
        <MotoPlaceholder label={placeholderLabel} className="h-full w-full" />
      )}
    </span>
  );
}
