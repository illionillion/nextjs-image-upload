import {
  Button,
  Center,
  Container,
  Heading,
  Image,
  Link,
} from "@chakra-ui/react";
import type { GetStaticProps } from "next";
import { Swiper, SwiperSlide } from "swiper/react"; //カルーセル用のタグをインポート
import { Pagination, Navigation } from "swiper"; //使いたい機能をインポート
import "swiper/css";
import "swiper/css/navigation"; // スタイルをインポート
import "swiper/css/pagination"; // スタイルをインポート
import fsPromises from "fs/promises";
import { SaveData } from "./api/upload";
import Head from "next/head";

type PropsData = {
  data: SaveData[];
};

const UploadList: React.FC<PropsData> = ({ data }) => {
  console.log(data);

  const deleteHandler = async (id: number) => {
    console.log(id);
    const req = await fetch(`/api/delete`, {
      method: 'POST',
      body: id.toString()
    })

    if (req.status === 200) {
      window.location.reload()
    }
  }

  return (
    <Container>
      <Head>
        <title>画像一覧</title>
      </Head>
      <Heading>画像一覧</Heading>
      {data.map((val, index) => (
        <Container key={index} pt={5} borderBottom="1px solid">
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
          <Center padding={3}>
            <Button w="44" colorScheme="red" onClick={() => deleteHandler(val.id)}>削除</Button>
          </Center>
        </Container>
      ))}
      <Link href="/" color="blue.600">
        投稿ページへ
      </Link>
    </Container>
  );
};

export default UploadList;

export const getStaticProps: GetStaticProps<PropsData> = async () => {
  const data = await fsPromises.readFile("./public/db.json", {
    encoding: "utf-8",
  });
  console.log(data);
  const objectData: PropsData = { data: JSON.parse(data) };

  return {
    props: objectData,
  };
};
