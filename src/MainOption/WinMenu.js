const { app, Menu } = require('electron')

const isMac = process.platform === 'darwin'

const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : []),
    // { role: 'fileMenu' }
    {
        label: '文件',
        submenu: [
            {
                label: '新建'
                , accelerator: 'CmdOrCtrl+N'
                , click(menuItem, browserWindow, event) {
                    browserWindow.webContents.send('execute-create-file')
                }
            }
            , {
                label: '保存'
                , accelerator: 'CmdOrCtrl + S'
                , click(menuItem, browserWindow, event) {
                    browserWindow.webContents.send('execute-save-file')

                }
            }
            , {
                label: '搜索'
                , accelerator: 'CmdOrCtrl+F'
                , click(menuItem, browserWindow, event) {
                    browserWindow.webContents.send('execute-search-file')

                }
            }
            , {
                label: '导入'
                , accelerator: 'CmdOrCtrl+O'
                , click(menuItem, browserWindow, event) {
                    browserWindow.webContents.send('execute-import-file')

                }
            }
            , isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    // { role: 'editMenu' }
    {
        label: '编辑',
        submenu: [
            { label: '撤销', accelerator: 'CmdOrCtrl + Z', role: 'undo' },
            { label: '重做', accelerator: 'Shift + CmdOrCtrl + Z', role: 'redo' },
            { type: 'separator' },
            { label: '剪切', accelerator: 'CmdOrCtrl + X', role: 'cut' },
            { label: '复制', accelerator: 'CmdOrCtrl + C', role: 'copy' },
            { label: '粘贴', accelerator: 'CmdOrCtrl + V', role: 'paste' },
            ...(isMac ? [
                // { role: 'pasteAndMatchStyle' },
                { label: '删除', accelerator: 'CmdOrCtrl + D', role: 'delete' },
                { label: '全选', accelerator: 'CmdOrCtrl + A', role: 'selectAll' },
                // { type: 'separator' },
                // {
                //     label: 'Speech',
                //     submenu: [
                //         { role: 'startSpeaking' },
                //         { role: 'stopSpeaking' }
                //     ]
                // }
            ] : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
            ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: '视图',
        submenu: [
            { label: '刷新', accelerator: 'CmdOrCtrl + R', role: 'reload' },
            { label: '强制刷新', role: 'forceReload' },
            { label: '开发者工具', role: 'toggleDevTools' },
            { type: 'separator' },
            {
                label: '最大化', accelerator: (() => {
                    if (isMac) {
                        return 'Ctrl + Command + F'
                    } else {
                        return 'F11'
                    }
                }), click(item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
                    }
                }
            },

            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: '窗口',
        submenu: [
            { label: '最小化', accelerator: 'CmdOrCtrl + M', role: 'minimize' },
            { role: 'zoom' },
            ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
            ] : [
                { role: 'close' }
            ])
        ]
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [
            {
                label: '联系我们',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('mailto:lichongmac@163.com')
                }
            }
        ]
    }
]

// const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)
module.exports = template