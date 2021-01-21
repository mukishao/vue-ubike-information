<template>
  <div id="app" v-cloak>
      <div class="text-left">
      <h1>YouBike 臺北市公共自行車即時資訊</h1>
      <p>
        站點名稱搜尋: <search @search="handleSearch" />
      </p>
    </div>

    <ubike-table 
      :items-per-page="itemsPerPage"
      :page="currentPage"

      :search="searchName"

      :fields="fields"
      :headers="headers"
      :items="uBikeStops"

      :sort-field="sortField"
      :sort-asc="sortAsc"

      @pages-change="handlePagesChange"
      @page-change="handlePageChange"
      @sort-field="handleSortField"
      @sort-asc="handleSortAsc"
      @pin="handlePin"
    />

    <pagination 
      :page="currentPage" 
      :length="pages" 
      @input="handlePaginationInput" 
    />

  </div>
</template>

<script>
import Search from './components/Search'
import UbikeTable from './components/UbikeTable'
import Pagination from './components/Pagination'

export default {
  name: 'App',
  components: {
    Search,
    UbikeTable,
    Pagination
  },
  data() {
    return {
      // 分頁
      pages: 1,
      itemsPerPage: 50,
      currentPage: 1,

      // 搜尋欄位
      searchName: "",
      // 目前排序欄位
      sortField: null,
      // 排序方式
      sortAsc: null,

      // 表單欄位
      headers: [
        { text: '#',value: 'sno',},
        { text: '場站名稱', value: 'sna',},
        { text: '場站區域', value: 'sarea' },
        { text: '目前可用車輛', value: 'sbi', sortable: true },
        { text: '總停車格', value: 'tot', sortable: true },
        { text: '資料更新時間', value: 'mday' },
      ],
      fields: ['sno', 'sna', 'sarea', 'sbi', 'tot', 'mday'],
      uBikeStops: [],
    }
  },
  created() {
    // 欄位說明請參照:
    // http://data.taipei/opendata/datalist/datasetMeta?oid=8ef1626a-892a-4218-8344-f7ac46e1aa48

    // sno：站點代號、 sna：場站名稱(中文)、 tot：場站總停車格、
    // sbi：場站目前車輛數量、 sarea：場站區域(中文)、 mday：資料更新時間、
    // lat：緯度、 lng：經度、 ar：地(中文)、 sareaen：場站區域(英文)、
    // snaen：場站名稱(英文)、 aren：地址(英文)、 bemp：空位數量、 act：全站禁用狀態

    fetch("https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz")
      .then((res) => res.json())
      .then((res) => {
        // 將 json 轉陣列後存入 this.ubikeStops
        this.uBikeStops = Object.keys(res.retVal).map((key) => {
          return {
            sno: res.retVal[key]['sno'],
            sna: res.retVal[key]['sna'],
            sarea: res.retVal[key]['sarea'],
            sbi: res.retVal[key]['sbi'],
            tot: res.retVal[key]['tot'],
            mday: this.timeFormat(res.retVal[key]['mday']),
          }
        });
      });
  },
  methods:{
    timeFormat(t) {
      var date = [],
        time = [];

      date.push(t.substr(0, 4));
      date.push(t.substr(4, 2));
      date.push(t.substr(6, 2));
      time.push(t.substr(8, 2));
      time.push(t.substr(10, 2));
      time.push(t.substr(12, 2));

      return date.join("/") + " " + time.join(":");
    },

    // 事件處理
    handlePagesChange(pages) {
        this.pages = pages;
    },
    handlePageChange(currentPage) {
        this.currentPage = currentPage;
    },
    handleSearch(searchName) {
      this.searchName = searchName;
    },
    // 切換頁
    handlePaginationInput(newPageNum) {
      this.currentPage = newPageNum
    },
    handleSortField(newSortField) {
      this.sortField = newSortField
    },
    handleSortAsc(sortAsc) {
      this.sortAsc = sortAsc
    },
    // 釘選
    handlePin(targetStop, isPinned) {
      this.uBikeStops.some(stop => {
        if ( stop.sno == targetStop.sno ) {
          stop.isPinned = isPinned
        }
      })
    }
  },
}
</script>

<style>
@import url(https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css);
@import url(https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css);

body{
  padding: 1em;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

[v-cloak] {
  display: none;
}
</style>
