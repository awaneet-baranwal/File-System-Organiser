inputArray = process.argv.slice(2)
let fs = require("fs")
let path = require("path")
// node main.js tree "directoryPath"
// node main.js organise "directoryPath"
// node main.js help "directoryPath"
let types = {
    images: ["jpg","jpeg","png"],
    videos : ["mp4","mkv"],
    archives: ['zip','7z','rar','tar','ar','iso','xz'],
    documents: ['docx','doc','pdf','xlsx','xls','odt','ods','odp','odg','odf','txt','ps','tex'],
    app:['exe','dmg','pkg','deb']
}
let command = inputArray[0]
switch(command){
    case "tree":
        treeFn(inputArray[1])
        break
    case "organise":
        organiseFn(inputArray[1])
        break
    case "help":
        helpFn()
        
        break
    default:
        console.log("Please Enter valid command");
}

function treeFn(directoryPath){
    if(directoryPath == undefined){
        console.log("Kindly Enter the path");
        return
    }
    let destPath;
    let doesExist = fs.existsSync(directoryPath)
    if(doesExist){
        treeHelper(directoryPath)
    }else{
        console.log("Kindly Enter the correct path");
        return
    }
}
function treeHelper(directoryPath){   
}
function organiseFn(directoryPath){
    // console.log("Organise command implemented",directoryPath);
    // 1. input ---> directoryPath given
    if(directoryPath == undefined){
        console.log("Kindly Enter the path");
        return
    }
    let destPath;
    let doesExist = fs.existsSync(directoryPath)
    if(doesExist){
        // 2. create --> organisedFile --> directory
        destPath = path.join(directoryPath,"organised_file")
        if(fs.existsSync(destPath) == false){
            fs.mkdirSync(destPath);
        }
    }else{
        console.log("Kindly Enter the correct path");
    }
    organiseHelper(directoryPath,destPath);
    // 3. identify category of all the files present in that input directory ->
    // 4. copy/cut files to that organised directory inside of any of category folder
}
function organiseHelper(src,destPath){
    let filesName = fs.readdirSync(src)
    // console.log(filesName);
    for(let i=0; i<filesName.length; i++){
        let fileAddress = path.join(src,filesName[i])
        let isFile = fs.lstatSync(fileAddress).isFile();
        if(isFile){
            // console.log(filesName[i]);
            let category = getCategory(filesName[i])
            console.log(filesName[i], "belongs to ----> ", category);
            //4. copy/cut files to that organised directory inside of any of category folder
            sendFiles(fileAddress,destPath,category);
        } 
    }
}
function sendFiles(srcFilePath,destPath,category){
    let categoryPath = path.join(destPath,category)
    if(fs.existsSync(categoryPath)==false){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath,fileName);
    fs.copyFileSync(srcFilePath,destFilePath);
    fs.unlinkSync(srcFilePath)
    console.log(fileName, "copied to ",category);
}
function getCategory(fileName){
    let ext = path.extname(fileName)
    ext = ext.slice(1)
    for(let type in types){
        let cTypeArray = types[type];
        for(let i=0;i<cTypeArray.length;i++){
            if(ext == cTypeArray[i]){
                return type;
            }
        }
    }
    return "others";
}
function helpFn(){
    console.log(`
    List of command:
        node main.js tree "directoryPath"
        node main.js organise "directoryPath"
        node main.js help
    `);
}