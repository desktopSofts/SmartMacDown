<template>
    <div className="list-group list-group-flush menu-box">
        <li v-for="file in files" :key="file.id" style="background: none;color: #fff;padding-left:18px"
            className="list-group-item d-flex align-items-center file-item" ref="id" :id="file.id">
            <span v-if="(editItem != file.id) && !file.isNew" className="col-1">
                <font-awesome-icon icon="fa-solid fa-file-lines" />
            </span>
            <span v-if="(editItem != file.id) && !file.isNew" className="col-7" v-on:click="editFile(file.id)">
                {{ file.title }}
            </span>
            <input v-if="(editItem == file.id) || file.isNew" className="col-7" :value="file.title" @input="setTitleValue"
                @keyup="keyupClick" />
            <span v-if="(editItem == file.id) || file.isNew" className="col-4" @click="closeEditStatus">
                <font-awesome-icon icon="fa-solid fa-xmark" />
            </span>
        </li>
    </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import useContextMenu from '../hooks/useContextMenu'
import { getParentNode } from '../utils/DomUtils'

import { objToArr } from '@/utils/FileUtils'
const TAG = '[FileList]'
let currentEle

export default ({

    props: {
        files: Object
        , editFileListItem: String
    },
    emits: ['update:editFile'
        , 'update:deleteFile'
        , 'update:reFileName'
        , 'update:editItem'
        , 'update:deleteFileRecord'

    ]
    , data() {
        return {
            editItem: '',
            value: ''

        }
    },
    beforeCreate() {
        console.log(TAG, 'beforeCreate() called!');

    },
    created() {
        console.log(TAG, 'created() called!');
        // props 会暴露到 `this` 上
        // console.log(this.files)
        console.log(TAG, this.editFileListItem)
        const renameItem = () => {
            console.log(TAG, 'created -deleteItem called!');
            let retNode = getParentNode(currentEle.value, 'file-item')
            this.editItem = retNode.id
            console.log(TAG, "editItem=" + this.editItem);

        }
        const deleteFileRecord = () => {
            let retNode = getParentNode(currentEle.value, 'file-item')
            this.$emit('update:deleteFileRecord', retNode.id)
        }
        const deleteItem = () => {
            let retNode = getParentNode(currentEle.value, 'file-item')
            this.deleteFile(retNode.id)

        }
        let contextTemp = [
            {
                label: '重命名',
                click: renameItem
            },
            {
                label: '删除记录'
                , click: deleteFileRecord
            }
            , {
                label: '删除记录&文件'
                , click: deleteItem
            }
        ]
        currentEle = useContextMenu(contextTemp, '.menu-box')
    }, beforeMonut() {
        console.log(TAG, 'beforeMonut() called!');

    }
    , mounted() {
        console.log(TAG, 'mounted() called!');

    }, beforeUpdate() {
        console.log(TAG, 'beforeUpdate() called!');
        let newFile = objToArr(this.files).find(file => file.isNew)
        if (newFile) {
            this.editItem = newFile.id
            this.value = newFile.title
            console.log(TAG, 'editItem=' + this.editItem);
        }


    }, updated() {
        console.log(TAG, 'updated called!');

    }
    , methods: {

        rightClick(id) {
            console.log(TAG, id);
            // currentEle=useContextMenu(contextTemp)
        },
        editFile(id) {
            console.log(TAG, 'editFile called! id=' + id)
            this.$emit('update:editFile', id)
        },
        deleteFile(id) {
            console.log(TAG, 'deleteFile called! id=' + id)
            this.$emit('update:deleteFile', id)
        }
        , setEditItem(file) {
            console.log(TAG, 'setEditItem called! file=' + file.id)
            this.editItem = file.id
            this.$emit('update:editItem', file.id)
        }
        , setTitleValue(e) {
            console.log(TAG, 'setTitleValue called! e=' + e.target.value);
            this.value = e.target.value
        }
        , closeEditStatus() {
            console.log(TAG, 'closeEditStatus called!');

            this.editItem = ''

        }
        , keyupClick(e) {
            const { keyCode } = e
            if (13 == keyCode && !this.editFile.id && this.value.trim() != '') {
                console.log(TAG, 'keyCode called! keyCode=13 value=' + this.value);
                let newFile = this.files[this.editItem]
                this.$emit('update:reFileName', this.editItem, this.value, newFile.isNew)

                this.closeEditStatus()
            }
            else if (27 == keyCode && this.editFile.id != -1) {
                console.log(TAG, 'esc called!');
                if (this.files[this.editItem].isNew) {
                    this.deleteFile(this.editItem)
                }
                this.closeEditStatus()
            }
        }

    },
    computed: {
        checkEditStatus(file) {
            return (this.editItem != file.id)
        }
    }
    , watch: {
        editFileListItem: {
            handler(newValue, oldValue) {
                console.log(TAG, "content:newValue=" + newValue + ",oldValue=" + oldValue);
            },
            deep: true
        }
    }

})

</script>