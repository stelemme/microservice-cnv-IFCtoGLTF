const path = require("path");
const fs = require("fs");
const cp = require("child_process");

const colladaToGltfGET = (req, res) => {
  res.status(200).json({
    supported_methods: ["GET", "POST"],
    POST_request_data: "application/collada+xml",
    POST_response_data: "model/gltf+json",
  });
};

const colladaToGltfPOST = async (req, res) => {
  let data = req.body;

  const fileName = `daeFile-${Date.now()}.ifc`;
  const baseFilesFolderPath = path.join("base-files");
  const filepath = path.join(baseFilesFolderPath, fileName);

  fs.writeFile(filepath, data, async (error) => {
    if (error) {
      console.error(error);
    } else {
      let result = await convert(filepath);

      const resultLocation = result[result.length - 1];
      fs.readFile(resultLocation, (err, data) => {
        if (err) {
          throw err;
        }
        res.status(200).send(data);
        result.forEach((f) => deleteFile(f));
      });
    }
  });
};

convert = async (file) => {
  return new Promise(async (resolve, reject) => {
    const modes = ["DAEtoGLTF"];
    let order = [];

    modes.forEach((mode) => {
      const { command, fileExtension } = switcher(mode, file);
      order.push({ command, mode, fileExtension });
    });

    let IfcPlaceholder = `${process.cwd()}/${file}`;
    let createdFiles = [IfcPlaceholder];

    try {
      for (const conversion of order) {
        console.log("converting to", conversion.mode.substring(5));
        console.log("conversion", conversion);
        const perform = await executeChildProcess(conversion.command);
        console.log(conversion.mode.substring(5), "done");
        const placeholder = `${process.cwd()}/${file}.${
          conversion.fileExtension
        }`;
        createdFiles.push(placeholder);
      }
    } catch (error) {
      reject(error);
    }

    resolve(createdFiles);
  });
};

const switcher = (originalUrl, base) => {
  let command, fileExtension;
  switch (originalUrl) {
    case "DAEtoGLTF":
      if (process.platform === "linux") {
        command = `${process.cwd()}/cli/COLLADA2GLTF-bin ${process.cwd()}/${base} ${process.cwd()}/${base}.gltf`;
      } else if (process.platform === "win32") {
        command = `${process.cwd()}/cli/COLLADA2GLTF-bin.exe ${process.cwd()}/${base} ${process.cwd()}/${base}.gltf`;
      }
      fileExtension = "gltf";
      break;
    default:
      break;
  }

  return { command, fileExtension };
};

const executeChildProcess = (cmd_exec) => {
  return new Promise((resolve, reject) => {
    let child = cp.exec(cmd_exec, { maxBuffer: 1024 * 1024 * 50 });
    child.on("exit", function (exit_code) {
      console.log("closed with exit code", exit_code);
      if (exit_code === 0) {
        resolve(exit_code);
      } else {
        reject(exit_code);
      }
    });
  });
};

const deleteFile = (path) => {
  try {
    fs.unlinkSync(path);
    console.log(path + " was deleted successfully");
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  colladaToGltfGET,
  colladaToGltfPOST,
};
