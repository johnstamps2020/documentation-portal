import { Link, useParams } from "react-router-dom";
import { useLocaleParams } from "../../hooks/useLocale";

export default function LandingPage() {
  const { lang, placeholder } = useLocaleParams();
  const params = useParams();
  const pagePath = params["*"];

  return (
    <div>
      <Link to="/">home</Link>
      <h1>Welcome to Guidewire, we hope you can have fun here.</h1>
      <p>Selected path: {pagePath}</p>
      <p>lang: {lang}</p>
      <p>placeholder: {placeholder}</p>
    </div>
  );
}
