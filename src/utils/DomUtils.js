export const getParentNode =(node,parentClassName)=>{
    let currentEle=node
    while(currentEle!=null){
        if(currentEle.classList.contains(parentClassName)){
            return currentEle
        }
        currentEle = currentEle.parentNode
    }
    return false
}