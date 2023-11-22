type YouTubeVideoProps = {
  srcUrl: string;
};

export default function YouTubeVideo({ srcUrl }: YouTubeVideoProps) {
  return (
    <iframe
      width="560"
      height="315"
      src={srcUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
}
