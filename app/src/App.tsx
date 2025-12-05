import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dummy")
      .then((r) => r.text())
      .then((r) => setData(r));
  }, []);

  return <div>{data ?? <div>No data</div>}</div>;
}
