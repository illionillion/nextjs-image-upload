import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs, { writeFileSync } from "fs";

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

  let files:any = {

  }

  form.onPart = (part) => {
    console.log(part.name);
    
    // let formidable handle only non-file parts
    if (part.originalFilename === '' || !part.mimetype) {
      // used internally, please do not override!
      form._handlePart(part);
    } else {
      
      part.on("data", (buffer) => {
        // do whatever you want here
        // console.log(buffer);
        files[part.name || ''] += buffer
        // stream.write(buffer)
      });
      const stream = fs.createWriteStream(__dirname + '/../../' + part.originalFilename);
      part.pipe(stream) // 動かない

      part.on('end',()=>{
        console.log(part.name  + ' is end');
        console.log(part.originalFilename + ' is end');
        // part.pipe()
        // console.log(files[part.name || '']);
        // stream.write(files[part.name || ''])
        // stream.end()
        stream.close()
        // writeFileSync(__dirname + '/../../' + part.originalFilename, files[part.name || ''] ) // なぜかwritefileできなかった
      })
    }
  };

  // 使わない？
  form.parse(req, async function (err, fields, files) {
    if (err) {
      res.status(500).json({ name: err });
      res.end();
      return;
    }
    console.log(fields);
    // console.log(files);

    Object.keys(files).forEach((i) => {
      // console.log(files[i]);
      console.log('parse' + i);
      
    });

    for await (const [i, v] of Object.entries(files)) {
      
    }

    res.status(200).json({ name: "!!!" });
  });
}
