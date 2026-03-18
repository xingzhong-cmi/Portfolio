import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-semibold">404</h1>
      <p className="mt-4 text-foreground/70">作品集不存在或尚未发布</p>
      <Link
        href="/"
        className="mt-8 rounded-xl border border-foreground/20 px-5 py-2.5 font-medium transition-colors hover:border-accent hover:text-accent"
      >
        返回首页
      </Link>
    </main>
  );
}
