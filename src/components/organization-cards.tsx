import { Card, CardDescription, CardTitle } from "./ui/card"
import { ArrowRight, Building } from "lucide-react"

export type Organization = {
    id: string;
    title: string;
    role: string;
}

export function OrganizationCards({ organizations }: {
    organizations: Organization[]
}) {
    return (
        <div>
            {organizations.map((organization, index) => (
                <div key={index}>
                    <Card className="mt-6 p-6">
                        <div className="flex justify-between items-center">
                            <div className="flex">
                                <div className="bg-emerald-100 rounded p-3">
                                    <Building size={35} color="#00ff40" />
                                </div>
                                <div className="flex flex-col justify-between  ml-4">
                                    <CardTitle className="font-extrabold text-xl">{organization.title}</CardTitle>
                                    <div className="flex">
                                        <CardDescription className="bg-gray-700 rounded px-2 py-0.5 mr-3">
                                            <div>Org:{organization.role}</div>
                                        </CardDescription>
                                        <CardDescription>&#9679;</CardDescription>
                                        <CardDescription className="ml-3">ID: {organization.id}</CardDescription>
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
            ))}
        </div>
    )
}