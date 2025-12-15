import { useEffect, useState } from 'react'

export default function App() {
  const [data, setData] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dummy')
      .then((r) => r.text())
      .then((r) => setData(r))
  }, [])

  return (
    <div>
      <h1>THIS IS THE APP</h1>

      <div>{data ? <div dangerouslySetInnerHTML={{ __html: data }}></div> : <div>vite app</div>}</div>
    </div>
  )
}
