import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FACEIT Insights",
    short_name: "FACEIT Insights",
    description: "Visualize your CS2 match story. Analyze momentum, player impact, and earn badges.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#f97316",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
