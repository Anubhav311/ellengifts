"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "@/firebase";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
              {/* <Button variant="outline">Remove</Button> */}
              <Button onClick={handleDownloa}>Download</Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
