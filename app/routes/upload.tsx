import React, { type FormEvent } from 'react'
import NavBar from "../components/NavBar.js";
import { useState } from 'react';
import FileUploader from '~/components/FileUploader.js';
const upload = () => {
    
    const [isProcessing, setIsProcessing]
        = useState(false);
    const [statusText, setStatusTesxt] = useState('');
    const [file ,setFile]=useState<File| null>()
 const handleFileSelect=(file:File| null)=>{
setFile(file)
 }
const handelSubmit: (e:FormEvent<HTMLFormElement>)=> void=(e:FormEvent<HTMLFormElement>)=>{

}

    return (

        <main className="bg-[url('./public/images/bg-main.svg')] bg-cover">
            <NavBar />
            <section className="main-section " >
                <div className='page-heading py-16'>
                    <h1>Smart feedback for your dream job.</h1>
                    {isProcessing ? (<>'
                        <h2> {statusText}</h2>

                        <img src='/public/images/resume-scan.gif' className='w-full' />

                    </>) : (
                        <h2>Drop your resume for ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form action="" className='flex flex-col gap-4 mt-8'
                            id='upload-form' onSubmit={handelSubmit}>
                            <div className='form-div'>
                                <label htmlFor='campany-name' >
                                    Compay Name

                                </label>
                                <input type="text" name="company-name" placeholder='Company Name' id='campany-name' />
                            </div>
                            <div className='form-div'>
                                <label htmlFor='job-title' >
                                    Job Title
                                </label>
                                <input type="text" name="job-title" placeholder='Job Title' id='job-title' />
                            </div>
                            <div className='form-div'>
                                <label htmlFor='job-description' >
                                    Job Description
                                </label>
                                <textarea rows={5} name="job-description" placeholder=' Job Description' id='job-description' />
                            </div>
                            <div className='form-div'>
<label htmlFor='uploader' >
Upload Resume
</label>
<FileUploader onFileSelect={handleFileSelect}/>
</div>
<button className='primary-button type-submit'>Analyze Resume</button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}

export default upload
