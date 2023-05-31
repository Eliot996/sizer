import dotenv from "dotenv/config"
import { ShareServiceClient, StorageSharedKeyCredential } from "@azure/storage-file-share";
import fs from "fs";

// Enter your storage account name and shared key
const account = process.env.FILESTORAGE_USERNAME;
const accountKey = process.env.FILESTORAGE_KEY;

// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
const credential = new StorageSharedKeyCredential(account, accountKey);
const serviceClient = new ShareServiceClient(
  // When using AnonymousCredential, following url should include a valid SAS
  `https://${account}.file.core.windows.net`,
  credential
);

const shoeShareName = "shoestorage";
const footShareName = "footstorage";

const shoeShare = serviceClient.getShareClient(shoeShareName);
const footShare = serviceClient.getShareClient(footShareName);

async function main() {
    let shareIter = serviceClient.listShares();
    let i = 1;
    for await (const share of shareIter) {
      console.log(`Share${i}: ${share.name}`);
      i++;
    }
  }

  async function createShare(name) {
    const shareName = name || new Date().getTime();
    const shareClient = serviceClient.getShareClient(shareName);
    await shareClient.create();
    console.log(`Create share ${shareName} successfully`);
  }

  async function createDirectory(name) {
    const shareClient = shoeShare;
    const directoryName = name || new Date().getTime();
    const directoryClient = shareClient.getDirectoryClient(directoryName);
    await directoryClient.create();
    console.log(`Create directory ${directoryName} successfully`);
  }

  async function uploadFile(shareName, directoryName, file) {
    const directoryClient = serviceClient.getShareClient(shareName).getDirectoryClient(directoryName);
  
    const content    = fs.readFileSync(process.cwd() + "/tmp/uploads/" + file);
    const fileClient = directoryClient.getFileClient(file);
    await fileClient.create(content.byteLength);
    console.log(`Create file ${file} successfully`);
  
    // Upload file range
    await fileClient.uploadRange(content, 0, content.byteLength);
    console.log(`Upload file range "${content.byteLength}" to ${file} successfully`);
  }

async function listFiles(shareName, directoryName) {
const directoryClient = serviceClient
    .getShareClient(shareName)
    .getDirectoryClient(directoryName);

let dirIter = directoryClient.listFilesAndDirectories();
let i = 1;
for await (const item of dirIter) {
    if (item.kind === "directory") {
    console.log(`${i} - directory\t: ${item.name}`);
    } else {
    console.log(`${i} - file\t: ${item.name}`);
    }
    i++;
    }
}

async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on("end", () => {
        resolve(Buffer.concat(chunks));
        });
        readableStream.on("error", reject);
    });
}

async function downloadFile(shareName, directoryName, fileName) {
    const fileClient = serviceClient
        .getShareClient(shareName)
        .getDirectoryClient(directoryName)
        .getFileClient(fileName);

    const downloadFileResponse = await fileClient.download();
    fs.writeFileSync(process.cwd() + "/tmp/downloads/" + fileName, await streamToBuffer(downloadFileResponse.readableStreamBody));
}





async function makeDirectoryClientFromPathArray(path, shareClient) {
  let directoryClient = shareClient;

  for(let elem of path) {
    directoryClient = directoryClient.getDirectoryClient(elem);
    try {
      await directoryClient.create()
    } catch (e) {

    }
  }
}

async function uploadShoeImage(path, image) {
  let directoryClient = await makeDirectoryClientFromPathArray(path, shoeShare);

  const content = fs.readFileSync(process.cwd() + "/" + image.path);
  const fileClient = directoryClient.getFileClient(image.filename);
  await fileClient.create(content.byteLength);

  await fileClient.uploadRange(content, 0, content.byteLength);
  fs.unlink(process.cwd() + "/" + image.path, (err) => {if (err) throw err});

  return true;
}

async function downloadShoeImage(path, fileName) {
  let directoryClient = shoeShare;

  for(let elem of path) {
    directoryClient = directoryClient.getDirectoryClient(elem);
  }
  const fileClient = directoryClient.getFileClient(fileName)

  const downloadFileResponse = await fileClient.download();
  fs.writeFileSync(process.cwd() + "/tmp/downloads/" + fileName, await streamToBuffer(downloadFileResponse.readableStreamBody));
}

  //createShare("footstorage");
  //createDirectory("newshare1685266773191", "help")
  //uploadFile("newshare1685266773191", "newdirectoryhelp", "1685467414054-113661764.png")
  //listFiles("newshare1685266773191", "newdirectoryhelp");
  //downloadFile("newshare1685266773191", "newdirectoryhelp", "1685467414054-113661764.png");
  
  //main();


  export default {downloadFile, uploadFile, uploadShoeImage, downloadShoeImage}