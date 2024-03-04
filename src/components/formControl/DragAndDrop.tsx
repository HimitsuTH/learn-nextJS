"use client";

import { useRef, useState } from "react";
import ItemUpload from "./ItemUpload";
import { Button } from "../ui/button";
import axios from "axios";
import JsZip from "jszip";

import TableInformation from "../table/Index";
import { csvStringToArray } from "@/lib/csv.utils";

export default function DragAndDrop() {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>(null);
  const [fileImport, setFileImport] = useState<any>({});

  const getFileZip = async (file: FileList, type?: 'default' | string) => {
    const zip = new JsZip();

    // unzip file
    const decomposedFile = await zip.loadAsync(file[0]);

    // const fileList = decomposedFile.files;


    const documentString = await decomposedFile
      .file("document.csv")
      ?.async("string");
    const traderString = await decomposedFile
      .file("trader.csv")
      ?.async("string");
    const productString = await decomposedFile
      .file("product.csv")
      ?.async("string");

      
      if (!documentString) {
        return console.log("document error");
      }
      
      const document = await csvStringToArray(documentString);
      const trader = traderString ? await csvStringToArray(traderString) : [];
      const product = productString ? await csvStringToArray(productString) : [];
      
    setFileImport({
      document,
      trader,
      product,
    });

    if(type === 'selected') setFiles(file[0])
  };
  
  const handleChange = async (e: any) => {
    e.preventDefault();

    // get file on select
    const fileLists = e.target.files;

    await getFileZip(fileLists, 'selected');

    console.log("File has been added");

    if (!files || !files.length) return null;

    if (files[0] && files[0].size >= 2e8) {
      if (inputRef?.current) inputRef.current.value = "";
      console.log("Please upload a file size not over 200 MB");
    }

    setDragActive(false);
  };

  async function handleSubmitFile(e: any) {

    if (files.length !== 0) {
      const formData = new FormData();
      

      formData.append("file", files);

      const res = await axios.post(
        "http://localhost:8000/upload-file",
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

  const handleDrop = async (e: any) => {
    e.preventDefault();
    // e.stopPropagation();

    if (e.dataTransfer.files[0].size >= 2e8) {
      if (inputRef?.current) inputRef.current.value = "";

      console.log("Please upload a file size not over 200 MB");
      setFiles(null);
    } else {
      setFiles(e.dataTransfer.files[0]);
      await getFileZip(e.dataTransfer.files);
    }

    if (!e.dataTransfer.files) {
      console.log("File not found");

      setFiles(null);
    }
    setDragActive(false);
  };

  function handleDragLeave(e: any) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    // console.log(e.dataTransfer.files[0]);
    setDragActive(true);
  }

  function removeFile() {
    setFiles(null);
    setDragActive(false);
    setFileImport({});
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  const tableHeader = [
    {
      field: "no",
      headerName: "No.",
      styles: "w-[100px] text-center",
    },
    {
      field: "operationFlag",
      headerName: "Operation Flag",
      styles: "text-center",
    },
    {
      field: "billNo",
      headerName: "Bill no",
      styles: "text-center",
    },
    {
      field: "amount",
      headerName: "Grand total amount",
      styles: " text-right",
    },
  ];

  return (
    <div className="flex items-center justify-center h-[50vh] flex-col w-full">
      <form
        className={`${
          dragActive
            ? "bg-blue-400 dark:bg-blue-900"
            : "bg-blue-100 dark:bg-bluePle"
        }  p-4 w-2/3 rounded-lg  min-h-[10rem] text-center flex flex-col items-center justify-center transition-all ${
          files && "hidden"
        }`}
        onSubmit={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
        <input
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
            className="font-bold text-blue-600 cursor-pointer dark:text-white"
            onClick={openFileExplorer}
          >
            <u>Select files</u>
          </span>{" "}
          to upload
        </p>
      </form>

      {files ? (
        <div className=" h-full relative flex flex-col items-center">
          <ItemUpload file={files} removeFile={removeFile} />
          <div className=" h-full overflow-y-scroll">
            <TableInformation data={fileImport} tableHeader={tableHeader} />
          </div>

          <Button
            className=" bg-black rounded-lg p-2 mt-3  dark:bg-white "
            onClick={handleSubmitFile}
          >
            <span className="p-2 text-white dark:text-black">Submit</span>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
