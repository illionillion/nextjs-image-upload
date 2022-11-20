import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";

// これ必要なことに気づかなかった↓
export const config = {
  api: {
    bodyParser: false,
  },
};
type Data = {
  msg?: string;
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") return;

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

  const saveData: SaveData = {
    id: 0,
    titleName: "",
    images: [],
  };

  const form = formidable({ multiples: true, uploadDir: __dirname });

  form.onPart = (part) => {
    // let formidable handle only non-file parts
    if (part.originalFilename === "" || !part.mimetype) {
      // used internally, please do not override!
      form._handlePart(part);
    } else if (part.originalFilename) {
      console.log(part.name);
      if (!existsSync("./public/images/")) {
        mkdirSync("./public/images/");
      }
      const path =
        "./public/images/" + new Date().getTime() + part.originalFilename;
      const stream = createWriteStream(path);
      part.pipe(stream);

      part.on("end", () => {
        console.log(part.originalFilename + " is uploaded");

        const imagesData: ImagesData = {
          id: saveData.images.length,
          imageName: part.originalFilename || path,
          imagePath: path,
        };

        saveData.images.push(imagesData);

        stream.close();
      });
    }
  };

  form.on("field", (name, value) => {
    console.log(name);
    console.log(value);
    saveData.titleName = value;
  });

  form.once("end", () => {
    // console.log(' prosecc is end');

    if (!existsSync("./public/db.json")) {
      writeFileSync("./public/db.json", JSON.stringify([]), {
        encoding: "utf-8",
      });
    }

    // データの保存
    const getData = readFileSync("./public/db.json", { encoding: "utf-8" });
    // console.log(getData);
    const newData: SaveData[] = JSON.parse(getData);
    saveData.id = newData.length;
    newData.push(saveData);
    writeFileSync("./public/db.json", JSON.stringify(newData), {
      encoding: "utf-8",
    });
  });

  form.parse(req); // どっち？
  // form.parse(req, async (err, fields, files) => {
  //   console.log("fields:", fields); // { name: '*'}
  //   console.log("files:", files); // {}

  //   res.status(200).json({ name: "!!!" });
  // });
  res.status(200).json({ msg: "success!!" });
}
