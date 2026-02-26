import {type FormEvent, useState} from 'react'
import Navbar from "../components/NavBar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../constants/index";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
        setErrorMessage(null);
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);
        setErrorMessage(null);

        try {
            setStatusText('Uploading the file...');
            console.log("Uploading file to Puter...");
            const uploadedFile = await fs.upload([file]);
            if(!uploadedFile) {
                setErrorMessage('Failed to upload file');
                setIsProcessing(false);
                return;
            }
            console.log("File uploaded:", uploadedFile);

            setStatusText('Converting to image...');
            console.log("Converting PDF to image...");
            const imageFile = await convertPdfToImage(file);
            console.log("Conversion result:", imageFile);
            
            if(!imageFile.file) {
                setErrorMessage(`PDF Conversion Error: ${imageFile.error || 'Unknown error'}`);
                setIsProcessing(false);
                return;
            }

            setStatusText('Uploading the image...');
            console.log("Uploading image to Puter...");
            const uploadedImage = await fs.upload([imageFile.file]);
            if(!uploadedImage) {
                setErrorMessage('Failed to upload image');
                setIsProcessing(false);
                return;
            }
            console.log("Image uploaded:", uploadedImage);

            setStatusText('Preparing data...');
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName, jobTitle, jobDescription,
                feedback: '',
            }
            console.log("Saving data to KV store:", data);
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analyzing...');
            console.log("Calling AI feedback...");
            
            const instructions = prepareInstructions({ jobTitle, jobDescription });
            console.log("Instructions:", instructions);
            
            const feedback = await ai.feedback(
                uploadedFile.path,
                instructions
            )
            
            console.log("AI feedback response:", feedback);
            
            if (!feedback) {
                setErrorMessage('Failed to analyze resume');
                setIsProcessing(false);
                return;
            }

            let feedbackText;
            if (typeof feedback.message.content === 'string') {
                feedbackText = feedback.message.content;
            } else if (Array.isArray(feedback.message.content)) {
                feedbackText = feedback.message.content[0]?.text || '';
            } else {
                feedbackText = JSON.stringify(feedback.message.content);
            }
            
            console.log("Feedback text:", feedbackText);

            try {
                data.feedback = JSON.parse(feedbackText);
            } catch (parseError) {
                console.error("Failed to parse feedback JSON:", parseError);
                // If it's not JSON, store it as a string in a simple object
                data.feedback = { text: feedbackText };
            }
            
            console.log("Final data with feedback:", data);
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            
            setStatusText('Analysis complete, redirecting...');
            navigate(`/resume/${uuid}`);
            
        } catch (error) {
            console.error("=== COMPLETE ERROR OBJECT ===");
            console.error(error);
            
            // Try to extract meaningful error message
            let errorMessage = "Unknown error occurred";
            
            if (error instanceof Error) {
                errorMessage = error.message;
                console.error("Error name:", error.name);
                console.error("Error stack:", error.stack);
            } else if (typeof error === 'string') {
                errorMessage = error;
            } else if (error && typeof error === 'object') {
                try {
                    errorMessage = JSON.stringify(error, null, 2);
                } catch {
                    errorMessage = String(error);
                }
            }
            
            setErrorMessage(`Unexpected error: ${errorMessage}`);
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) {
            setErrorMessage('Please select a file');
            return;
        }

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <>
                            <h2>Drop your resume for an ATS score and improvement tips</h2>
                            {errorMessage && (
                                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-2xl mx-auto">
                                    <p className="font-bold">Error:</p>
                                    <p className="text-sm break-all whitespace-pre-wrap">{errorMessage}</p>
                                    <button 
                                        onClick={() => setErrorMessage(null)}
                                        className="mt-2 text-sm text-red-700 underline hover:no-underline"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 max-w-2xl mx-auto">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" className="w-full p-2 border rounded" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" className="w-full p-2 border rounded" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" className="w-full p-2 border rounded" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button bg-blue-600 text-white p-3 rounded hover:bg-blue-700" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload