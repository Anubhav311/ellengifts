import React, { ChangeEvent, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";

export interface IUploadProps {
  maxSizeInMb: number;
}

export function Upload(props: IUploadProps) {
  const [imageFile, setImageFile] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);
  const { toast } = useToast();
  const { maxSizeInMb } = props;

  const handleSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
    const maxSizeInBytes = maxSizeInMb * 1000000;
    if (event.target.files[0].size < maxSizeInBytes) {
      setImageFile(event.target.files[0]);
    } else {
      inputRef.current.value = null;
      toast({
        title: "Image size is too big",
        description: "The image should be less than 10 MB",
      });
    }
  };

  return (
    <div className="App">
      <Input
        type="file"
        id="picture"
        accept="image/png"
        onChange={(event) => handleSelectedFile(event)}
        ref={inputRef}
      />
      <DisplayFile
        file={imageFile}
        fileRef={inputRef}
        setImageFile={setImageFile}
      />
    </div>
  );
}

export interface IDisplayFileProps {
  file: File;
  fileRef: React.MutableRefObject<any>;
  setImageFile: React.Dispatch<React.SetStateAction<File>>;
}

export function DisplayFile(props: IDisplayFileProps) {
  const [progressUpload, setProgressUpload] = useState(0);
  const { toast } = useToast();
  const { file, fileRef, setImageFile } = props;

  const handleUploadFile = () => {
    if (file) {
      const name = file.name;
      const storageRef = ref(storage, `images/${name}g`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgressUpload(progress);

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          toast({
            title: "Error",
            description: error.message,
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            toast({
              title: "Image Uploaded Successfully",
              description: "You can close the window now",
            });
          });
        }
      );
    } else {
      toast({
        title: "File not uploaded",
        description: "something went wrong while uploading the ifle",
      });
    }
  };

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
            <Button onClick={handleUploadFile}>Upload</Button>
          </CardFooter>
          <Progress value={progressUpload} />
        </Card>
      )}
    </div>
  );
}
