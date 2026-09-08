import NextImage, {
  ImageProps as NextImageProps,
} from "next/image";

interface ImageProps extends NextImageProps {
  alt: string;
  className?: string;
}

function Image({
  alt,
  className = "",
  ...props
}: ImageProps) {
  return (
    <NextImage
      alt={alt}
      className={`
        object-cover
        ${className}
      `}
      {...props}
    />
  );
}

export default Image;