import {
  Box,
  Container,
  FormLabel,
  Heading,
  Image,
  Input,
  Link,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { Swiper, SwiperSlide } from "swiper/react"; //カルーセル用のタグをインポート
import { Pagination, Navigation } from "swiper"; //使いたい機能をインポート
import "swiper/css";
import "swiper/css/navigation"; // スタイルをインポート
import "swiper/css/pagination"; // スタイルをインポート
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
  console.log(props);

  return (
    <Container>
      <Heading>画像一覧</Heading>
      {/* @ts-ignore */}
      {props.data.map((val, index) => (
        <Container key={index} pt={5} >
          {/* {val.id} */}
          <Heading as="h2">{val.titleName}</Heading>
          <Container>
            <Swiper
              slidesPerView={1} //一度に表示するスライドの数
              modules={[Navigation, Pagination]}
              pagination={{
                clickable: true,
              }} //　何枚目のスライドかを示すアイコン、スライドの下の方にある
              navigation //スライドを前後させるためのボタン、スライドの左右にある
              loop={true}
            >
              {/* @ts-ignore */}
              {val.images.map((image, i) => (
                <SwiperSlide key={i}>
                  <Image
                    src={image.imagePath}
                    w="full"
                    h="40vw"
                    objectFit="cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Container>
        </Container>
      ))}
      <Link href="/" color="blue.600">投稿ページへ</Link>
    </Container>
  );
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
