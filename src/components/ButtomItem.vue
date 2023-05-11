<template>
    <p style="border-radius:0;width: 50%; color: #fff; border: 0; margin-bottom: 0 !important;" className="btn"
        @click="createFile">
        <font-awesome-icon :icon="icon" />
        <span className="ml-3">{{ title }}</span>
    </p>
</template>
<script>
import 'bootstrap/dist/css/bootstrap.min.css'
const TAG ='[ButtomItem]'
export default ({
    props: {
        title: String,
        icon: String,
        classValue: String
    },
    emits: ['update:createFile']
    ,methods:{
        createFile(){
            console.log(TAG,'createFile called!');
            this.$emit('update:createFile')
        }
    }
})
</script>

<style></style>