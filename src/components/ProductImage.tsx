import Image from "next/image";
import { Icon } from "@/components/Icon";

type Props = {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
};

/** Foto do lanche com placeholder quando o estabelecimento ainda não subiu a imagem. */
export function ProductImage({ src, alt, sizes, priority }: Props) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-surface-2 to-ink">
        <Icon name="image" className="h-7 w-7 text-line" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-500 group-active:scale-105"
    />
  );
}
