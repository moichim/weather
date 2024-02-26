import path from "path";
import fs, { readdirSync } from "fs";

const getRootPath = () => path.normalize("./public/samples");
const getRootUrl = () => "/samples";

const getScopePath = (
    scope: string,
    relative: string = ""
) => {
    return path.resolve(path.join(getRootPath(), scope, relative));
}

export const getScopeFolders = (
    scope: string
) => {
    return fs
        .readdirSync(getScopePath(scope))
        .filter(folder => {
            return fs.lstatSync(path.resolve(path.join(getScopePath(scope), folder))).isDirectory();
        })
        .map(folder => {
            return {
                path: path.resolve(path.join(getScopePath(scope), folder)),
                folder: folder
            };
        });

}

const getScopeFoldersIndex = (scope: string) => Object.fromEntries(
    getScopeFolders(scope).map(s => [s.folder, s.path])
);

const getScopeFolderInfo = (scope: string, folder: string): {
    name: string,
    description?: string
} => {
    const filePath = path.join(getScopePath(scope, folder), "_info.json");
    const raw = fs.readFileSync(filePath);
    return JSON.parse( raw.toString() );
}

const isScopeFolder = (scope: string, folder: string) => Object
    .keys(getScopeFoldersIndex(scope))
    .includes(folder);

export const getScopeFolderContent = (
    scope: string,
    folder: string
) => {

    if (!isScopeFolder(scope, folder)) {
        return undefined;
    }

    const scopePath = getScopePath(scope, folder);
    const content = fs.readdirSync(scopePath);

    const response = content
        .filter(file => {

            const filePath = path.join(scopePath, file);
            const stats = fs.lstatSync(filePath);

            return stats.isFile() && filePath.endsWith("lrc");

        })
        .map(file => {

            const url = [
                getRootUrl(),
                scope,
                folder,
                file
            ].join("/");

            const visuUrl = url
                .replace(".lrc", ".png")
                .replace("image-thermal", "image-visual");


            const timeString = file
                .replace("image-thermal ", "")
                .replace(".lrc", "");

            const dateObject = new Date();

            const [
                date,
                time
            ] = timeString.split(" ");

            const d = date.split("-");
            dateObject.setUTCFullYear(parseInt(d[0]));
            dateObject.setUTCMonth(parseInt(d[1]));
            dateObject.setUTCDate(parseInt(d[2]));

            const t = time.split("-");
            dateObject.setUTCHours(parseInt(t[0]));
            dateObject.setUTCMinutes(parseInt(t[1]));
            dateObject.setUTCSeconds(parseInt(t[2]));

            const result = {
                filename: file,
                timestamp: dateObject.getTime(),
                ir: url,
                visu: visuUrl
            }

            return result;

        });

    return response;

}

export const getScopeContent = (
    scope: string
) => {

    return getScopeFolders(scope).map(folder => {

        const info = getScopeFolderInfo(scope, folder.folder);
        return {
            id: folder.folder,
            name: info.name,
            description: info.description,
            files: getScopeFolderContent(scope, folder.folder)
        }
    })

}