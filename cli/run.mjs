import { esbuildDecorators } from "@anatine/esbuild-decorators";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import esbuild from "esbuild";
import process from "process";
import childProcess from "child_process";
import rimraf from "rimraf";
import path from "path";
import logger from "./logger.mjs";

export async function run({ entryPoint, outdir, format, outExtension }) {
  let fileName = path.basename(entryPoint);
  fileName = fileName.replace(path.extname(fileName), outExtension[".js"]);
  let outFile = path.resolve(outdir, fileName);

  logger.information(`Executing: ${outFile}`);

  await esbuild
    .build({
      plugins: [
        nodeExternalsPlugin(),
        esbuildDecorators({ tsconfig: "tsconfig.json" }),
      ],
      entryPoints: [entryPoint],
      bundle: true,
      outExtension,
      outdir,
      splitting: false,
      platform: "node",
      minify: true,
      format,
      sourcemap: false,
    })
    .catch(() => {
      process.exit(1);
    });

  childProcess
    .spawn("node", [outFile], { stdio: "inherit" })
    .on("error", () => {
      logger.error("X Encountered an error when executing. Exiting...");
      process.exit(1);
    })
    .on("exit", () => {
      rimraf.sync(outdir);
      logger.information("Exiting...");
      process.exit(0);
    });
}
