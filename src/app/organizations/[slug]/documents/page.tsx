'use client';

import { Header } from "@/components/header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, ChevronDown, CreditCardIcon, Download, File, FileText, Hash, List, LogOutIcon, MessageCircle, MessageSquare, SettingsIcon, Sparkles, Tag, Trash, Upload, UserIcon, UserRound, X } from "lucide-react";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload";
import React, { use, useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReactMarkdown from 'react-markdown';
import { RedirectToSignIn, useAuth, useUser } from "@clerk/nextjs";

export default function Documents(
    { params }: { params: Promise<{ slug: string }> }
    ){

    const { slug } = use(params)
    const [files, setFiles] = React.useState<File[]>([]);
    const [expanded, setExpanded] = React.useState<Boolean>(true)
    const existdoc = true
    const analyzed = true
    const analyzed_text = `Here are 5 important questions and their answers based on the document:\n**Question:** What is the primary objective of the Al-powered customer support system? Answer: The primary objective is to reduce response times by 60% and improve customer satisfaction scores by 40%.\n**Question:** What are the key current problems that this project aims to solve for Tech Innovations Inc.? Answer: The project aims to address an average response time of 8 hours, a decline in customer satisfaction scores from 4.2 to 3.7, and a 25% increase in staff burnout rates due to repetitive query volume.\n**Question:** What is the total estimated budget for the initial implementation of the system and are there any recurring costs? Answer: The total estimated budget for implementation is $150,000. There is a recurring annual cost of $15,000 for Al model licensing.\n**Question:** What is the projected timeline for the full deployment of the Al-powered customer support system? Answer: The full deployment and optimization are projected to be completed within 20 weeks, following a four-phase implementation plan.\n**Question:** What are the high-priority risks identified for this project? Answer: The high-priority risks include integration challenges with legacy systems, customer resistance to Al interactions, data privacy compliance requirements, and staff training and adoption hurdles.`
    console.log(files[0])
    const { isLoaded, isSignedIn } = useAuth()
    const { user } = useUser()
    
    const onFileReject = React.useCallback((file: File, message: string) => {
        toast(message, {
        description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
        });
    }, []);

    const [documentName, setDocumentName] = React.useState<string>("")
    const handleUpload = async () => {
        const formData = new FormData()
        formData.append("name", documentName)
        formData.append("organizationId", slug)

        if(files){
            formData.append("file", files[0])
        }

        try {
            const response = await fetch("/api/documents", {
                method: "POST",
                body: formData
            })
        } catch (error) {
            console.error("Upload error: ", error)
        } finally {
            // setUploading(false);
        }
        
    }
    // console.log(files[0]?.name)
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(!file) return

        // setFiles(file)
        setDocumentName(file.name.replace(/\.[^/.]+$/, ""))
    }

    if (!isLoaded) return <div>Loading...</div>
    if (!isSignedIn) return <RedirectToSignIn />

    return (
        <div>
            <Header/>
            <div className="container mx-auto px-32 mt-8 flex flex-col">
                
                <Card className="flex flex-row justify-between items-center p-6">
                    <div className="flex flex-col">
                        <CardTitle className="font-bold text-xl">Sales</CardTitle>
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
                            <p className="text-sm mt-1">Upload and analyze documents in Sales</p>
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

                    {!existdoc ? (<Card className="flex flex-col p-7 pt-6 mt-6">
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
                    </Card>) : analyzed ? <div>
                            <div className="mt-6 flex flex-row space-x-4.5">
                                <Card className="flex-1 items-center gap-0 pt-8 pb-4">
                                    <CardTitle className="font-extrabold text-2xl">1</CardTitle>
                                    <CardDescription>Total Documents</CardDescription>
                                </Card>
                                <Card className="flex-1 items-center gap-0 pt-8 pb-4">
                                    <CardTitle className="font-extrabold text-2xl text-[#80ff00]">1</CardTitle>
                                    <CardDescription>Analyzed</CardDescription>
                                </Card>
                                <Card className="flex-1 items-center gap-0 pt-8 pb-4">
                                    <CardTitle className="font-extrabold text-2xl">2.6 KB</CardTitle>
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
                                    <Card className="gap-0 flex flex-row justify-between mt-6 p-6">
                                        <div className="flex flex-row">
                                            <div className="bg-blue-200 rounded p-3 px-2.5 self-start">
                                                <FileText size={24} color="#0080ff" />
                                            </div>
                                            <div className="ml-6">
                                                <div className="flex flex-row justify-between">
                                                    <div>
                                                    <CardTitle className="mb-1">Project_Proposal</CardTitle>
                                                    <CardDescription className="flex flex-row items-center">
                                                        <UserRound size={12} /> <p className="mr-3 ml-1">Joseph</p>
                                                        <Calendar size={12} /> <p className="text-xs mr-3 ml-1">01/03/2026</p>
                                                        <File size={12} /> <p className="text-xs ml-1">2.6 KB</p>
                                                    </CardDescription>
                                                    </div>
                                                    <Card className="rounded-2xl py-1 px-3 bg-accent-foreground text-accent ml-4 self-start mr-6">
                                                        <p className="text-xs font-medium">Analyzed</p>
                                                    </Card>
                                                </div>
                                                <Card className="bg-accent mr-6 p-4 pr-5 pt-5 mt-3">
                                                    <div className="flex flex-row items-center justify-between">
                                                        <div className="flex flex-row items-center">
                                                            <div><Brain size={20} color="#80ff00" /></div>
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
                                                        <ReactMarkdown>{analyzed_text}</ReactMarkdown>
                                                        
                                                    </div>
                                                    <hr/>
                                                    <div>
                                                        <div className="flex flex-row items-center">
                                                            <CardDescription><Tag /></CardDescription>
                                                            <p className="font-semibold ml-2">Key Topics</p>
                                                        </div>
                                                        <div className="mt-2 text-xs font-semibold ml-5">analyzed</div>
                                                    </div>
                                                </Card>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            
                                            <Button className="text-sm px-4 py-2 rounded-md cursor-pointer bg-accent text-accent-foreground hover:bg-accent/80 font-medium flex flex-row items-center">
                                                <Download size={18} />
                                                <p className="ml-1.5">Download</p>
                                            </Button>
                                            <CardDescription className="text-xs mt-1">Analyze with:</CardDescription>


                                            <DropdownMenu>
                                                <DropdownMenuTrigger render={
                                                    <Button className="text-sm px-4 py-2 rounded-md cursor-pointer bg-accent text-accent-foreground hover:bg-accent/80 font-medium flex flex-row items-center">
                                                        <Sparkles size={18} />
                                                        <p className="ml-1.5">Summary</p>
                                                        <ChevronDown size={18} />
                                                    </Button>
                                                } />
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        <MessageCircle />
                                                        Q&A
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <MessageSquare />
                                                        Sentiment
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Hash />
                                                        Entities
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <List />
                                                        Extract
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <Button className="text-sm px-4 py-2 mt-2 rounded-md cursor-pointer bg-accent text-accent-foreground hover:bg-accent/80 font-medium flex flex-row items-center">
                                                <Brain size={18} />
                                                <p className="ml-1.5">Re-analyze</p>
                                            </Button>
                                            <Button className="text-sm px-4 py-2 mt-2 rounded-md cursor-pointer text-[#ff0000] bg-transparent hover:bg-red-500/20 font-medium flex flex-row items-center">
                                                <Trash size={18} />
                                                <p className="ml-1.5">Delete</p>
                                            </Button>
                                        </div>
                                    </Card>

                                </div>
                            </Card>
                        </div> : (
                        <div>
                            <div className="mt-6 flex flex-row space-x-4.5">
                                <Card className="flex-1 items-center gap-0 pt-8 pb-4">
                                    <CardTitle className="font-extrabold text-2xl">1</CardTitle>
                                    <CardDescription>Total Documents</CardDescription>
                                </Card>
                                <Card className="flex-1 items-center gap-0 pt-8 pb-4">
                                    <CardTitle className="font-extrabold text-2xl text-[#80ff00]">0</CardTitle>
                                    <CardDescription>Analyzed</CardDescription>
                                </Card>
                                <Card className="flex-1 items-center gap-0 pt-8 pb-4">
                                    <CardTitle className="font-extrabold text-2xl">2.6 KB</CardTitle>
                                    <CardDescription>Total Size</CardDescription>
                                </Card>
                            </div>
                            <Card className="flex flex-col p-7 pt-6 mt-6 mb-15">
                                <div className="flex flex-col">
                                    <div>
                                        <div className="flex items-center">
                                            <CardTitle className="font-bold">Documents</CardTitle>
                                            <CardTitle className="font-bold ml-1">(0)</CardTitle>
                                        </div>
                                        <div>
                                            <CardDescription>0 analyzed &#8226; 1 pending</CardDescription>
                                        </div>
                                    </div>
                                    <Card className="gap-0 flex flex-row justify-between mt-6 p-6">
                                        <div className="flex flex-row">
                                            <div className="bg-blue-200 rounded p-3 px-2.5 self-start">
                                                <FileText size={24} color="#0080ff" />
                                            </div>
                                            <div className="ml-6">
                                                <CardTitle className="mb-1">Project_Proposal</CardTitle>
                                                <CardDescription className="flex flex-row items-center">
                                                    <UserRound size={12} /> <p className="mr-3 ml-1">Joseph</p>
                                                    <Calendar size={12} /> <p className="text-xs mr-3 ml-1">01/03/2026</p>
                                                    <File size={12} /> <p className="text-xs ml-1">2.6 KB</p>
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            
                                            <Button className="text-sm px-4 py-2 rounded-md cursor-pointer bg-accent text-accent-foreground hover:bg-accent/80 font-medium flex flex-row items-center">
                                                <Download size={18} />
                                                <p className="ml-1.5">Download</p>
                                            </Button>
                                            <CardDescription className="text-xs mt-1">Analyze with:</CardDescription>


                                            <DropdownMenu>
                                                <DropdownMenuTrigger render={
                                                    <Button className="text-sm px-4 py-2 rounded-md cursor-pointer bg-accent text-accent-foreground hover:bg-accent/80 font-medium flex flex-row items-center">
                                                        <Sparkles size={18} />
                                                        <p className="ml-1.5">Summary</p>
                                                        <ChevronDown size={18} />
                                                    </Button>
                                                } />
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        <MessageCircle />
                                                        Q&A
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <MessageSquare />
                                                        Sentiment
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Hash />
                                                        Entities
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <List />
                                                        Extract
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <Button className="text-sm px-4 py-2 mt-2 rounded-md cursor-pointer bg-accent-foreground text-accent hover:bg-accent-foreground/80 font-medium flex flex-row items-center">
                                                <Brain size={18} />
                                                <p className="ml-1.5">Analyze</p>
                                            </Button>
                                            <Button className="text-sm px-4 py-2 mt-2 rounded-md cursor-pointer text-[#ff0000] bg-transparent hover:bg-red-500/20 font-medium flex flex-row items-center">
                                                <Trash size={18} />
                                                <p className="ml-1.5">Delete</p>
                                            </Button>

                                        </div>
                                    </Card>

                                </div>
                            </Card>
                        </div>
                    )}
                </div>

                
            </div>
        </div>
    )
}