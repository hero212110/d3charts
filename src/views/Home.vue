<template>
  <div>
    <div style="width:100%;background-color:white">
      <div v-if="histogramchartdata">
        <HistogramChart :data="histogramchartdata" :dateType="dateType"></HistogramChart>
        <HistogramChart :data="histogramchartdata" :dateType="dateType"></HistogramChart>
        <HistogramChart :data="histogramchartdata" :dateType="dateType"></HistogramChart>
      </div>

      <div v-if="barchartdata">
        <BarChart :data="barchartdata" :dateType="dateType" ></BarChart>
        <BarChart :data="barchartdata" :dateType="dateType" ></BarChart>
        <BarChart :data="barchartdata" :dateType="dateType" ></BarChart>
      </div>

      <div v-if="chartdata">
        <LineChart :data="chartdata" :dateType="dateType"></LineChart>
        <LineChart :data="chartdata" :dateType="dateType"></LineChart>
        <LineChart :data="chartdata" :dateType="dateType"></LineChart>
      </div>

      <v-select style="width:15%;margin-left:37%" :options="dateTypeArr" v-model="dateType"></v-select>
    </div>
  </div>
</template>

<script>
//import * as d3 from "d3";
import LineChart from "@/components/LineChart";
import HistogramChart from "@/components/HistogramChart";
import BarChart from "@/components/BarChart";
export default {
  components: { LineChart, HistogramChart, BarChart },
  data: function() {
    return {
      data: null,
      bardata: null,
      histogramdata: null,
      box: null,
      dateTypeArr: ["年", "月", "日"],
      dateType: null
    };
  },
  mounted() {
    //用require讀取本地json檔, 檔案必須放在src資料夾下,檔通常放置在assets資料夾內
    // let a = require("@/assets/0050day.json");
    // console.log(a);
    this.dateType = "年";
    this.sendApi();
    this.sendApi2();
  },
  computed: {
    chartdata() {
      if (!this.data | !this.dateType) return null;
      //console.log(this.data);
      return this.data;
    },
    histogramchartdata() {
      if (!this.histogramdata | !this.dateType) return null;
      //console.log(this.histogramdata);
      return this.histogramdata;
    },
    barchartdata() {
      if (!this.bardata | !this.dateType) return null;
      return this.bardata;
    },
  },
  methods: {
    sendApi() {
      let url = `_0123${this.dateType_en(this.dateType)}.json`;
      //console.log(url);
      this.axios.get(url).then(
        response => {
          //console.log(response.data);
          //linedata here
          let dataArr = [];
          for (let i in response.data) {
            let obj = {};
            obj.name = response.data[i][0]["證券名稱"];
            obj.values = [];
            for (let j in response.data[i]) {
              //如果最高標借單價是null, 就不要用那筆資料, 直接skip
              if (response.data[i][j]["最高標借單價"] != null) {
                let o = {};
                let newDate = new Date();
                newDate.setTime(response.data[i][j]["標借日期"]);
                o.date = newDate.toString();
                o.price = response.data[i][j]["最高標借單價"];
                obj.values.push(o);
              }
            }
            dataArr.push(obj);
          }
          //console.log(dataArr);
          this.data = dataArr;

          //bardata
          let barObj = {};
          barObj.name = [];
          barObj.date = [];
          barObj.value = [];
          for (let i in response.data) {
            barObj.name.push(response.data[i][0]["證券名稱"]);
            let tmpDate = [];
            let tmpValue = [];
            for (let j in response.data[i]) {
              let newDate = new Date();
              newDate.setTime(response.data[i][j]["標借日期"]);
              tmpDate.push(newDate.toString());

              response.data[i][j]["最高標借單價"] == null ? tmpValue.push(0) : tmpValue.push(response.data[i][j]["最高標借單價"]);

              // tmpValue.push(response.data[i][j]["最高標借單價"]);
            }
            barObj.date.push(tmpDate);
            barObj.value.push(tmpValue);
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
    sendApi2() {
      let url = `_0050${this.dateType_en(this.dateType)}.json`;
      this.axios.get(url).then(response => {
        //console.log(response.data);
        //histogramdata here
        let hisObj = {};
        hisObj.name = [];
        hisObj.date = [];
        hisObj.value = [];
        hisObj.value.push([]);
        hisObj.name.push(response.data[0]["證券名稱"]);
        for (let i in response.data) {
          let newDate = new Date();
          newDate.setTime(response.data[i]["標借日期"]);
          hisObj.date.push(newDate.toString());

          response.data[i]["最高標借單價"] == null ?  hisObj.value[0].push(0) :  hisObj.value[0].push(response.data[i]["最高標借單價"])

          //hisObj.value[0].push(response.data[i]["最高標借單價"]);
        }
        //console.log(hisObj);
        this.histogramdata = hisObj;
      });
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
      if (!this.histogramdata | !value) return null;
      this.sendApi2();
    }
  }
};
</script>
