<template>
  <div className="App contaniner-fluid px-0">
    <div className="row no-gutters">
      <div style="position: relative; background-color: #7b8c7c; min-height:100vh;padding: 0;"
        className="col-3 left-panel">
        <SearchFile title="我的文档" :modelValue="searchText" @update:modelValue="modelValue"></SearchFile>
        <FileList :files="showFiles" @update:editFile="editFile" @update:deleteFile="deleteFile"
          @update:reFileName="saveFile"></FileList>

        <!-- <div class="btn_list">
          <ButtomItem title="新建" icon="fa-plus" classValue="background-color:red ;" @update:createFile="createFile" />
          <ButtomItem title="导入" icon="fa-file-import" @update:createFile="importFiles" />
        </div> -->
      </div>
      <div style="background-color:#c9d8cd;min-height:100vh;padding: 0;" className="col-9 right-panel">
        <TabList :files="openFiles" :activeItem="activeId" :unSaveItems="unSaveIds" @update:changeFile="changeFile"
          @update:closeFile="closeFile" />
        <MD_Editor v-if="activeFile" :content="!activeFile ? '' : activeFile.body"
          @update:markdownChange="markdownChange" @update:save="saveCurrentEditFile"/>
        <div v-else className="init-page">
          新建或者导入具体的文档
        </div>
      </div>

    </div>

  </div>
</template>

<script>
const TAG = "[APP]"

import { v4 } from 'uuid'
import 'bootstrap/dist/css/bootstrap.min.css'
import SearchFile from './components/SearchFiles.vue'
import FileList from './components/FileList.vue'
// import ButtomItem from './components/ButtomItem.vue'
import TabList from './components/TabList.vue'
import MD_Editor from './components/MD_Editor.vue'
import { readFile, writeFile, renameFile, deleteFile, objToArr, mapArr } from './utils/FileUtils'
import useIpcRenderer from './hooks/useIpcRenderer'

const path = window.require('path')
const { remote } = window.require('electron')
const Store = window.require('electron-store')
const savedPath = remote.app.getPath('desktop') + '/testMD'
// console.log(TAG,savedPath);
console.log(TAG, remote.app.getPath('userData'));

const fileStore = new Store({ 'name': 'filesInfo' })
fileStore.set('name', '==smartApi==')
console.log(TAG, fileStore.get('name'));

// store.delete('name')
// console.log(TAG,'删除后：'+store.get('name'));
// let filesFromStore=fileStore.get('files')||{}

export default {
  name: 'App',
  components: {
    SearchFile,
    FileList
    // ,ButtomItem
    , TabList
    , MD_Editor
  },
  data() {
    return {
      searchText: ''
      , tabItem: 1
      , files: fileStore.get('files') || {}
      , searchFiles: []
      , activeId: ''//当前正在编辑
      , openIds: []//当前已打开的文件
      , unSaveIds: []//当前未保存的文件

    }
  }
  ,mounted(){
    console.log(TAG,'mounted called!');
    useIpcRenderer({
      'execute-create-file':this.createFile
      ,'execute-save-file':this.saveCurrentEditFile
      ,'execute-import-file':this.importFiles
    }
    )
  }
  ,methods: {
    saveInforToStore(saveFiles) {
      console.log(TAG, 'saveInforToStore called!');
      const storeObj = objToArr(saveFiles).reduce((ret, file) => {
        const { id, title, createTime, path } = file
        ret[id] = {
          id,
          path,
          title,
          createTime
        }
        return ret
      }, {})
      fileStore.set('files', storeObj)
    }
    , saveCurrentEditFile() {
      console.log(TAG,'saveCurrentEditFile called!');
      writeFile(this.activeFile.path, this.activeFile.body).then(() => {
        this.unSaveIds = this.unSaveIds.filter(id => id != this.activeFile.id)
      })
    }
    , modelValue(keyWord) {
      console.log(TAG, "modelValue called newValue=" + keyWord)
      this.searchText = keyWord
      this.searchFiles = objToArr(this.files).filter(file => file.title.includes(keyWord))
    }
    , editFile(fileId) {
      console.log(TAG, 'editFile called!fileId=' + fileId);
      this.activeId = fileId
      const currentFile = this.files[fileId]
      if (!currentFile.isLoaded) {
        readFile(currentFile.path)
          .then((data) => {
            currentFile.isLoaded = true
            currentFile.body = data

          })
      }
      if (!this.openIds.includes(fileId))
        this.openIds.push(fileId)
    }
    , saveFile(id, newTitle, isNew) {
      console.log(TAG, 'saveFile called! newTitle=' + newTitle + ',id=' + id);
      const itemExsit = objToArr(this.files).find(file => file.title == newTitle)
      if (itemExsit) {
        newTitle += '_copy'
      }
      let newPath = isNew ? path.join(savedPath, newTitle + '.md') : path.join(path.dirname(this.files[id].path), newTitle + '.md')
      let itemFile = this.files[id]
      let oldPath = itemFile.path

      itemFile.title = newTitle
      itemFile.isNew = false
      itemFile.path = newPath
      if (isNew) {
        writeFile(newPath, itemFile.body).then(() => {
          this.saveInforToStore(this.files)
        })
      } else {
        renameFile(oldPath, newPath).then(() => {
          console.log(TAG, '重命名成功！newTitle=' + newTitle);
          this.saveInforToStore(this.files)
        })
      }
    }
    , createFile() {
      console.log(TAG, 'createFile called!');
      const newId = v4()
      const newFile = {
        id: newId,
        title: '',
        isNew: true,
        body: '## 初始化内容',
        createTime: new Date().getTime()
      }
      this.files[newId] = newFile
    }
    , importFiles() {
      console.log(TAG, 'importFiles called!');
      remote.dialog.showOpenDialog({
        defaultPath: __dirname
        , buttonLabel: '请选择'
        , title: '选择md文档'
        , properties: ['openFile', 'multiSelections']
        , filters: [{
          'name': 'md文档'
          , extensions: ['md']
        }
          , {
          'name': '其他类型'
          , extensions: ['js', 'html', 'json']
        }
        ]
      }).then((ret) => {
        let filePaths = ret.filePaths
        if (filePaths.length) {
          let validPaths = filePaths.filter(filePath => {
            const existed = Object.values(this.files).find(file => {
              return file.path == filePath
            })
            return !existed
          })
          const packageData = validPaths.map(filePath => {
            return {
              id: v4()
              , title: path.basename(filePath, '.md')
              , path: filePath
            }
          })
          const newFiles = { ...this.files, ...mapArr(packageData) }
          this.files = newFiles
          this.saveInforToStore(this.files)
          if (packageData.length) {
            remote.dialog.showMessageBox({
              type: 'info'
              , title: '导入md文档'
              , message: '文件导入成功'
            })
          }
        } else {
          console.log(TAG, '未选择文件导入');
        }

      })
    }
    , deleteFile(fileId) {
      console.log(TAG, 'deleteFile called!fileId=' + fileId);
      let itemFile = this.files[fileId]
      if (!itemFile.isNew) {
        deleteFile(itemFile.path).then(() => {
          console.log(TAG, '删除成功 title=' + itemFile.title);
          delete this.files[fileId]
          this.saveInforToStore(this.files)
          this.closeFile(fileId)
        })
      } else {
        delete this.files[fileId]
        this.saveInforToStore(this.files)
        this.closeFile(fileId)
      }


    }
    , changeFile(fileId) {
      console.log(TAG, 'changeFile called!fileId=' + fileId);
      this.activeId = fileId
    }
    , closeFile(fileId) {
      console.log(TAG, 'closeFile called!fileId=' + fileId);
      const retOpenFileIds = this.openIds.filter(id => id != fileId)
      this.openIds = retOpenFileIds
      if (this.openIds.length > 0) {
        this.activeId = this.openIds[0]
      } else {
        this.activeId = ''
      }
    }
    , markdownChange(newValue) {
      console.log(TAG, 'markdownChange called!value=' + newValue);
      this.activeFile.body = newValue
      writeFile(this.activeFile.path, this.activeFile.body).then(() => {
        this.unSaveIds.push(this.activeId)
      })
    }
  }
  , computed: {
    showFiles() {
      return this.searchFiles.length > 0 ? this.searchFiles : this.files
    }
    , openFiles() {
      let fileList = []
      this.openIds.forEach(id => {
        if (this.files[id]) {
          fileList.push(this.files[id])
        }
      })
      return fileList
    }
    , activeFile() {
      return this.files[this.activeId]
    }

  }
}
</script>

<style>
.init-page {
  color: #888;
  text-align: center;
  font: normal 28px/300px '微软雅黑'
}

.btn_list {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;

}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* margin-top: 10px; */
}
</style>
