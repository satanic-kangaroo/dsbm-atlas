// "/" -> language home. Static export has no server redirect, so: script (browser language) + meta refresh + visible links.
export default function Root() {
  const script = `(function(){try{var l=localStorage.getItem('dsbm-lang')||((navigator.language||'en').slice(0,2)==='fa'?'fa':'en');location.replace('/'+l+'/')}catch(e){location.replace('/en/')}})()`;
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <p><a href="/en/">DSBM Atlas (English)</a> · <a href="/fa/">اطلس DSBM (فارسی)</a></p>
    </main>
  );
}
