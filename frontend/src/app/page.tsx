import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Artist Portfolio Platform
        </p>
        <h1 className="mt-4 max-w-3xl text-6xl font-semibold leading-tight md:text-7xl">
          三步创建你的<br />在线作品集
        </h1>
        <p className="mt-6 max-w-lg text-lg text-foreground/60">
          上传作品、选择模板、一键发布。无需写代码，即刻获得专属链接。
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/register"
            className="rounded-xl bg-accent px-7 py-3 text-lg font-medium text-white transition-opacity hover:opacity-90"
          >
            免费开始
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-foreground/20 px-7 py-3 text-lg font-medium transition-colors hover:border-accent hover:text-accent"
          >
            登录
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-foreground/10 bg-white/30 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-4xl font-semibold">如何使用</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {[
              { step: "01", title: "上传作品", desc: "拖拽上传你的图片，支持批量上传与排序" },
              { step: "02", title: "选择模板", desc: "四套精心设计的模板，实时预览效果" },
              { step: "03", title: "发布分享", desc: "一键发布，获得专属链接，即刻分享" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="text-5xl font-semibold text-accent/30">{item.step}</span>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-foreground/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates showcase */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-semibold">四套风格模板</h2>
          <p className="mt-4 text-foreground/60">从简约到赛博朋克，找到最适合你的表达方式</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Minimal", desc: "简洁白底网格", color: "bg-neutral-50" },
              { name: "Dark", desc: "深色沉浸大图", color: "bg-neutral-900" },
              { name: "Magazine", desc: "杂志风错落排版", color: "bg-amber-50" },
              { name: "Cyber", desc: "赛博朋克动效", color: "bg-black" },
            ].map((tpl) => (
              <div
                key={tpl.name}
                className="overflow-hidden rounded-2xl border border-foreground/10"
              >
                <div className={`${tpl.color} h-32`} />
                <div className="p-4 text-left">
                  <p className="font-semibold">{tpl.name}</p>
                  <p className="mt-1 text-xs text-foreground/60">{tpl.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-foreground/10 bg-white/30 px-6 py-20 text-center">
        <h2 className="text-4xl font-semibold">准备好了吗？</h2>
        <p className="mt-4 text-foreground/60">免费创建你的作品集，只需 3 分钟</p>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-xl bg-accent px-8 py-3 text-lg font-medium text-white transition-opacity hover:opacity-90"
        >
          立即开始 →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10 px-6 py-8 text-center text-sm text-foreground/40">
        © {new Date().getFullYear()} Folio. All rights reserved.
      </footer>
    </main>
  );
}
