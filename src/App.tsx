import { useEffect, useState } from 'react'

export default function App() {
  const [data, setData] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dummy')
      .then((r) => r.text())
      .then((r) => setData(r))
  }, [])

  return <>{data ? <div dangerouslySetInnerHTML={{ __html: data }}></div> : <div>vite app</div>}</>
}
