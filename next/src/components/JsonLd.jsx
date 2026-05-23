// ─── JsonLd — Server Component — Faz 7.2 ────────────────────────────────────
// Schema.org JSON-LD'yi <script type="application/ld+json"> tag'leri olarak
// inject eder. Server component (no 'use client'), HTML çıktısında doğrudan
// görünür → Google crawler hemen okuyabilir.
//
// Kullanım (page.js'te):
//   <JsonLd schemas={[buildBreadcrumb(...), buildArticle(...)]} />

export default function JsonLd({ schemas }) {
  if (!schemas) return null;
  const list = Array.isArray(schemas) ? schemas : [schemas];
  return (
    <>
      {list.filter(Boolean).map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
