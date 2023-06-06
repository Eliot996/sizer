/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import dotenv from "dotenv/config";
import {
    ShareServiceClient,
    StorageSharedKeyCredential,
} from "@azure/storage-file-share";
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

async function makeDirectoryClientFromPathArray(path, shareClient) {
    let directoryClient = shareClient;

    for (let elem of path) {
        directoryClient = await directoryClient.getDirectoryClient(elem);

        if (!(await directoryClient.exists())) {
            try {
                await directoryClient.create();
            } catch (e) {
                throw new Error("directory failed create:", e);
            }
        }
    }
    return directoryClient;
}

async function uploadShoeImage(path, image) {
    if (!image) {
        console.error("image not found", image);
        return;
    }

    const share = serviceClient.getShareClient(shoeShareName);
    let directoryClient = await makeDirectoryClientFromPathArray(path, share);

    const content = fs.readFileSync(process.cwd() + "/" + image.path);
    const fileClient = await directoryClient.getFileClient(image.filename);
    await fileClient.create(content.byteLength);

    await fileClient.uploadRange(content, 0, content.byteLength);
    fs.unlink(process.cwd() + "/" + image.path, (err) => { if (err) throw err; });

    return true;
}

async function downloadShoeImage(path, fileName) {
    const shareClient = serviceClient.getShareClient(shoeShareName);

    const directoryClientBrand = shareClient.getDirectoryClient(path[0]);
    if (!(await directoryClientBrand.exists())) {
        console.error("brand directory not found", path[0]);
        return;
    }

    const directoryClientName = directoryClientBrand.getDirectoryClient(path[1]);
    if (!(await directoryClientName.exists())) {
        console.error("name directory not found", path[1]);
        return;
    }

    const directoryClientSize = directoryClientName.getDirectoryClient(path[2]);
    if (!(await directoryClientSize.exists())) {
        console.error("size directory not found", path[2]);
        return;
    }

    const fileClient = directoryClientSize.getFileClient(fileName);

    try {
        const downloadFileResponse = await fileClient.download();
        fs.writeFileSync(
            process.cwd() + "/tmp/downloads/" + fileName,
            await streamToBuffer(downloadFileResponse.readableStreamBody)
        );
    } catch (error) {
        console.error("error happend", error);
    }
}

async function deleteShoeImage(path, fileName) {
    const shareClient = serviceClient.getShareClient(shoeShareName);

    const directoryClient = await makeDirectoryClientFromPathArray(
        path,
        shareClient
    );

    const fileClient = directoryClient.getFileClient(fileName);

    await fileClient.delete();
}

async function downloadFootImage(userID, fileName) {
    const shareClient = serviceClient.getShareClient(footShareName);

    const directoryClient = shareClient.getDirectoryClient(String(userID));
    if (!(await directoryClient.exists())) {
        console.error("user directory not found", userID);
        return;
    }

    const fileClient = directoryClient.getFileClient(fileName);

    try {
        const downloadFileResponse = await fileClient.download();
        fs.writeFileSync(
            process.cwd() + "/tmp/downloads/" + fileName,
            await streamToBuffer(downloadFileResponse.readableStreamBody)
        );
    } catch (error) {
        console.error("error happend", error);
    }
}

async function uploadFootImage(userID, image) {
    if (!image) {
        console.error("image not found", image);
        return;
    }

    const share = serviceClient.getShareClient(footShareName);
    const directoryClient = share.getDirectoryClient(String(userID));

    if (!(await directoryClient.exists())) {
        try {
            await directoryClient.create();
        } catch (e) {
            console.error("directory failed create:", e);
        }
    }

    const content = fs.readFileSync(process.cwd() + "/" + image.path);
    const fileClient = directoryClient.getFileClient(image.filename);
    await fileClient.create(content.byteLength);

    await fileClient.uploadRange(content, 0, content.byteLength);
    fs.unlink(process.cwd() + "/" + image.path, (err) => { if (err) throw err; });

    return true;
}

async function deleteFootImage(userID, fileName) {
    const shareClient = serviceClient.getShareClient(footShareName);

    const directoryClient = shareClient.getDirectoryClient(String(userID));
    if (!(await directoryClient.exists())) {
        console.error("user directory not found", userID);
        return;
    }

    const fileClient = directoryClient.getFileClient(fileName);

    await fileClient.delete();
}

export default {
    uploadShoeImage,
    downloadShoeImage,
    deleteShoeImage,
    downloadFootImage,
    uploadFootImage,
    deleteFootImage,
};