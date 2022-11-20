import { Box, Container, FormLabel, Heading, Image, Input } from "@chakra-ui/react";
import type { NextPage } from "next";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react"; //カルーセル用のタグをインポート
import { Pagination, Navigation } from "swiper"; //使いたい機能をインポート
import "swiper/css";
import "swiper/css/navigation"; // スタイルをインポート
import "swiper/css/pagination"; // スタイルをインポート
import path from "path";
import fsPromises from "fs/promises";

// JSONデータを取得したい

type PropsData = {
  data: ImagesData[];
};
type ImagesData = {
  id: number;
  imageName: string;
  imagePath: string;
};
type SaveData = {
  id: number;
  titleName: string;
  images: ImagesData[];
};

const UploadList: NextPage = (props) => {
//   console.log(props.data.length);
  console.log(props);

//   @ts-ignore
  return <>{props.data.map((val, index) => (
    <Box key={index}>
        {/* {JSON.stringify(val)} */}
        {/* {val.id} */}
        {val.titleName}
        {/* @ts-ignore */}
        {val.images.map((val, index) => (
            <Image key={index} src={val.path} />
        ))}
    </Box>
  ))}</>;
//   return <></>;
};

export default UploadList;

export const getStaticProps = async () => {
  const data = await fsPromises.readFile("./public/db.json", {
    encoding: "utf-8",
  });
  console.log(data);
  const objectData = { data: JSON.parse(data) };

  return {
    props: objectData,
  };
};
