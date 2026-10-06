import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Button } from "./ui/button"

export function Header({ children }: { children?: React.ReactNode }){
  return(
    <header className="header sticky top-0 z-50 w-full border-b backdrop-blur px-32">
      <div className="container h-14 flex items-center justify-between">
        <p className="font-black text-xl">Multi-Tenant</p>
        <div className="space-x-2 flex flex-row items-center">
          {children}
        <Show when="signed-out">
          <SignInButton>
            <Button className="px-4 py-2 rounded-md cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 text-base">
              Sign In
            </Button>
           </SignInButton>
           <SignUpButton>
           <Button className="px-4 py-2 rounded-md cursor-pointer ml-2 text-base">
              Sign Up
           </Button>
           </SignUpButton>
        </Show>
        <Show when="signed-in">
           <UserButton />
        </Show>
        </div>
      </div>
    </header>
  )
}