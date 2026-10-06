import { Header } from "@/components/header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@base-ui/react";
import { ArrowRight, Brain, FileText, Upload } from "lucide-react";

export default async function SlugPage(
    { params }: { params: Promise<{ slug: string }> }
    ){

    const { slug } = await params
    const docs = false

    return (
        <div>
            <Header/>
            <div className="container mx-auto px-32 mt-8 flex flex-col">
                
                <Card className="flex flex-row justify-between items-center p-6">
                    <div className="flex flex-col">
                        <CardTitle className="font-bold text-xl">AI Engineering</CardTitle>
                        <CardDescription>Organization workspace</CardDescription>
                    </div>
                    <div>
                        <Card className="rounded-2xl py-1 px-4">
                            <p className="">owner</p>
                        </Card>
                    </div>
                </Card>

                <div className="mt-10 px-4">
                    <div>
                        <div className="font-extrabold text-2xl">AI Engineering Dashboard</div>
                        <p className="text-sm mt-1">Welcome to your organization workspace</p>
                    </div>

                    <div className="mt-10 flex flex-row justify-between gap-8">
                        <Card className="flex-1 p-8 gap-0">
                            <CardTitle>Total Documents</CardTitle>
                            <CardDescription className="text-sm mt-3">In this organization</CardDescription>
                            <CardTitle className="font-bold text-2xl mt-6">2</CardTitle>
                            <div className="flex pl-2 items-center space-y-0.5 mt-5">
                                <p className="mr-4">View Documents</p>
                                <ArrowRight size={16} />
                            </div>
                        </Card>
                        
                        <Card className="flex-1 p-8 gap-0">
                            <CardTitle>Team Members</CardTitle>
                            <CardDescription className="text-sm mt-3">Organization members</CardDescription>
                            <CardTitle className="font-bold text-2xl mt-6">1</CardTitle>
                            <div className="flex pl-2 items-center space-y-0.5 mt-5">
                                <p className="mr-4">View Team</p>
                                <ArrowRight size={16} />
                            </div>
                        </Card>

                        <Card className="flex-1 p-8 gap-0">
                            <CardTitle>Analyzed</CardTitle>
                            <CardDescription className="text-sm mt-3">Documents with AI insights</CardDescription>
                            <CardTitle className="font-bold text-2xl mt-6">1</CardTitle>
                            <div className="flex items-center space-y-0.5 mt-2">
                                <CardDescription>50&#37; analyzed</CardDescription>
                            </div>
                        </Card>
                    </div>

                    {docs ? ( 
                    <div className="mt-8">
                        <Card className="flex flex-col p-8 gap-0 mb-15">
                            <CardTitle>Recent Documents</CardTitle>
                            <CardDescription className="text-sm mt-1.5">Latest uploads in your organization</CardDescription>

                            <div className="py-8 space-y-6">
                                <Card className="flex flex-row justify-between items-center p-6 gap-0">
                                    <div className="flex flex-row items-center">
                                        <FileText size={20} />
                                        <div className="ml-3">
                                            <CardTitle>Project_Proposal</CardTitle>
                                            <CardDescription className="mt-1">Uploaded 2/11/2026</CardDescription>
                                        </div>
                                    </div>
                                    <div><Brain size={20} color="#80ff00" /></div>
                                </Card>

                                <Card className="flex flex-row justify-between items-center p-6 gap-0">
                                    <div className="flex flex-row items-center">
                                        <FileText size={20} />
                                        <div className="ml-3">
                                            <CardTitle>Quarterly_Research_Report</CardTitle>
                                            <CardDescription className="mt-1">Uploaded 2/10/2026</CardDescription>
                                        </div>
                                    </div>
                                    <div>
                                        <Card className="rounded-lg py-1 px-4">
                                            <p className="">Analyze</p>
                                        </Card>
                                    </div>
                                </Card>
                            </div>
                        </Card>
                    </div>) : (
                        <div className="mt-8">
                            <Card className="flex flex-col p-8 gap-0 mb-15">
                                <CardTitle>Recent Documents</CardTitle>
                                <CardDescription className="text-sm mt-1.5">Latest uploads in your organization</CardDescription>

                                <div className="flex flex-col items-center p-16 pb-10">
                                    <FileText size={40} color="#c0c0c0" />
                                    <CardDescription className="mt-4">No documents uploaded yet</CardDescription>
                                    
                                    <Button className="mt-4 px-4 py-2 rounded-md cursor-pointer bg-accent-foreground text-accent hover:bg-accent-foreground/80 font-medium flex flex-row items-center">
                                        <Upload size={18} />
                                        <p className="ml-3">Upload First Document</p>
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}