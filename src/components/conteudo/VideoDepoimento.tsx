import { idDoYoutube } from '@/lib/video';

export function VideoDepoimento({ url }: { url: string }) {
  const id = idDoYoutube(url);

  if (id) {
    return (
      <div className="relative mt-4 aspect-video overflow-hidden rounded-[var(--raio-m)]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title="Depoimento em vídeo"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--dourado)] hover:text-[var(--amarelo-seta)]"
    >
      <span aria-hidden="true">▶</span> Ver depoimento em vídeo
    </a>
  );
}
