export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="container">{children}</div>
    </>
  )
}
