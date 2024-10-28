import InventoryManager from "@/components/InventoryManager"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fridgify</h1>
      <InventoryManager />
    </main>
  )
}
