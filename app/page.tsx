"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
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

export default function Home() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageFile, setImageFile] = useState<File>();
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
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline">Remove</Button>
            <Button onClick={handleUploadFile}>Upload</Button>
          </CardFooter>
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
