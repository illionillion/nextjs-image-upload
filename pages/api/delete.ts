import { readFileSync, unlinkSync, writeFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { SaveData } from "./upload";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'POST') return
    console.log(req.body);
    // データの保存
    const getData: SaveData[] = JSON.parse(readFileSync("./public/db.json", { encoding: "utf-8" }));
    // 画像の削除
    const images = getData.find(item => item.id == req.body)?.images
    if (images) {
      for (const image of images) {
        unlinkSync("./public/" + image.imagePath)
      }
    }
    
    const newData: SaveData[] = getData.filter(item => item.id != req.body);
    
    writeFileSync("./public/db.json", JSON.stringify(newData), {
      encoding: "utf-8",
    });

    res.status(200).json({msg: 'delete'})
}
