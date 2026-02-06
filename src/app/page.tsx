import Menu from "@/components/Menu";
import Cart from "@/components/Cart";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">
      <Menu />
      <div className="space-y-6">
        <Cart />
      </div>
    </main>
  );
}
