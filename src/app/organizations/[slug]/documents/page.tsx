import { Header } from "@/components/header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@base-ui/react";
import { FileText, Upload } from "lucide-react";

export default async function Documents(
    { params }: { params: Promise<{ slug: string }> }
    ){

    const { slug } = await params

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
                        
                            <Button className="text-sm mt-4 px-4 py-2 rounded-md cursor-pointer bg-accent-foreground text-accent hover:bg-accent-foreground/80 font-medium flex flex-row items-center">
                                <Upload size={18} />
                                <p className="ml-3">Upload Document</p>
                            </Button>
                        
                    </div>

                    <Card className="flex flex-col p-7 pt-6 mt-6">
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
                    </Card>
                </div>

                
            </div>
        </div>
    )
}