const { ipcRenderer } = window.require('electron')

const useIpcRenderer=(actionMap)=>{
    Object.keys(actionMap).forEach((action)=>{
        ipcRenderer.on(action,actionMap[action])
    })
    return ()=>{
        Object.keys(actionMap).forEach((action)=>{
            ipcRenderer.removeListener(action,actionMap[action])
        })
    }
}

export default useIpcRenderer