"use client";

import Image from "next/image";
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
import { Upload } from "@/components/Upload";

export default function Home() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");
  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          console.log(url);
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);
  console.log(process.env.NEXT_PUBLIC_STORAGE_BUCKET);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Upload />
      <div className="App">
        <input
          type="file"
          onChange={(event) => {
            setImageUpload(event.target.files[0]);
          }}
        />
        <button onClick={uploadFile}> Upload Image</button>
        {imageUrls.map((url) => {
          return (
            // <div key={url}>{url}</div>
            <Image alt="image" src={url} key={url} width={500} height={500} />
          );
        })}
      </div>
      <Toaster />
    </main>
  );
}
