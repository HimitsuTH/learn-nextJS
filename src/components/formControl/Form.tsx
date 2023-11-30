"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form as FormDetail,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Progress } from "@/components/ui/progress";

import { useState, useCallback, useRef } from "react";
import JsZip from "jszip";
import { useForm, Controller } from "react-hook-form";
import { FileUpload, fileUploadSchema } from "@/lib/zod.utils";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";

const Form = () => {
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [list, setList] = useState<any | null>(null);
  const [progressLoad, setProgressLoad] = useState<number>(0);

  const fileRef = useRef<any>(null);

  const form = useForm<FileUpload>({
    resolver: zodResolver(fileUploadSchema),
  });

  const handleFileChange = async (e: any): Promise<void> => {
    setProgressLoad(0);
    const fileLists = e.target.files;
    console.log(fileLists[0]);

    const zip = new JsZip();
    const decomposedFile = await zip.loadAsync(fileLists[0]);

    const files = decomposedFile.files;

    // if(!fileLists[0]){
    //   return
    // }
    setFileList(fileLists);
    setList(files);
  };

  const onSubmit = useCallback(
    async (body: any) => {
      try {
        const { type, username } = body;

        if (fileList && fileList[0]) {
          const formData = new FormData();
          formData.append("file", fileList[0] || null);
          formData.append("username", username);
          formData.append("type", type);
          formData.append("list", JSON.stringify(list));

          // console.log(list)
          console.log([...formData.entries()]);

          const res = await axios.post(
            "http://localhost:8000/import-file",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent: any) => {
                setProgressLoad(progressEvent?.progress * 100);
              },
            }
          );

          console.log(res);
        }
      } catch (e) {
        console.log(e);
      } finally {
        form.reset();
        console.log("finally");
        form.setValue("type",'A')
        fileRef.current.value = null;

        setFileList(null)
        setList(null)

        const myTimeout = setTimeout(() => setProgressLoad(0), 2000);
        return () => {
          clearTimeout(myTimeout);
        };
      }
    },
    [fileList]
  );

  const router = useRouter();
  return (
    <Card className="w-[350px] dark:bg-gray500">
      <CardHeader>
        <CardTitle>Create product</CardTitle>
        <CardDescription>Add your new product in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormDetail {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={"A"}
                      value={field.value}
                 
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select something" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                </>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                  </FormItem>
                </>
              )}
            />
            <Controller
              name="fileUpload"
              control={form.control}
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Upload</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        {...field}
                        ref={fileRef}
                        defaultValue={undefined}
                        onChange={(e) => {
                          handleFileChange(e);
                          field.value = e.target.files;
                        }}
                      />
                    </FormControl>
                    {/* Display file name if available */}
                    {field.value && (
                      <p className=" text-xs">Selected File: {field.value}</p>
                    )}

                    {/* {console.log(field.value)} */}

                    <Progress
                      max={100}
                      value={progressLoad}
                      className=" mt-2 w-full"
                    />
                  </FormItem>
                </>
              )}
            />

            <Button type="submit" className=" mt-5">
              Submit
            </Button>
          </form>
        </FormDetail>
      </CardContent>
    </Card>
  );
};

export default Form;
