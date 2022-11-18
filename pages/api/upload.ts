import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
type Data = {
  name: string;
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // console.log(req.body);
  if (req.method !== "POST") return;

  const form = new formidable.IncomingForm();

  form.parse(req, async function (err, fields, files) {
    if (err) {
      res.status(500).end();
      // res.json({
      //   method: req.method,
      //   error: err
      // });
      // res.end();
      return;
    }
    // const file = files.file;
    console.log(req.body);
    console.log(files);
    

    res.status(200).json({ name: "!!!" });
  })
}
