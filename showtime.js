var showdown = require('showdown')
var fs = require('fs')
require('dotenv').config();

function replaceEnv(txt) {
    const PREFIX = '$'
    const CC= Object.keys(process.env).filter(x=>x.startsWith('CANVAS_COURSE_')).map(x=>[PREFIX+x.replace('CANVAS_COURSE_',''),process.env[x]])
    for (let item of CC) {
        console.log(item[0], item[1])
        txt = txt.replaceAll(item[0], item[1])
    }
    return txt
}

function bulb(filename, targetFilename) {
    converter = new showdown.Converter()
    console.log(filename)
    fs.readFile(filename, { 'encoding': 'utf8' }, (err, txt) => {
        if (err) { console.log(err); } else {
            txt = replaceEnv(txt)
            result = converter.makeHtml(txt)
            console.log(result)
            fs.writeFile(targetFilename, result, { 'encoding': 'utf8', 'flag': 'w+' },
                (err, txt) => {
                    if (err) { console.log(err); } else { console.log(`${targetFilename} written`) }
                })
        }
    })
}

function light(sourceFolder = __dirname + '/src', targetFolder = __dirname + '/pub') {
    let folders = []
    fs.readdir(sourceFolder, (err, source) => {
        if (err) { console.log(err) }
        console.log(source)
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
}


function processFilesInFolder(folderName, sourceFolder, targetFolder) {
    fs.readdir(`${sourceFolder}/${folderName}`, (err, content) => {
        if (err) { console.log(err) }
        else {
            for (let file of content) {
                let filePrefix = file.split('.')[0]
                bulb(`${sourceFolder}/${folderName}/${file}`, `${targetFolder}/${folderName}/${filePrefix}.html`)
            }
        }
    })
}

light()