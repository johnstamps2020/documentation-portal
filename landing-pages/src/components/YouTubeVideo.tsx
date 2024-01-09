type YouTubeVideoProps = {
  srcUrl: string;
};

export default function YouTubeVideo({ srcUrl }: YouTubeVideoProps) {
  return (
    <iframe
      width="351"
      height="207"
      src={srcUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
}
