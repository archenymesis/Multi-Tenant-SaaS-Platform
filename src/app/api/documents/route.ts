import { uploadToBlob } from "@/lib/blob";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await request.formData()
            const name = formData.get("name") as string
            const content = formData.get("content") as string
            const clerkOrgId = formData.get("organizationId") as string
            const file = formData.get("file") as File

            console.log("API Input:", {
                name,
                clerkOrgId,
                file: file?.name,
                fileSize: file?.size
            })

            if (!name || !clerkOrgId) {
                return NextResponse.json(
                    { error: "Name and organization ID are required" },
                    { status: 400 }
                )
            }

            const organization = await prisma.organization.findUnique({
                where: { clerkOrgId: clerkOrgId }
            })

            console.log("found organizations:", {
                found: !!organization,
                clerkId: clerkOrgId,
                dbId: organization?.id,
                name: organization?.organizationName
            })

            if (!organization) {
                return NextResponse.json(
                    { error: `Organization not found for client ID: ${clerkOrgId}` },
                    { status: 404 },
                )
            }

            const user = await prisma.user.findUnique({
                where: { clerkId: userId },
                include: {
                    memberships: {
                        where: { organizationId: organization.id },
                        include: {
                            organization: true
                        }
                    }
                }
            })

            console.log("User and memberships:", {
                userFound: !!user,
                userId: user?.id,
                email: user?.email,
                membershipsCount: user?.memberships?.length,
                membershipOrgIds: user?.memberships?.map((m) => m.organizationId)
            })

            if (!user || user.memberships.length === 0) {
                return NextResponse.json(
                    {
                        error: "You do not have access to this organization",
                        details: `User ${userId} is not a member of ${organization.organizationName}`,
                    },
                    { status: 403 },
                )
            }

            let fileUrl = null;
            let fileSize = null;
            let fileType = null;
            let extractedContent = content

            if (file && file.size > 0) {
                const blob = await uploadToBlob(file, clerkOrgId, userId)
                fileUrl = blob.url,
                fileSize = file.size
                fileType = file.type

                if (!extractedContent && file.type.includes("text")) {
                    extractedContent = await file.text()
                }

                console.log("File uploaded:", { fileUrl, fileSize, fileType })
            }

            console.log("Creating document with:", {
                name,
                organizationId: organization.id,
                userId: user.id
            })

            const document = await prisma.document.create({
                data: {
                    documentName: name,
                    content: extractedContent || null,
                    fileUrl,
                    fileSize: fileSize || 0,
                    fileType: fileType || "unknown",
                    organizationId: organization.id,
                    userId: user.id,
                    aiKeywords: []
                },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            email: true
                        }
                    },
                    organization: {
                        select: {
                            organizationName: true,
                            clerkOrgId: true
                        }
                    },
                },
            })

            console.log("Document created successfully:", document.id)

            return NextResponse.json({
                success: true,
                message: "Document uploaded successfully",
                document: {
                    id: document.id,
                    documentName: document.documentName,
                    fileUrl: document.fileUrl,
                    organization: document.organization.organizationName,
                    clerkOrgId: document.organization.clerkOrgId,
                    uploadedBy: document.user.firstName
                },
            })
    } catch (error: any) {
        console.error("Document upload error:", error)
        return NextResponse.json(
            {
                error: error.message || "Failed to upload document",
                details: process.env.NODE_ENV === "development" ? error.stack : undefined,
            },
            { status: 500 }
        )
    }
}