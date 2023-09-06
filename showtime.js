var showdown = require('showdown')
var fs = require('fs')
const fetch = require('node-fetch')
require('dotenv').config();



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
            writeFile(targetFilename, await replaceEnv(txt,'MARKDOWN_VALUE_'))
            let canvasTitle = targetFilename.slice(-8,-3).replace('/','-')
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

function runProcessOnRepo(sourceFolder = process.cwd() + '/src', targetFolder = process.cwd() + '/docs') {
    let folders = []
    fs.exists(`${targetFolder}`,(exists)=>exists?true:fs.mkdirSync(`${targetFolder}`))
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
    //look into this later. it was just creating loads of useless blank modules.
    //writeModule(folderName)
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

async function writeToCanvas(title,text) {
    const PAGE_TARGET = process.env.CANVAS_BASE+`/api/v1/courses/${process.env.CANVAS_COURSE_ID}/pages`
    let url = PAGE_TARGET+'/'+title
    console.log(url)
    let key = await process.env.CANVAS_API
    console.log(key.length())
    const options = {
        method: "PUT",
        body: JSON.stringify({'wiki_page':{'title':title,'body':text}}),
        headers: { 'Content-Type': 'application/json',
    'Authorization': 'Bearer '+key,
    'Accept': 'application/json' }}
    try {
        const response = await fetch(url,options);
        console.log(`${title} - ${response.status}`)
    }
    catch (e)
    {console.log(e)}
}


async function writeModule(folder,url=MODULE_TARGET) {
    const options = {
        method: "PUT",
        body: JSON.stringify({'module':{'name':folder,'position':parseInt(folder)||0}}),
        headers: { 'Content-Type': 'application/json',
    'Authorization': 'Bearer '+process.env.CANVAS_API,
    'Accept': 'application/json' }}
    try {
        const response = await fetch(url,options);
        console.log(`${folder} - ${response.status}`)
    }
    catch (e)
    {console.log(e)}
}



async function listModules() {
    const MODULE_TARGET= process.env.CANVAS_BASE+`/api/v1/courses/${process.env.CANVAS_COURSE_ID}/modules`
    const PAGES = "?per_page=30"
    const MODULES_TO_KEEP = [
        35910,
        39059,
        39061,
        39065,
        39062,
        39064,
        39066,
        39069,
        39060,
        39063,
        39067,
        39068
    ]
    let url = MODULE_TARGET
    const options = {
        method: "GET",
        headers: { 'Content-Type': 'application/json',
    'Authorization': 'Bearer '+process.env.CANVAS_API,
    'Accept': 'application/json' }}
    try {
        const response = await fetch(url+PAGES,options);
        console.log(`list ${response.status}`)
        response.json().then(x=> x.map((y)=>y['id']).filter((z) => !MODULES_TO_KEEP.includes(z) ).forEach(element => deleteModule(element)))
    }
    catch (e)
    {console.log(e)}
}

async function deleteModule(moduleId){
    const MODULE_TARGET= process.env.CANVAS_BASE+`/api/v1/courses/${process.env.CANVAS_COURSE_ID}/modules`
    let url = MODULE_TARGET + '/' + moduleId
    const options = {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json',
    'Authorization': 'Bearer '+process.env.CANVAS_API,
    'Accept': 'application/json' }}
    try {
        const response = await fetch(url,options);
        console.log(`delete ${moduleId} ${response.status}`)
    }
    catch (e)
    {console.log(e)}
}




function action() {
    runProcessOnRepo()
}


action()