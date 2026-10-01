import { Header } from "@/components/header"
import { syncUser } from "@/lib/actions/users"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await currentUser()

  await syncUser()

  if(user) redirect("/organizations")
  
  return (
    <>
      <div className="w-screen min-h-screen fixed z-0 flex justify-center px-6 py-40 pointer-events-none"></div>
      <div>
        <div className="relative z-20">
          <Header/>
          <main className="container mx-auto">
            
          </main>
        </div>
      </div>
    </>
  )
}