'use client'

import { Header } from "@/components/header"
import { OrganizationCards } from "@/components/organization-cards"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RedirectToSignIn, useAuth, useOrganizationList, useUser } from "@clerk/nextjs"
import { Building, Loader2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "sonner"

export type UserMembershipsProp = ReturnType<typeof useOrganizationList<{
  userMemberships: { infinite: true }
}>>['userMemberships'];

export default function Organizations() {
    const { isLoaded: isAuthLoaded, isSignedIn } = useAuth()
    const { user } = useUser()
    

    const { isLoaded: isOrgLoaded, userMemberships, setActive, createOrganization } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    })

    const router = useRouter()
    const [orgName, setOrgName] = React.useState("")
    const [isCreating, setIsCreating] = React.useState(false)
    const [isRefreshing, setIsRefreshing] = React.useState(false)

    if (!isAuthLoaded) return <div>Loading...</div>
    if (!isSignedIn) return <RedirectToSignIn />

    const refreshOrganizations = async () => {
        setIsRefreshing(true)
        try {
            if (userMemberships?.revalidate) {
                await userMemberships.revalidate()
            }
            toast.success("Organization list refreshed")
        } catch (error) {
            console.error("Failed to refresh organizations: ", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleCreateOrg = async () => {
        if (!orgName.trim()) {
            toast.error("Please enter an organization name")
            return
        }

        setIsCreating(true)
        try {
            if (!createOrganization) {
                throw new Error("Organization creation is not available at this time.")
            }
            const newOrg = await createOrganization({
                name: orgName.trim()
            })

            if (!newOrg) {
                throw new Error("Failed to create organization")
            }

            toast.success(`Organization ${orgName} creaated successfully`)
            setOrgName("")

            try {
                const response = await fetch("/api/orgs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        clerkOrgId: newOrg.id,
                        name: orgName.trim(),
                        slug: newOrg.slug || orgName.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
                    })
                })

                if (!response.ok) {
                    console.warn("Database sync had issues, but organization was created in Clerk")
                }
            } catch (dbError) {
                console.warn("Database sync failed: ", dbError)
            }

            if (setActive) {
                await setActive({
                    organization: newOrg.id,
                })
            }

            await new Promise((resolve) => setTimeout(resolve, 500))

            refreshOrganizations()

            router.refresh()
        } catch (error: any) {
            console.error("Failed to create organization", error)
            toast.error(error.message || "Failed to create organization")
        } finally {
            setIsCreating(false)
        }
    }

    const handleSelectOrg = async (organization: any) => {
        try {
            if (setActive) {
                await setActive({
                    organization: organization.id,
                })
            }
            router.push(`organizations/${organization.slug}`)
        } catch (error) {
            console.error("Failed to switch organization: ", error)
            toast.error("Failed to switch organization")
        }
    }

    console.log("Current organization list: ", {
        isOrgLoaded,
        count: userMemberships?.count,
        data: userMemberships?.data?.map((org) => org.organization.name)
    })

    
    
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
                            <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={isCreating} placeholder="Enter organization name" />
                            <Button onClick={handleCreateOrg} disabled={isCreating || !orgName.trim()}>
                                {isCreating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create"
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="w-3xl mt-8">
                    <Card className="gap-0 p-6">
                        <div>
                            <div className="flex items-center mb-2">
                                <Building />
                                <CardTitle className="font-bold ml-1">Your Organizations</CardTitle>
                                <CardTitle className="font-bold ml-1">({userMemberships?.count || 0})</CardTitle>
                            </div>
                            <div>
                                <CardDescription>Click on an organization to enter</CardDescription>
                            </div>
                        </div>
                        <OrganizationCards userMemberships={userMemberships} onSelectOrg={handleSelectOrg} />
                    </Card>
                </div>
            </div>
        </div>
    )
}