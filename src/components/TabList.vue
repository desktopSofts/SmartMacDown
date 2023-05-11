<template>
    <ul className="nav nav-pills" style="border-bottom: 1px solid #fff;">
        <li className="nav-item" v-for="file in files" :key="file.id">
            <a href="#" style="border-radius:0px;color:#fff"
                :class="{ active: activeItem == file.id, unSaveMark: unSaveItems.includes(file.id) }" class="nav-link"
                @click="clickItem(file)">{{ file.title }}
                <span :class="{ 'icon-close': unSaveItems.includes(file.id) }" class="ml-1"
                    @click.stop="onClickClose(file)">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </span>

                <span v-if="unSaveItems.includes(file.id)" className="ml-1 rounded-circle">
                </span>

            </a>
        </li>

    </ul>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
const TAG = '[TabList]'
export default ({
    props: {
        files: Array,
        activeItem: String
        , unSaveItems: Array
    },
    emits: ['update:changeFile', 'update:closeFile']
    , created() {
        // props 会暴露到 `this` 上
        // console.log(this.activeItem)
        // console.log(this.unSaveItems)
    }
    , data() {
        return {
            classAActiveTrue: {
                'nav-link': true,
                'active': true
            }
            , classAActiveFalse: {
                'nav-link': true,
                'active': false
            }

        }
    }
    , methods: {
        clickItem(file) {
            console.log(TAG, file);
            this.$emit('update:changeFile', file.id)
        }
        , onClickClose(file) {
            console.log(TAG, "onClickClose called!" + file);
            this.$emit('update:closeFile', file.id)

        }
    }
})

</script>

<style scoped>
.unSaveMark:hover :deep(.icon-close) {
    display: inline-block;
}

.unSaveMark :deep(.icon-close) {
    display: none;
}

.unSaveMark:hover:deep(.rounded-circle) {
    display: none;
}

.unSaveMark:deep(.rounded-circle) {
    width: 11px;
    height: 11px;
    display: inline-block;
    background-color: #b80233;
}

.active {
    background-color: #3e403f !important;
}
</style>