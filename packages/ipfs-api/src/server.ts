import cors from "cors";
import express, { Request, Response } from "express";
import fs from "fs";
import got from "got";
import { extension as toExtension } from "mime-types";
import { Collection } from "mongodb";
import { API_HOSTNAME, API_PORT, MONGO_CONNECTIONSTRING, MONGO_DBNAME, UPLOAD_PATH } from "./consts";
import { MongoDB } from "./mongodb";
import { IRecord } from "./types";
import { contentType, download, extractArchive, isDirectory, uploadDirectory, uploadFile } from "./utils";

require("dotenv").config();

(async () => {
  // create the database connection
  console.log("creating database connection");
  const mongo = new MongoDB(MONGO_CONNECTIONSTRING, MONGO_DBNAME);
  await mongo.connect();

  // ensure the database model (ensureIndex will ensure the collection exists)
  console.log("ensuring database model");
  const recordsDB = await mongo.getCollection<IRecord>("records");
  await mongo.ensureIndex("records", "cid", { unique: true });
  // await recordsDB.deleteMany({});

  // create the server
  console.log("creating express server");
  const app = express();
  app.use(express.json());
  app.use(cors());

  // create the routes
  app.get("/ipfs/migrate/:cid", (req: Request, res: Response) => {
    return handleGetLink(req, res, recordsDB);
  });

  app.get("/ipfs/eth/dns-query/:name", async (req: Request, res: Response) => {
    try {
      console.log(`https://eth.link/dns-query?type=TXT&name=${req.params.name}`);

      const response = await got(`https://eth.link/dns-query?type=TXT&name=${req.params.name}`, {
        headers: { "content-type": "application/dns-json" },
      }).json();

      res.status(200).send(response);
    } catch (error) {
      console.log(error);

      res.status(400);
    }
  });

  // start the server
  app.listen(parseInt(API_PORT, 10), API_HOSTNAME, () => {
    console.log(`IPFS to Skynet API listening at ${API_HOSTNAME}:${API_PORT}`);
  });
})();

async function handleGetLink(req: Request, res: Response, recordsDB: Collection<IRecord>) {
  try {
    const { cid } = req.params;

    const record = await recordsDB.findOne({ cid });

    if (record && record.skylink) {
      res.status(200).send({ skylink: record.skylink });
      return;
    }

    // insert an empty record for the cid
    if (!record) {
      await recordsDB.insertOne({ cid, createdAt: new Date(), skylink: "" });
    }

    // reupload the cid and return the skylink
    const skylink = await reuploadFile(cid, recordsDB);
    res.status(200).send({ skylink });
    return;
  } catch (error) {
    console.log(error);

    res.status(500).send(error);
    return;
  }
}

async function reuploadFile(cid: string, recordsDB: Collection<IRecord>): Promise<string> {
  console.log('reuploading file with cid', cid)

  // get the content type
  const ct = await contentType(cid);
  const ext = toExtension(ct);
  console.log('extension found', ext)

  // find out whether it's a directory
  const isDir = await isDirectory(cid);
  console.log('is directory', isDir)

  // upload directory
  if (isDir) {
    // download cid as archive
    const tarPath = `${UPLOAD_PATH}/${cid}.tar`;
    await download(cid, tarPath, isDir);

    // untar the archive
    const dirPath = `${UPLOAD_PATH}/${cid}`;
    await extractArchive(tarPath, dirPath);

    // upload the directory
    const dirPathExtracted = `${UPLOAD_PATH}/${cid}/${cid}`;
    const skylink = await uploadDirectory(dirPathExtracted);

    // cleanup files
    fs.unlinkSync(tarPath);
    fs.rmSync(dirPath, { recursive: true });

    // update record
    await recordsDB.updateOne({ cid }, { $set: { skylink } });

    return skylink;
  }

  // download cid as file
  const filePath = `${UPLOAD_PATH}/${cid}.${ext}`;
  try {
    await download(cid, filePath, isDir);
  } catch (error) {
    console.log('download error: ', error)
    throw error;
  }

  // upload the file
  let skylink;
  try {
    skylink = await uploadFile(filePath);
  } catch (error) { 
    console.log('upload error: ', error)
    throw error;
  }

  // cleanup files
  fs.unlinkSync(filePath);

  // update record
  await recordsDB.updateOne({ cid }, { $set: { skylink } });

  return skylink;
}