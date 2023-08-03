"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "@/firebase";
import { v4 } from "uuid";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
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
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgressUpload(progress);
          console.log("Upload is " + progress + "% done");
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
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
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

  // const imagesListRef = ref(storage, "images/");
  // const uploadFile = () => {
  //   if (imageUpload == null) return;
  //   const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
  //   uploadBytes(imageRef, imageUpload).then((snapshot) => {
  //     getDownloadURL(snapshot.ref).then((url) => {
  //       setImageUrls((prev) => [...prev, url]);
  //     });
  //   });
  // };

  // useEffect(() => {
  //   listAll(imagesListRef).then((response) => {
  //     response.items.forEach((item) => {
  //       getDownloadURL(item).then((url) => {
  //         setImageUrls((prev) => [...prev, url]);
  //       });
  //     });
  //   });
  // }, []);
  console.log(process.env.NEXT_PUBLIC_STORAGE_BUCKET);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="App">
        <Input
          type="file"
          id="picture"
          accept="image/png"
          onChange={(files) => handleSelectedFile(files.target.files)}
        />
        <Card className="mt-5">
          {/* <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader> */}
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
                {/* <p>{downloadURL}</p> */}
              </>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline">Remove</Button>
            <Button onClick={handleUploadFile}>Upload</Button>
          </CardFooter>
          <Progress value={progressUpload} />
        </Card>
        {/* <Button onClick={uploadFile}> Upload Image</Button> */}
        {imageUrls.map((url) => {
          return <Image src={url} alt="image" key={url} />;
        })}
      </div>
      <Toaster />
    </main>
  );
}
