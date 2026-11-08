'use client';

import { Header } from "@/components/header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, ChevronDown, Download, File, FileText, Hash, List, MessageCircle, MessageSquare, Sparkles, Tag, Trash, Upload, UserRound, X } from "lucide-react";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload";
import React, { use, useEffect } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReactMarkdown from 'react-markdown';
import { RedirectToSignIn, useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { AnalysisType, Document } from "../../../../../types";
import { analysisTypes, formatFileSize } from "@/app/data/data";

export default function Documents(
    { params }: { params: Promise<{ slug: string }> }
    ){

    const { organization } = useOrganization()
    const { slug } = use(params)
    const [ documents, setDocuments ] = React.useState<Document[]>([])
    const [selectedAnalysisType, setSelectedAnalysisType] = React.useState<AnalysisType>("summary")
    const [ isAnalyzing, setIsAnalyzing ] = React.useState<string | null>(null)
    const [files, setFiles] = React.useState<File[]>([]);
    const [expanded, setExpanded] = React.useState<Boolean>(false)
    const [docContent, setDocContent] = React.useState("")
    const { isLoaded, isSignedIn } = useAuth()
    const { user } = useUser()

    const fetchDocuments = async () => {
        if (!organization) return
        // setisloading(true)

        try {
            const response = await fetch(`/api/documents?organizationId=${organization.id}`)
            if (response.ok) {
                const data = await response.json()
                setDocuments(data.documents)
            }
        } catch (error) {
            console.error("Failed to fetch documents:", error)
            toast.error("Failed to load documents")
        } finally {
            // setIsLoading(true)
        }
    }

    useEffect(() => {
        fetchDocuments()
        console.log("All Documents: ", documents)
    }, [organization])

    const handleAnalyze = async (documentId: string) => {
        if (!organization) return

        setIsAnalyzing(documentId)
        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    documentId,
                    organizationId: organization.id,
                    analysisType: selectedAnalysisType
                })
            })

            if (response.ok) {
                const data = await response.json()
                const analysisTypeLabel = analysisTypes.find(
                    (type) => type.value === selectedAnalysisType
                )?.label;
            

            toast.success(
                `${analysisTypeLabel || "Document"} analysis completed successfully!`
            )
            fetchDocuments()

            // setExpandedSummaries()
            } else {
                const error = await response.json()
                toast.error(error.error || "Analysis failed")
            }
        } catch (error) {
            console.error("Analysis error:", error)
            toast.error("Analysis failed")
        } finally {
            setIsAnalyzing(null)
        }
    }
    
    const onFileReject = React.useCallback((file: File, message: string) => {
        toast(message, {
        description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
        });
    }, []);

    const [documentName, setDocumentName] = React.useState<string>("")
    const handleUpload = async () => {

        if (!organization || !user || !setFiles) {
            console.error("Please select a file")
            return
        }

        if (!documentName.trim()) {
            console.error("Please enter a document name")
            return
        }

        // setisuploading(true)

        const formData = new FormData()
        formData.append("name", documentName)
        formData.append("organizationId", organization.id)
        formData.append("content", docContent)

        if(files){
            formData.append("file", files[0])
        }

        try {
            const response = await fetch("/api/documents", {
                method: "POST",
                body: formData
            })

            if (response.ok) {
                console.log("Document uploaded successfully")

                setDocumentName("")
                // setisopen(false)
            } else {
                const error = await response.json()
                console.error(error.error || "Upload failed")
            }
        } catch (error) {
            console.error("Upload error: ", error)
        } finally {
            // setUploading(false)
        }
        
    }
    // console.log(files[0]?.name)
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(!file) return

        // setFiles(file)
        setDocumentName(file.name.replace(/\.[^/.]+$/, ""))
    }

    const getAnalysisIcon = (type: AnalysisType) => {
        const analysisType = analysisTypes.find((t) => t.value === type)
        const Icon = analysisType?.icon || Sparkles
        return <Icon size={18} />
    }

    if (!isLoaded) return <div>Loading...</div>
    if (!isSignedIn) return <RedirectToSignIn />

    return (
        <div>
            <Header/>
            <div className="container mx-auto px-32 mt-8 flex flex-col">
                
                <Card className="flex flex-row justify-between items-center p-6">
                    <div className="flex flex-col">
                        <CardTitle className="font-bold text-xl">{organization?.name}</CardTitle>
                        <CardDescription>Organization workspace</CardDescription>
                    </div>
                    <div>
                        <Card className="rounded-2xl py-1 px-4">
                            <p className="">owner</p>
                        </Card>
                    </div>
                </Card>

                <div className="mt-6 px-4">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <div className="font-extrabold text-2xl">Documents</div>
                            <p className="text-sm mt-1">Upload and analyze documents in {organization?.name}</p>
                        </div>

                            <Dialog>
                                <DialogTrigger render={
                                    <Button className="text-sm mt-4 px-4 py-2 rounded-md cursor-pointer bg-accent-foreground text-accent hover:bg-accent-foreground/80 font-medium flex flex-row items-center">
                                        <Upload size={18} />
                                        <p className="ml-3">Upload Document</p>
                                    </Button>
                                } />
                                <DialogContent>
                                    <form>
                                        <DialogHeader>
                                            <DialogTitle>Upload Document</DialogTitle>
                                            <DialogDescription>Upload a file or enter text content for analysis</DialogDescription>
                                        </DialogHeader>
                                        <FieldGroup>
                                            <Field className="mt-5">
                                                <Label htmlFor="name-1">Document Name &#42;</Label>
                                                <Input value={documentName} onChange={(e) => setDocumentName(e.target.value)} className="mt-1.5" id="name-1" name="name" placeholder="Enter document name" />
                                            </Field>
                                            <Field>
                                                <Label htmlFor="file-1">Upload File</Label>
                                                <FileUpload
                                                    name={files[0]?.name.replace(/\.[^/.]+$/, "")}
                                                    maxFiles={1}
                                                    maxSize={10 * 1024 * 1024}
                                                    className="w-full max-w-md"
                                                    value={files}
                                                    onValueChange={setFiles}
                                                    onFileReject={onFileReject}
                                                    multiple
                                                    >
                                                    <FileUploadDropzone>
                                                        <div className="flex flex-col items-center gap-1 text-center">
                                                        <div className="flex items-center justify-center rounded-full border p-2.5">
                                                            <Upload className="size-6 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-sm font-medium">Drag & drop a file here</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Supports: .txt, .pdf, .doc, .docx, .md (Max 10MB)
                                                        </p>
                                                        </div>
                                                        <FileUploadTrigger
                                                        render={(props) => (
                                                            <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-2 w-fit"
                                                            {...props}
                                                            >
                                                            Browse files
                                                            </Button>
                                                        )}
                                                        />
                                                    </FileUploadDropzone>
                                                    <FileUploadList>
                                                        {files.map((file, index) => (
                                                        <FileUploadItem key={index} value={file}>
                                                            <FileUploadItemPreview />
                                                            <FileUploadItemMetadata />
                                                            <FileUploadItemDelete
                                                            render={(props) => (
                                                                <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-7"
                                                                {...props}
                                                                >
                                                                <X />
                                                                </Button>
                                                            )}
                                                            />
                                                        </FileUploadItem>
                                                        ))}
                                                    </FileUploadList>
                                                    </FileUpload>
                                            </Field>
                                        </FieldGroup>
                                    </form>
                                    <DialogFooter>
                                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                                        <Button onClick={handleUpload} className="text-sm px-4 py-2 rounded-md cursor-pointer bg-accent-foreground text-accent hover:bg-accent-foreground/80 font-medium flex flex-row items-center">
                                            <Upload size={18} />
                                            <p className="ml-1.5">Upload Document</p>
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                    </div>

                    {!documents ? (<Card className="flex flex-col p-7 pt-6 mt-6">
                        <div className="flex flex-col">
                            <div>
                                <div className="flex items-center">
                                    <CardTitle className="font-bold">Documents</CardTitle>
                                    <CardTitle className="font-bold ml-1">(0)</CardTitle>
                                </div>
                                <div>
                                    <CardDescription>0 analyzed &#8226; 0 pending</CardDescription>
                                </div>
                            </div>
                            <div className="flex flex-col items-center mt-4 p-16 pb-10">
                                <FileText size={40} color="#c0c0c0" />
                                <CardDescription className="mt-4">No documents uploaded yet</CardDescription>
                                <CardDescription className="mt-3 text-xs">Upload your first document to get started</CardDescription>
                            </div>
                        </div>
                    </Card>) : (<div>
                            <div className="mt-6 flex flex-row space-x-4.5">
                                <Card className="flex-1 items-center gap-0 pt-8 pb-4">
                                    <CardTitle className="font-extrabold text-2xl">{documents.length}</CardTitle>
                                    <CardDescription>Total Documents</CardDescription>
                                </Card>
                                <Card className="flex-1 items-center gap-0 pt-8 pb-4">
                                    <CardTitle className="font-extrabold text-2xl text-[#00ffff]">{documents.filter(d => d.aiSummary != null).length}</CardTitle>
                                    <CardDescription>Analyzed</CardDescription>
                                </Card>
                                <Card className="flex-1 items-center gap-0 pt-8 pb-4">
                                    <CardTitle className="font-extrabold text-2xl">{formatFileSize(documents.reduce((total, d) => total + (d.fileSize ?? 0), 0))} KB</CardTitle>
                                    <CardDescription>Total Size</CardDescription>
                                </Card>
                            </div>
                            <Card className="flex flex-col p-7 pt-6 mt-6 mb-15">
                                <div className="flex flex-col">
                                    <div>
                                        <div className="flex items-center">
                                            <CardTitle className="font-bold">Documents</CardTitle>
                                            <CardTitle className="font-bold ml-1">(1)</CardTitle>
                                        </div>
                                        <div>
                                            <CardDescription>1 analyzed &#8226; 1 pending</CardDescription>
                                        </div>
                                    </div>
                                    {documents.map((doc) => (
                                    <Card key={doc.id} className="gap-0 flex flex-row justify-between mt-6 p-6">
                                        <div className="flex flex-row">
                                            <div className="bg-blue-200 rounded p-3 px-2.5 self-start">
                                                <FileText size={24} color="#0080ff" />
                                            </div>
                                            <div className="ml-6">
                                                <div className="flex flex-row justify-between">
                                                    <div>
                                                    <CardTitle className="mb-1">{doc.documentName}</CardTitle>
                                                    <CardDescription className="flex flex-row items-center">
                                                        <UserRound size={12} /> <p className="mr-3 ml-1">{doc.user.firstName}</p>
                                                        <Calendar size={12} /> <p className="text-xs mr-3 ml-1">{new Date(doc.createdAt).toLocaleDateString()}</p>
                                                        <File size={12} /> {doc.fileSize && (
                                                            <p className="text-xs ml-1">{formatFileSize(doc.fileSize)}</p>
                                                        )}
                                                    </CardDescription>
                                                    </div>
                                                    {doc.aiSummary && 
                                                    <Card className="rounded-2xl py-1 px-3 bg-accent-foreground text-accent ml-4 self-start mr-6">
                                                        <p className="text-xs font-medium">Analyzed</p>
                                                    </Card>}
                                                </div>
                                                {doc.aiSummary && 
                                                <Card className="bg-accent mr-6 p-4 pr-5 pt-5 mt-3">
                                                    <div className="flex flex-row items-center justify-between">
                                                        <div className="flex flex-row items-center">
                                                            <div><Brain size={20} color="#00ffff" /></div>
                                                            <p className="ml-3 font-bold">AI analysis</p>
                                                            <Card className="rounded-2xl py-1 px-3 bg-accent ml-4">
                                                                <p className="text-xs">Gemini AI</p>
                                                            </Card>
                                                        </div>
                                                        <div className="font-medium">
                                                            <button onClick={() => setExpanded((p) => !p)}>
                                                            {expanded ? "Show less" : "Read more"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className={expanded ? "whitespace-break-spaces" : "whitespace-break-spaces line-clamp-2"}>
                                                        <ReactMarkdown>{doc.aiSummary}</ReactMarkdown>
                                                        
                                                    </div>
                                                    <hr/>
                                                    <div>
                                                        <div className="flex flex-row items-center">
                                                            <CardDescription><Tag /></CardDescription>
                                                            <p className="font-semibold ml-2">Key Topics</p>
                                                        </div>
                                                        <div className="mt-2 text-xs font-semibold ml-5">analyzed</div>
                                                    </div>
                                                </Card>}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            
                                            <Button className="text-sm px-4 py-2 rounded-md cursor-pointer bg-accent text-accent-foreground hover:bg-accent/80 font-medium flex flex-row items-center">
                                                <Download size={18} />
                                                <p className="ml-1.5">Download</p>
                                            </Button>
                                            <CardDescription className="text-xs mt-1">{doc.aiSummary ? "Re-analyze with" : "Analyze with:"}</CardDescription>


                                            <DropdownMenu>
                                                <DropdownMenuTrigger render={
                                                    <Button className="text-sm px-4 py-2 rounded-md cursor-pointer bg-accent text-accent-foreground hover:bg-accent/80 font-medium flex flex-row items-center">
                                                        {getAnalysisIcon(selectedAnalysisType)}
                                                        <p className="ml-1.5">{analysisTypes.find((type) => type.value === selectedAnalysisType)?.label}</p>
                                                        <ChevronDown size={18} />
                                                    </Button>
                                                } />
                                                <DropdownMenuContent>
                                                    <DropdownMenuRadioGroup value={selectedAnalysisType} onValueChange={(value) => setSelectedAnalysisType(value)}>
                                                        <DropdownMenuRadioItem value="qna">
                                                            <MessageCircle/>
                                                            Q&A</DropdownMenuRadioItem>
                                                        <DropdownMenuRadioItem value="sentiment">
                                                            <MessageSquare/>
                                                            Sentiment</DropdownMenuRadioItem>
                                                        <DropdownMenuRadioItem value="entities">
                                                            <Hash/>
                                                            Entities</DropdownMenuRadioItem>
                                                        <DropdownMenuRadioItem value="extract">
                                                            <List/>
                                                            Extract</DropdownMenuRadioItem>
                                                    </DropdownMenuRadioGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            {doc.aiSummary ? 
                                            <Button onClick={() => handleAnalyze(doc.id)} className="text-sm px-4 py-2 mt-2 rounded-md cursor-pointer bg-accent text-accent-foreground hover:bg-accent/80 font-medium flex flex-row items-center">
                                                <Brain size={18} />
                                                <p className="ml-1.5">Re-analyze</p>
                                            </Button> :
                                            <Button onClick={() => handleAnalyze(doc.id)} className="text-sm px-4 py-2 mt-2 rounded-md cursor-pointer bg-accent-foreground text-accent hover:bg-accent-foreground/80 font-medium flex flex-row items-center">
                                                <Brain size={18} />
                                                <p className="ml-1.5">Analyze</p>
                                            </Button>}

                                            <Button className="text-sm px-4 py-2 mt-2 rounded-md cursor-pointer text-[#ff0000] bg-transparent hover:bg-red-500/20 font-medium flex flex-row items-center">
                                                <Trash size={18} />
                                                <p className="ml-1.5">Delete</p>
                                            </Button>
                                        </div>
                                    </Card>))}

                                </div>
                            </Card>
                        </div>
                    )}
                </div>               
            </div>
        </div>
    )
}