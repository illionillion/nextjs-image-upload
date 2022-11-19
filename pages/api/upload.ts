import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { createWriteStream } from "fs";

// これ必要なことに気づかなかった↓
export const config = {
  api: {
    bodyParser: false,
  },
};
type Data = {
  name: string;
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") return;

  const form = formidable({ multiples: true, uploadDir: __dirname });

  form.onPart = (part) => {
    
    // let formidable handle only non-file parts
    if (part.originalFilename === "" || !part.mimetype) {
      // used internally, please do not override!
      form._handlePart(part);
    } else if (part.originalFilename) {
      
      console.log(part.name);
      const path =
        "./public/images/" + new Date().getTime() + part.originalFilename;
      const stream = createWriteStream(path);
      part.pipe(stream);

      part.on("end", () => {
        console.log(part.originalFilename + " is uploaded");
        stream.close();
      });

    }
  };

  form.on('field', (name, value) => {
    console.log(name);
    console.log(value);
  })

  form.parse(req) // どっち？
  // form.parse(req, async (err, fields, files) => {
  //   console.log("fields:", fields); // { name: '*'}
  //   console.log("files:", files); // {}

  //   res.status(200).json({ name: "!!!" });
  // });
  res.status(200).json({ name: "!!!" });
}
