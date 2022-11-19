import {
  Container,
  FormLabel,
  Heading,
  Image,
  Input,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react"; //カルーセル用のタグをインポート
import { Pagination, Navigation } from "swiper"; //使いたい機能をインポート
import "swiper/css";
import "swiper/css/navigation"; // スタイルをインポート
import "swiper/css/pagination"; // スタイルをインポート

const Home: NextPage = () => {
  const [images, setImages] = useState<Blob[]>([]);
  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("送信");

    const name = inputNameRef.current?.value

    const formData = new FormData();
    
    for await(const [i, v] of Object.entries(images)) {
      formData.append('files' , v);
    }
    formData.append("name", name || "");


    const post = await fetch(`${window.location.href}api/upload`, {
      method: "POST",
      body: formData,
    }); 

    console.log(await post.json());
  };

  const handleOnAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages([...e.target.files]);
  };

  return (
    <Container pt="10">
      <Heading>Image Form</Heading>
      <form onSubmit={onSubmit} encType='multipart/form-data'>
        <FormLabel htmlFor="postName">名前</FormLabel>
        <Input
          type="text"
          id="postName"
          placeholder="Name"
          size="lg"
          ref={inputNameRef}
        />
        <FormLabel htmlFor="postImages">画像</FormLabel>
        <Input
          type="file"
          id="postImages"
          multiple
          accept="image/*,.png,.jpg,.jpeg,.gif"
          onChange={handleOnAddImage}
          ref={inputFileRef}
        />
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
    </Container>
  );
};

export default Home;
