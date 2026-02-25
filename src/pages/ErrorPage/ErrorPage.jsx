// ErrorPage.jsx
import { useTheme } from "@/context/ThemeContext";
import icon from "@/assets/icon/Lonely 404.json";

export default function ErrorPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
      <lottie-player
        src={icon}
        autoplay
        loop
        style={{
          width: 220,
          height: 220,
        }}
      ></lottie-player>

      <h1 className="mt-6 text-2xl font-semibold text-foreground">Oops! Page not found</h1>
      <p className="mt-2 text-muted-foreground max-w-md">
        Sorry... the page you're looking for doesn't exist or has been moved.
      </p>
    </div>
  );
}