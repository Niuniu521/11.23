
<template>
  <div class="content">
    <div class="leftContent">
      <Chart height="150px" :chartData="val"/>
    </div>
    <div class="rightContent">
      <Chart height="150px" :chartData="val2"/>
    </div>
  </div>
</template>

<script>
import Chart from './Chart';
import {indicatorsData} from './indicators'
export default {
  components: {
    Chart,
  },
  data() {
    return {
     area:{},
      val: {
        title: "平均指标",
        company: "",
        value: ""
      },
      val2: {
        title: "本次指标",
        company: "",
        value: ""
      }
    }
  },
watch:{
area:{
  handler(newVal,oldVal){
    console.log(newVal)
    if(newVal.area.data.name=="海宁市"){
    let  query= 330481
     this.getDashboard(query)
    }else if(newVal.area.data.name=="海盐县"){
       let  query= 330424
     this.getDashboard(query)
    }else if(newVal.area.data.name=="嘉善县"){
       let  query= 330421
     this.getDashboard(query)
    }else if(newVal.area.data.name=="南湖区"){
       let  query= 330402
     this.getDashboard(query)
    }else if(newVal.area.data.name=="平湖市"){
       let  query= 330482
     this.getDashboard(query)
    }else if(newVal.area.data.name=="桐乡市"){
       let  query= 330483
     this.getDashboard(query)
    }else if(newVal.area.data.name=="秀洲区"){
       let  query= 330411
     this.getDashboard(query)
    }
  },
  deep:true,
  immediate:true,
}
},
  mounted() {
    //  this.getDashboard()
    this.area=this.$store.state.area
    console.log(this.area.data)
    if(this.area.data==undefined){
      let query=330400
      this.getDashboard(query)
    }
  },
methods:{
  getDashboard(val){
      let areaCode=val
      let query={areaCode}
    indicatorsData(query).then(response => {
      console.log(response)
     this.val.value=response.avgValue;
      this.val2.value=response.latestValue;
      let number=Number(this.val.value)
      let numberTow=Number(this.val2.value)
      if(number>=0&&number<=25){
        this.val.company="较轻"
      }
      else if(number>25&&number<=40){
        this.val.company="一般"
      }
       else if(number>40&&number<=80){
        this.val.company="严重"
      }
        else if(number>80&&number<=150){
        this.val.company="较严重"
      }
       else if(number>150){
        this.val.company="非常严重"
      }

       if(numberTow>=0&&numberTow<=25){
        this.val2.company="较轻"
      }
      else if(numberTow>25&&numberTow<=40){
        this.val2.company="一般"
      }
       else if(numberTow>40&&numberTow<=80){
        this.val2.company="严重"
      }
        else if(numberTow>80&&numberTow<=150){
        this.val2.company="较严重"
      }
       else if(numberTow>150){
        this.val2.company="非常严重"
      }
    })
    
  },
}
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  width: 100%;

  .leftContent, .rightContent {
    width: 50%;
  }
}

</style>
