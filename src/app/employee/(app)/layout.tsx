import { BottomNav } from "@/components/employee/bottom-nav"

export default function EmployeeAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="relative mx-auto flex min-h-dvh max-w-[430px] flex-col bg-gray-50">
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
