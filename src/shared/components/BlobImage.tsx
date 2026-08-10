import { useEffect, useState } from 'react';

interface BlobImageProps {
  blob: Blob;
  alt: string;
  className?: string;
}

export function BlobImage({ blob, alt, className }: BlobImageProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  if (!url) return null;
  return <img src={url} alt={alt} className={className} loading="lazy" />;
}
