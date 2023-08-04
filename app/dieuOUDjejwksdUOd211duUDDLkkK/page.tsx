"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "@/firebase";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { saveAs } from "file-saver";

export interface IImagesListProps {}

export default function ImagesList(props: IImagesListProps) {
  const [imageUrls, setImageUrls] = useState([]);
  const imagesListRef = ref(storage, "images/");

  const handleDownloa = () => {
    console.log("downloading");
  };

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      {imageUrls.map((url) => {
        return (
          <Card key={url} className="mt-10">
            <CardContent>
              <Image alt="image" src={url} key={url} width={500} height={500} />
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={handleDownloa}>Download</Button>
              <FirebaseImageDownloadButton imagePath={url} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

// interface ImageDownloadButtonProps {
//   imageUrl: string;
// }

// const ImageDownloadButton: React.FC<ImageDownloadButtonProps> = ({
//   imageUrl,
// }) => {
//   const handleDownload = async () => {
//     try {
//       const response = await axios.get(imageUrl, {
//         responseType: "blob", // Important for downloading binary files
//       });

//       const blob = new Blob([response.data], { type: "image/png" }); // Adjust the MIME type accordingly

//       // Extract the image file name from the URL (you may need to adjust this based on your URL structure)
//       const urlParts = imageUrl.split("/");
//       const fileName = urlParts[urlParts.length - 1];

//       saveAs(blob, fileName);
//     } catch (error) {
//       console.error("Error while downloading the image:", error);
//     }
//   };

//   return <button onClick={handleDownload}>Download Image</button>;
// };

// import firebase from 'firebase/app';
// import 'firebase/storage';

interface FirebaseImageDownloadButtonProps {
  imagePath: string;
}

const FirebaseImageDownloadButton: React.FC<
  FirebaseImageDownloadButtonProps
> = ({ imagePath }) => {
  const handleDownload = async () => {
    try {
      const storageRef = ref(storage, imagePath);
      const imageFile = await getDownloadURL(storageRef);

      // Fetch the image data
      const response = await fetch(imageFile);
      const blob = await response.blob();

      // Extract the image file name from the path (you may need to adjust this based on your path structure)
      const fileName = imagePath.split("/").pop();

      saveAs(blob, fileName || "downloaded_image.png");
    } catch (error) {
      console.error("Error while downloading the image:", error);
    }
  };

  return <button onClick={handleDownload}>Download Image</button>;
};
