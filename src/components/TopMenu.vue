<!-- 顶部菜单栏 
菜单

团队

新建按钮

Cookie管理

归档管理

分享项目

全局参数

环境设置 Mock环境、默认环境

查看当前环境

同步数据

消息

同步日志

个人中心或登录按钮

协作邀请


-->
<template>
    <div>
        <button>菜单</button>
        <select name="team" v-model="team">
            <option value="离线团队">离线团队</option>
            
        </select>
        <button>新建</button>

        <button>Cookie管理</button>

        <button>归档管理</button>
        
        <button>分享项目</button>
        
        <button>全局参数</button>

        <select name="" v-model="environment">
            <option value="默认环境">默认环境</option>
            <option value="Mock环境">Mock环境</option>
            
        </select>

        <button>查看当前环境</button>

        <button>同步数据</button>

        <button>消息</button>

        <button>同步日志</button>

        <button type="">登录</button>

        <button>协作邀请</button>

    </div>

</template>

<script>
export default {
  name: 'TopMenu',
  props:{
        message:{
            type:String,
            default:"你好"
        }
  },
  data(){
    return {
        environment:"默认环境",
        team:'离线团队'
    }
  },
  setup(props){
    console.log(props.message);
  },
  mounted(){

  }
}
</script>