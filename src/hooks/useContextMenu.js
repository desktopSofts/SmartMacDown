const { remote } = window.require('electron')

import { ref } from 'vue'

const TAG = '[useContextMenu]'
const Menu = remote.Menu

function useContextMenu(contextMenu, areaClass) {
    console.log(TAG, 'areaClass=' + areaClass);
    let currentEle = ref('')
    let menu = Menu.buildFromTemplate(contextMenu)
    const contextMenuHandle = (ev) => {
        const areaEle = document.querySelector(areaClass)
        console.log(TAG, 'areaEle=' + areaEle);
        if (areaEle.contains(ev.target)) {
            currentEle.value = ev.target
            console.log(TAG, currentEle);
            menu.popup({ window: remote.getCurrentWindow() })
        }

    }
    window.addEventListener('contextmenu', contextMenuHandle)
    return currentEle
}

export default useContextMenu