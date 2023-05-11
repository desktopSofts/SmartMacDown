<template>
  <div id="editor">
    <mavon-editor style="height: 100%;" v-model="text" @change="markdownChange" @save="save"></mavon-editor>
  </div>
</template>
<script>
// Local Registration
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const TAG = '[MD_Editor]'

export default {
  name: 'MDeditor',
  components: {
    mavonEditor
    // or 'mavon-editor': mavonEditor
  }
  , props: {
    content: {
      type: String,
      default: ''
    }
  }
  ,emits: ['update:markdownChange','update:save']
  , created() {
    console.log(TAG, 'content=' + this.content);
    this.text = this.content
  }
  , data() {
    return {
      text: ''
    }
  }
  , watch: {
    content: {
      handler(newValue, oldValue) {
        console.log(TAG, "content:newValue=" + newValue + ",oldValue=" + oldValue);
        this.text = newValue
      },
      deep: true
    }
    // , text: {
    //   handler(newValue, oldValue) {
    //     console.log(TAG, "text:newValue=" + newValue + ",oldValue=" + oldValue);

    //   }

    }
    , methods: {
    markdownChange(value, render) {
      console.log(TAG, 'markdownChange  called!value=' + value + ',render=' + render);
      if(value!=this.content){
        this.$emit('update:markdownChange', value)
      }
    }
    ,save(){
      console.log(TAG,'save called!');
      this.$emit('update:save')
    }
  }
  }
</script>
<style>
#editor {
  margin: auto;
  width: 100%;
  height: 580px;
}
</style>