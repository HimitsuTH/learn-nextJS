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
import { Input as SInput } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, useCallback } from "react";
import JsZip, { JSZipObject} from "jszip";
import { useForm ,Controller } from "react-hook-form";

import axios from "axios";

const Form = () => {
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [list, setList] = useState<any | null>(null);
  const [data, setData] = useState<any>(null);

  const form = useForm();

  const onSubmit = useCallback(async (body: any) => {
    try {
      const { type, username } = body;

      // console.log('file' ,file)
     
      if (!fileList) {
        console.log("Please upload batch file");
        return;
      }
      const formData = new FormData();
      formData.append("file", fileList[0]);
      formData.append("username", username);
      formData.append("type", type);
      formData.append('list', JSON.stringify(list))
      // console.log(list)

      console.log([...formData.entries()]);

      const res = await axios.post("http://localhost:7000/import-file", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(res);

    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleFileChange = async (e: any) => {
    const fileList = e.target.files;
    console.log(fileList)

    
    const zip = new JsZip();
    const decomposedFile = await zip.loadAsync(fileList[0]);
    
    const files = decomposedFile.files;
    

    setFileList(fileList);
    setList(files)
  };

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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
         <Controller
        name="file"
        control={form.control}
        render={({ field }) => (
          <>
            <FormItem>
              <FormLabel>Upload</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  {...field}
                  onChange={(e) => 
                    handleFileChange(e)
                 
                    // field.onChange(e.target.files)
                  }
                />
              </FormControl>
              {/* Display file name if available */}
              {field.value && <p>Selected File: {field.value.name}</p>}
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
