import {
  Box,
  Center,
  Container,
  FormLabel,
  Heading,
  Image,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { FormEvent, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react"; //カルーセル用のタグをインポート
import { Pagination, Navigation } from "swiper"; //使いたい機能をインポート
import "swiper/css";
import "swiper/css/navigation"; // スタイルをインポート
import "swiper/css/pagination"; // スタイルをインポート
import Head from "next/head";
import { DropzoneOptions, useDropzone } from "react-dropzone";

const Home: NextPage = () => {
  const [images, setImages] = useState<Blob[]>([]);
  const inputNameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(images.length === 0) return
    console.log("送信");

    const name = inputNameRef.current?.value;

    const formData = new FormData();

    for await (const [i, v] of Object.entries(images)) {
      formData.append("files", v);
    }
    formData.append("name", name || "");

    const post = await fetch(`/api/upload`, {
      method: "POST",
      body: formData,
    });

    console.log(await post.json());
    if (post.status === 200) {
      formRef.current?.reset();
      setImages([]);
    }
  };

  /**
   * ファイルドロップ時
   */
  const onDrop: DropzoneOptions["onDrop"] = (acceptedFiles, fileRejections) => {
    console.log(acceptedFiles);
    console.log(fileRejections);
    setImages(acceptedFiles);
  };
  /**
   * ドロップゾーン
   */
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/gif": [],
    },
  });

  return (
    <Container pt="10">
      <Head>
        <title>投稿フォーム</title>
      </Head>
      <Heading>Image Form</Heading>
      <form onSubmit={onSubmit} encType="multipart/form-data" ref={formRef}>
        <FormLabel htmlFor="postName">名前</FormLabel>
        <Input
          type="text"
          id="postName"
          placeholder="Name"
          size="lg"
          required
          ref={inputNameRef}
        />
        <FormLabel htmlFor="postImages">画像</FormLabel>
        <Box
          {...getRootProps()}
          h="40"
          border="2px dashed"
          borderColor="lightgray"
          color="darkgray"
          background="main.bg"
          position="relative"
        >
          <input {...getInputProps()} />
          <Center as="label" flexDirection="column" w="full" h="full" gap={1}>
            <Text>ファイルをここにドラッグアンドドロップするか</Text>
            <Text>クリックしてファイルを選択してください</Text>
          </Center>
        </Box>
        <Input type="submit" value="送信" margin="10px auto" variant="filled" />
      </form>
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
          {images.map((image, i) => (
            <SwiperSlide key={i}>
              <Image
                src={URL.createObjectURL(image)}
                w="full"
                h="40vw"
                objectFit="cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
      <Link href="/uploads" color="blue.600">
        一覧ページへ
      </Link>
    </Container>
  );
};

export default Home;
