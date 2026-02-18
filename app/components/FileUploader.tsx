import  { useState } from 'react'
import { useCallback } from 'react'
import {useDropzone} from 'react-dropzone'
interface FileUploaderProps{
    onFileSect ? :(file:File | null )=> void;
}
const FileUploader = ({onFileSect}:FileUploaderProps) => {
    const [file ,setFile]=useState()
      const onDrop = useCallback((acceptedFiles:File[]) => {
const file =acceptedFiles[0] || null;
onFileSelect?.(file)
    }, [onFileSelect])
      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className="gradient-border w-full">
    <div {...getRootProps()} >
      <input {...getInputProps()} />
      <div className='space-t-4 cursor-pointer '>
        <div className='mx-auto w-16 h-16 items-center justify-center'>
<img src="../../public/icons/info.svg" alt="upload " className='size-20'/>

        </div>
        {file ? (
            <div>

            </div>):
            (
            <div>
                <p className='text-lg text-gray-500'>
                    <span className="font-semibold">
Click to upload
                    </span> or drag & drop
                </p>
                <p className='text-lg text-gray-500'>PDF(max 20MB)</p>
            </div>
        )}
      </div>

    </div>
    </div>
  )
}

export default FileUploader
