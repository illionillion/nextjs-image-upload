import { Box, Container, FormLabel, Heading, Image, Input, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { Swiper, SwiperSlide } from 'swiper/react' //カルーセル用のタグをインポート
import SwiperCore, { Pagination, Navigation } from 'swiper' //使いたい機能をインポート
import 'swiper/css'
import 'swiper/css/navigation'; // スタイルをインポート
import 'swiper/css/pagination'; // スタイルをインポート

const Home: NextPage = () => {

  const [images, setImages] = useState<File[]>([])
  const inputFileRef = useRef<HTMLInputElement>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("送信");
    console.dir(inputFileRef.current?.files);
    
  };

  const onDrop:DropzoneOptions['onDrop'] = (acceptedFiles) => {
      // Do something with the files
      console.log('acceptedFiles:', acceptedFiles);
  }

  const handleOnAddImage = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		// setImages([...images, ...e.target.files]);
		setImages([...e.target.files]);
	};

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop });

  const files = useMemo(() => 
        acceptedFiles.map(file => (
            <ListItem key={file.name}>
                {file.name}
            </ListItem>
        )
    ), [acceptedFiles]);
  
  return (
    <Container pt="10">
      <Heading>Image Form</Heading>
      <form onSubmit={onSubmit}>
        <FormLabel htmlFor="postName">名前</FormLabel>
        <Input type="text" id="postName" placeholder="Name" size="lg" />
        <FormLabel htmlFor="postImages">画像</FormLabel>
        {/* <Box w="full" h="20" border="1px dashed #888" textAlign="center" alignItems="center" {...getRootProps()}> */}
          {/* <input */}
          <Input
            type="file"
            id="postImages"
            multiple
            accept="image/*,.png,.jpg,.jpeg,.gif"
            onChange={e => {handleOnAddImage(e)}}
            ref={inputFileRef}
            // {...getInputProps()}
          />
          {/* {<Text>画像をドラッグ&ドロップ</Text>} */}
        {/* </Box> */}

        <Input type="submit" value="送信" margin="10px auto" variant="filled"/>
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
              <Image src={URL.createObjectURL(image)} w="full" />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <UnorderedList>
          {files}
        </UnorderedList> */}
      </Container>
    </Container>
  );
};

export default Home;
