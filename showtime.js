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

function actionFile(filename, filePrefix, targetFolders) {
    converter = new showdown.Converter()
    fs.readFile(filename, { 'encoding': 'utf8' }, async (err, txt) => {
        if (err) { console.log(err); } else { 
            let mdTitle = targetFolders[0]+'/'+filePrefix+'.md'
            writeFile(mdTitle, await replaceEnv(txt,'MARKDOWN_VALUE_'))
            let pagesTitle = targetFolders[1]+'/'+filePrefix+'.html'
            writeFile(pagesTitle, await replaceEnv(converter.makeHtml(await replaceEnv(txt,'PAGES_VALUE_'))))
            let canvasTitle = filePrefix.replace('/','-')
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

function runProcessOnRepo(sourceFolder = process.cwd() + '/src', targetFolders= [process.cwd() + '/docs', process.cwd() + '/pages']) {
    let folders = []
    for (let targetFolder of targetFolders) {
    fs.exists(`${targetFolder}`,(exists)=>exists?true:fs.mkdirSync(`${targetFolder}`))
        }
    fs.readdir(sourceFolder, (err, source) => {
        if (err) { console.log(err) }
        for (let sourceItem of source) {
            fs.stat(`${sourceFolder}/${sourceItem}`, (err, itemStat) => {
                if (err) { console.log(err) }
                else if (() => itemStat.isFolder()) {
                    processFolders(sourceItem, sourceFolder, targetFolders)
                }
            })
        }
    })
}

function processFolders(folderName, sourceFolder, targetFolders) {
    for (let targetFolder of targetFolders) {
    fs.exists(`${targetFolder}/${folderName}`, (exists) => exists ? true : fs.mkdir(`${targetFolder}/${folderName}`, (err, res) => true))
    }
    processFilesInFolders(folderName, sourceFolder, targetFolders)
    //look into this later. it was just creating loads of useless blank modules.
    //writeModule(folderName)
}


function processFilesInFolders(folderName, sourceFolder, targetFolders) {
    fs.readdir(`${sourceFolder}/${folderName}`, (err, content) => {
        if (err) { console.log(err) }
        else {
            for (let file of content) {
                file = file.split('.')[0]
                actionFile(`${sourceFolder}/${folderName}/${file}.md`,folderName+'/'+file,targetFolders)
            }
        }
    })
}

async function writeToCanvas(title,text) {
    const PAGE_TARGET = process.env.CANVAS_BASE+`/api/v1/courses/${process.env.CANVAS_COURSE_ID}/pages`
    let url = PAGE_TARGET+'/'+title
    console.log(url)
    let key = process.env.CANVAS_API
    console.log(typeof key)
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
    let url = MODULE_TARGET
    const options = {
        method: "GET",
        headers: { 'Content-Type': 'application/json',
    'Authorization': 'Bearer '+process.env.CANVAS_API,
    'Accept': 'application/json' }}
    try {
        const response = await fetch(url+PAGES,options);
        //console.log(`list ${response.status}`)
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