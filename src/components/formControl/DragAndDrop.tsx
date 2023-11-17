"use client";

import { useRef, useState } from "react";
import ItemUpload from "./ItemUpload";
import { Button } from "../ui/button";
import axios from "axios";
export default function DragAndDrop() {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>(null);

  function handleChange(e: any) {
    e.preventDefault();
    console.log("File has been added");
    if (e.target.files && e.target.files[0]) {
      setFiles(e.target.files[0]);
    }
  }

  async function handleSubmitFile(e: any) {
    if (files.length !== 0) {
      const formData = new FormData();

      formData.append("file", files);

      const res = await axios.post(
        "http://localhost:7000/upload-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res);
    } else {
      // write submit logic here
      return;
    }
  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(e.dataTransfer.files[0]);
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile() {
    setFiles(null);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  console.log(files);

  return (
    <div className="flex items-center justify-center h-[50vh] w-full flex-col">
      <form
        className={`${
          dragActive ? "bg-blue-400" : "bg-blue-100"
        }  p-4 w-1/3 rounded-lg  min-h-[10rem] text-center flex flex-col items-center justify-center ${
          files && "hidden"
        }`}
        onDragEnter={handleDragEnter}
        onSubmit={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
        <input
          placeholder="fileInput"
          className="hidden"
          ref={inputRef}
          type="file"
          name="file"
          multiple={true}
          onChange={handleChange}
          accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf,.zip"
        />

        <p>
          Drag & Drop files or{" "}
          <span
            className="font-bold text-blue-600 cursor-pointer"
            onClick={openFileExplorer}
          >
            <u>Select files</u>
          </span>{" "}
          to upload
        </p>
      </form>

      {files ? (
        <>
          <ItemUpload file={files} removeFile={removeFile} />{" "}
          <Button
            className="bg-black rounded-lg p-2 mt-3 w-auto"
            onClick={handleSubmitFile}
          >
            <span className="p-2 text-white">Submit</span>
          </Button>
        </>
      ) : null}
    </div>
  );
}
