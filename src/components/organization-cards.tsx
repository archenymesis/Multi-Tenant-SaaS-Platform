import { Card, CardDescription, CardTitle } from "./ui/card"
import { ArrowRight, Building } from "lucide-react"
import type { UserMembershipsProp } from "@/app/organizations/page";

export function OrganizationCards({ userMemberships, onSelectOrg }: { userMemberships: UserMembershipsProp, onSelectOrg: (organization: any) => Promise<void>}) {
    return (
        <div>
            {userMemberships ?  (userMemberships.data?.map((membership) => (
                <div key={membership.organization.id} onClick={() => onSelectOrg(membership.organization)} className="cursor-pointer">
                    <Card className="mt-6 p-6">
                        <div className="flex justify-between items-center">
                            <div className="flex">
                                <div className="bg-emerald-100 rounded p-3">
                                    <Building size={35} color="#00ff40" />
                                </div>
                                <div className="flex flex-col justify-between  ml-4">
                                    <CardTitle className="font-extrabold text-xl">{membership.organization.name}</CardTitle>
                                    <div className="flex">
                                        <CardDescription className="bg-gray-700 rounded px-2 py-0.5 mr-3">
                                            <div>Org:{membership.role}</div>
                                        </CardDescription>
                                        <CardDescription>&#9679;</CardDescription>
                                        <CardDescription className="ml-3">ID: {membership.organization.id.substring(0, 8)}...</CardDescription>
                                    </div>
                                </div>
                            </div>
                                <div>
                                    <CardDescription>
                                        <ArrowRight />
                                    </CardDescription>
                                </div>
                        </div>
                    </Card>
                </div>
            ))) : (
                    <div className="text-center py-12">
                        <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <CardDescription className="mb-2 text-gray-500">No documents uploaded yet</CardDescription>
                        <CardDescription>Create your first organization to get started</CardDescription>
                    </div>
            )}
        </div>
    )
}