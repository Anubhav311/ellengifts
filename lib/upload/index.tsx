import React, { ChangeEvent, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export interface IUploadProps {
  maxSizeInMb: number;
  fileTypes?: string;
  handleUpload: (file: File) => void;
}

export function Upload({
  maxSizeInMb,
  fileTypes = "image/png,image/jpeg,image/jpg",
  handleUpload,
}: IUploadProps) {
  const [imageFile, setImageFile] = useState<File>();
  const inputRef = useRef(null);

  return (
    <div className="App">
      <InputField
        maxSizeInMb={maxSizeInMb}
        setImageFile={setImageFile}
        inputRef={inputRef}
        fileTypes={fileTypes}
      />
      <DisplayFile
        file={imageFile}
        fileRef={inputRef}
        setImageFile={setImageFile}
        handleUpload={handleUpload}
      />
    </div>
  );
}

export interface IInputFieldProps {
  maxSizeInMb: number;
  setImageFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  inputRef: React.MutableRefObject<any>;
  fileTypes: string;
}

export function InputField({
  maxSizeInMb,
  setImageFile,
  inputRef,
  fileTypes,
}: IInputFieldProps) {
  const handleSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
    const maxSizeInBytes = maxSizeInMb * 1000000;
    if (event.target.files !== null) {
      if (event.target.files[0].size < maxSizeInBytes) {
        setImageFile(event.target.files[0]);
      } else {
        inputRef.current.value = null;
        console.log("error received");
      }
    }
  };

  return (
    <div>
      <Input
        className="w-100"
        type="file"
        id="picture"
        accept={fileTypes}
        onChange={(event) => handleSelectedFile(event)}
        ref={inputRef}
      />
    </div>
  );
}

export interface IDisplayFileProps {
  file: File | undefined;
  fileRef: React.MutableRefObject<any>;
  setImageFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  handleUpload: (file: File) => void;
}

export function DisplayFile({
  file,
  fileRef,
  setImageFile,
  handleUpload,
}: IDisplayFileProps) {
  const [progressUpload, setProgressUpload] = useState(0);

  const handleRemove = () => {
    fileRef.current.value = null;
    setImageFile(undefined);
  };

  return (
    <div>
      {file && (
        <Card className="mt-5">
          <CardContent>
            {file && (
              <>
                <Image
                  className="m-auto"
                  src={URL.createObjectURL(file)}
                  alt="selected image"
                  // style={{ width: 200, height: 200, objectFit: "cover" }}
                  width={500}
                  height={500}
                />
              </>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={handleRemove}>
              Remove
            </Button>
            <Button onClick={() => handleUpload(file)}>Upload</Button>
          </CardFooter>
          <Progress value={progressUpload} />
        </Card>
      )}
    </div>
  );
}
