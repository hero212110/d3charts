<template>
  <div>
    <div style="width:100%;background-color:white">
      <div v-if="barchartdata">
      <BarChart :data="barchartdata" :dateType="dateType"></BarChart>
      </div>

      <!-- <BarChart></BarChart> -->

      <div v-if="chartdata">
        <LineChart :data="chartdata" :dateType="dateType"></LineChart>
      </div>
      
      <v-select style="width:7%;margin-left:37%" :options="dateTypeArr" v-model="dateType"></v-select>
    </div>
    
  </div>
</template>

<script>
//import * as d3 from "d3";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
export default {
  components: { LineChart, BarChart },
  data: function() {
    return {
      data: null,
      bardata: null,
      box: null,
      dateTypeArr: ["年", "月", "日"],
      dateType: null
    };
  },
  mounted() {
    this.dateType = "年";
    this.sendApi();
  },
  computed: {
    chartdata() {
      if (!this.data | !this.dateType) return null;
      //console.log(this.data);
      return this.data;
    },
    barchartdata() {
      if (!this.bardata | !this.dateType) return null;
      //console.log(this.bardata);
      return this.bardata;
    }
  },
  methods: {
    sendApi() {
      let url = `0050${this.dateType_en(this.dateType)}.json`;
      //console.log(url);
      this.axios.get(url).then(
        response => {
          //console.log(response.data);
          //linedata here
          let dataArr = [];
          let obj = {};
          obj.names = response.data[0]["證券名稱"];
          obj.values = [];
          for (let i in response.data) {
            let o = {};
            let newDate = new Date();
            newDate.setTime(response.data[i]["標借日期"]);

            o.date = newDate.toString();
            //console.log(o.date);
            o.price = response.data[i]["最高標借單價"];
            obj.values.push(o);
          }
          dataArr.push(obj);
          //console.log(dataArr);
          this.data = dataArr;

          //bardata here
          let barObj = {};
          barObj.name = [];
          barObj.date = [];
          barObj.value = [];
          barObj.value.push([]);
          barObj.name.push(response.data[0]["證券名稱"]);
          for (let i in response.data) {
            let newDate = new Date();
            newDate.setTime(response.data[i]["標借日期"]);
            barObj.date.push(newDate.toString());
            barObj.value[0].push(response.data[i]["最高標借單價"]);
          }
          //console.log(barObj);
          this.bardata = barObj;
        },
        error => {
          //console.log("error msg:", error);
          let status = error.response.status;
          if (status === 404) {
            this.data = null;
          }
        }
      );
    },
    dateType_en(value) {
      let en = ["year", "month", "day"];
      let cn = ["年", "月", "日"];
      let tmp = "";
      for (let i in en) {
        value == cn[i] ? (tmp = en[i]) : "";
      }
      return tmp;
    }
  },
  watch: {
    dateType(value) {
      //console.log(value);
      if (!this.data | !value) return null;
      this.sendApi();
    }
  }
};
</script>

