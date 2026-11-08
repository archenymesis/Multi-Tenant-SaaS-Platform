import { analyzeWithGemini } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Please sign in" }, { status: 401 })
        }

        const { documentId, organizationId, analysisType } = await request.json()
        if (!documentId || !organizationId) {
            return NextResponse.json(
                { error: "Missing document or organization ID" },
                { status: 400 }
            )
        }

        const document = await prisma.document.findFirst({
            where: {
                id: documentId,
                organization: {
                    clerkOrgId: organizationId,
                    members: {
                        some: {
                            user: { clerkId: userId }
                        }
                    }
                }
            }
        })

        if (!document) {
            return NextResponse.json(
                { error: "Document not found or access" },
                { status: 401 }
            )
        }

        const content = document.content || document.documentName
        if (!content || content.trim().length < 5) {
            return NextResponse.json(
                { error: "Document has no content to analyze" },
                { status: 400 }
            )
        }

        const summary = await analyzeWithGemini(content, analysisType)

        const updatedDocument = await prisma.document.update({
            where: { id: documentId },
            data: {
                aiSummary: summary,
                aiKeywords: ["analyzed"],
                sentiment: "analyzed"
            }
        })

        return NextResponse.json({
            success: true,
            summary,
            document: {
                id: updatedDocument.id,
                name: updatedDocument.documentName,
                aiSummary: updatedDocument.aiSummary
            }
        })
    } catch (error: any) {
        console.error("Analysis error:", error)
        return NextResponse.json(
            { error: "Analysis failed: " + error.message },
            { status: 400 }
        )
    }
}