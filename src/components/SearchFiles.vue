<template>
    <div v-if="!searchActive" style="border-bottom: 1px solid #fff; padding-left: 8px;"
        className="d-flex align-items-center justify-content-between">
        <span class="span">{{ title }}</span>
        <span class="span" @click="setSearchActive(true)">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
        </span>

    </div>
    <div v-else style="border-bottom: 1px solid #fff;" className="d-flex align-items-center justify-content-between">
        <input ref="inputSearchValue" class="input" :value="txt" @input="changeValue" @keyup="keyupClick" />

        <span class="span" @click="setSearchActive(false)">
            <font-awesome-icon icon="fa-solid fa-xmark" />
        </span>
    </div>
</template>


<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import useIpcRenderer from '../hooks/useIpcRenderer'

const TAG = '[SearchFiles]'




export default {
    props: {
        title: String,
        modelValue: String,

    },
    emits: ['update:modelValue'],
    data() {
        return {
            searchActive: false,
            txt: ''
        }
    }
    , mounted() {
        console.log(TAG, 'mounted called!');
        useIpcRenderer({
            'execute-search-file': this.setSearchActive
        })
    }
    , methods: {
        changeValue(e) {
            console.log(TAG, 'changeValue called!value=' + e.target.value)
            this.txt = e.target.value

        },
        setSearchActive(value) {
            this.searchActive = value
            if (value) {
                //光标失效 因为没有挂载input 
                // v-show 和className 冲突 无法正常使用
                // console.log(this.$refs.inputSearchValue);
                // this.$refs.inputSearchValue.focus()
            } else {
                this.txt = ''
                this.$emit('update:modelValue', this.txt)
            }
            
        },
        keyupClick(e) {
            // console.log(e.keyCode);
            const { keyCode } = e
            if (13 == keyCode && this.searchActive)
                this.$emit('update:modelValue', this.txt)
            else if (27 == keyCode && this.searchActive) {
                this.setSearchActive(false)
                this.txt = ''
                this.$emit('update:modelValue', this.txt)
            }
        }

    }
}
</script>

<style>
.input {
    margin-left: 10px;
    border: none;
    border-radius: 4px;
}

.span {
    color: #fff;
    padding: 0 10px;
    font: normal 16px/40px '微软雅黑'
}
</style>