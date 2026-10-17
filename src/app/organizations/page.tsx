'use client'

import { Header } from "@/components/header"
import { Organization, OrganizationCards } from "@/components/organization-cards"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RedirectToSignIn, useAuth, useUser } from "@clerk/nextjs"
import { Building, Plus } from "lucide-react"

const organizations: Organization[] = [
    {
        id: "org_39Uo...",
        title: "AI Engineering",
        role: "Admin"
    },
    {
        id: "org_39Uo...",
        title: "Finance",
        role: "Admin"
    },
    {
        id: "org_3AMS...",
        title: "Sales",
        role: "Admin"
    }
]


export default function Organizations() {
    const { isLoaded, isSignedIn } = useAuth()
    const { user } = useUser()
    if (!isLoaded) return <div>Loading...</div>
    if (!isSignedIn) return <RedirectToSignIn />
    
    return (
        <div className="relative z-20">
            <Header />
            <div className="flex flex-col items-center">

                <div className="text-center mb-10 mt-14">
                    <h1 className="font-bold text-4xl mb-1">Welcome, {user?.firstName}!</h1>
                    <p>Select or create an organization</p>
                </div>

                <div className="w-3xl">
                    <Card className="flex gap-0 p-6">

                        <div className="flex flex-col mb-8">
                            <div className="flex items-center">
                                <Plus />
                                <CardTitle className="ml-2">Create New Organization</CardTitle>
                            </div>
                            <CardDescription>Start a new workspace for your team</CardDescription>
                        </div>

                        <div className="flex gap-2">
                            <Input placeholder="Enter organization name" />
                            <Button>Create</Button>
                        </div>
                    </Card>
                </div>

                <div className="w-3xl mt-8">
                    <Card className="gap-0 p-6">
                        <div>
                            <div className="flex items-center mb-2">
                                <Building />
                                <CardTitle className="font-bold ml-1">Your Organizations</CardTitle>
                                <CardTitle className="font-bold ml-1">(3)</CardTitle>
                            </div>
                            <div>
                                <CardDescription>Click on an organization to enter</CardDescription>
                            </div>
                        </div>
                        <OrganizationCards organizations={organizations} />
                    </Card>
                </div>
            </div>
        </div>
    )
}