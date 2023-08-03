import React, { useState } from "react";
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
  const { toast } = useToast();

  const handleSelectedFile = (file: FileList) => {
    if (file[0].size < 100000000) {
      setImageFile(file[0]);
    } else {
      toast({
        title: "Scheduled: Catch up",
        description: "Friday, February 10, 2023 at 5:57 PM",
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

  return (
    <div className="App">
      <Input
        type="file"
        id="picture"
        accept="image/png"
        onChange={(files) => handleSelectedFile(files.target.files)}
      />
      <Card className="mt-5">
        <CardContent>
          {downloadURL && (
            <>
              <Image
                className="m-auto"
                src={downloadURL}
                alt={downloadURL}
                style={{ width: 200, height: 200, objectFit: "cover" }}
                width={500}
                height={500}
              />
            </>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="outline">Remove</Button>
          <Button onClick={handleUploadFile}>Upload</Button>
        </CardFooter>
        <Progress value={progressUpload} />
      </Card>
    </div>
  );
}
