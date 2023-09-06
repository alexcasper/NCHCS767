var showdown = require('showdown')
var fs = require('fs')
const fetch = require('node-fetch')

require('dotenv').config();
const PAGE_TARGET = process.env.CANVAS_BASE+`/api/v1/courses/${process.env.CANVAS_COURSE_ID}/pages`
const MODULE_TARGET= process.env.CANVAS_BASE+`/api/v1/courses/${process.env.CANVAS_COURSE_ID}/modules`

function replaceEnv(txt,varsToUse='CANVAS_COURSE_') {
    const PREFIX = '$'
    const CC = Object.keys(process.env).filter(x => x.startsWith(varsToUse)).map(x => [PREFIX + x.replace(varsToUse, ''), process.env[x]])
    for (let item of CC) {
        txt =txt.replaceAll(item[0], item[1])
    }
    return txt
}

function actionFile(filename, targetFilename) {
    converter = new showdown.Converter()
    fs.readFile(filename, { 'encoding': 'utf8' }, async (err, txt) => {
        if (err) { console.log(err); } else { 
            writeFile(targetFilename, await replaceEnv(txt,'GITHUB_VALUE_'))
            let canvasTitle = targetFilename.split(['/']).slice(5,7).join('-').split('.')[0]
            writeToCanvas(canvasTitle,converter.makeHtml(await replaceEnv(txt,'CANVAS_COURSE_')))
        }
    })

}

function writeFile(targetFilename, result) {
    fs.writeFile(targetFilename, result, { 'encoding': 'utf8', 'flag': 'w+' },
                (err, txt) => {
                    if (err) { console.log(err); } else { //console.log(`${targetFilename} written`) 
                    }
                })
}

function runProcessOnRepo(sourceFolder = __dirname + '/src', targetFolder = __dirname + '/docs') {
    let folders = []
    fs.readdir(sourceFolder, (err, source) => {
        if (err) { console.log(err) }
        for (let sourceItem of source) {
            fs.stat(`${sourceFolder}/${sourceItem}`, (err, itemStat) => {
                if (err) { console.log(err) }
                else if (() => itemStat.isFolder()) {
                    folders.push(sourceItem)
                    processFolder(sourceItem, sourceFolder, targetFolder)
                }
            })
        }
    })
}

function processFolder(folderName, sourceFolder, targetFolder) {
    fs.exists(`${targetFolder}/${folderName}`, (exists) => exists ? processFilesInFolder(folderName, sourceFolder, targetFolder) : fs.mkdir(`${targetFolder}/${folderName}`, (err, res) => processFilesInFolder(folderName, sourceFolder, targetFolder)))
    writeModule(folderName)
}


function processFilesInFolder(folderName, sourceFolder, targetFolder) {
    fs.readdir(`${sourceFolder}/${folderName}`, (err, content) => {
        if (err) { console.log(err) }
        else {
            for (let file of content) {
                let filePrefix = file.split('.')[0]
                actionFile(`${sourceFolder}/${folderName}/${file}`, `${targetFolder}/${folderName}/${filePrefix}.md`,targetFolder)
            
            }
        }
    })
}

function writeToCanvas(title,text,url=PAGE_TARGET) {
    const options = {
        method: "PUT",
        body: JSON.stringify({'wiki_page':{'title':title,'body':text}}),
        headers: { 'Content-Type': 'application/json',
    'Authorization': 'Bearer '+process.env.CANVAS_API,
    'Accept': 'application/json' }}
    try {
        fetch(url+'/'+title,options);
    }
    catch (e)
    {console.log(e)}
}


async function writeModule(folder,url=MODULE_TARGET) {
    const options = {
        method: "POST",
        body: JSON.stringify({'module':{'name':folder}}),
        headers: { 'Content-Type': 'application/json',
    'Authorization': 'Bearer '+process.env.CANVAS_API,
    'Accept': 'application/json' }}
    try {
        const response = await fetch(url,options);
    }
    catch (e)
    {console.log(e)}
}



function action() {
    runProcessOnRepo()
}


action()