import Image from "next/image";
import type { CollectionItem } from "@/types/collection";

type CollectionCardProps = {
  item: CollectionItem;
  onSelect: () => void;
};

// Картка колекції: обкладинка (для відео — перший кадр зі значком) і назва.
export function CollectionCard({ item, onSelect }: CollectionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex h-full w-full min-w-0 flex-col gap-3 rounded-lg border border-line bg-surface p-3 text-left transition hover:-translate-y-0.5 hover:border-foreground focus-visible:-translate-y-0.5 focus-visible:border-foreground motion-reduce:transform-none motion-reduce:transition-none"
    >
      <span className="relative block aspect-4/3 overflow-hidden rounded-md bg-black">
        {item.mediaType === "image" ? (
          <Image src={item.mediaUrl} alt="" fill unoptimized className="object-cover" />
        ) : (
          <>
            {/* #t=0.1 — щоб і на телефоні було видно кадр, а не чорний прямокутник. */}
            <video
              src={`${item.mediaUrl}#t=0.1`}
              preload="metadata"
              muted
              playsInline
              aria-hidden="true"
              className="pointer-events-none h-full w-full object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-black/70"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6">
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
            </span>
          </>
        )}
      </span>
      <span className="line-clamp-2 min-h-[2.6em] whitespace-normal break-words font-semibold leading-[1.3]">
        {item.title}
      </span>
    </button>
  );
}
