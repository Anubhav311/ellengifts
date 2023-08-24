"use client";

import { Toaster } from "@/components/ui/toaster";
import { Upload } from "@/lib/upload/index";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();

  const handleUploadFile = (file: File) => {
    if (file) {
      const name = file.name;
      const storageRef = ref(storage, `images/${name}g`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          // setProgressUpload(progress);

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Upload
        maxSizeInMb={10}
        fileTypes="image/png,image/jpg"
        handleUpload={handleUploadFile}
      />
      <Toaster />
    </main>
  );
}
