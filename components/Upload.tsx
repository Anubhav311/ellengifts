import React, { ChangeEvent, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";

export interface IUploadProps {}

export function Upload(props: IUploadProps) {
  const [imageFile, setImageFile] = useState<File>();
  const [downloadURL, setDownloadURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);
  const inputRef = useRef(null);
  const { toast } = useToast();

  const handleSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files[0].size < 10000000) {
      setImageFile(event.target.files[0]);
    } else {
      inputRef.current.value = null;
      toast({
        title: "Image size is too big",
        description: "The image should be less than 10 MB",
      });
    }
  };

  const handleUploadFile = () => {
    if (imageFile) {
      const name = imageFile.name;
      const storageRef = ref(storage, `images/${name}g`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

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
            setDownloadURL(downloadURL);
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
    inputRef.current.value = null;
    setImageFile(undefined);
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

      {imageFile && (
        <Card className="mt-5">
          <CardContent>
            {imageFile && (
              <>
                <Image
                  className="m-auto"
                  src={URL.createObjectURL(imageFile)}
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
